# RENCANA MIGRASI PRODUKSI — KARYAKU

| Informasi | Nilai |
| --- | --- |
| Versi | 1.0 (rencana, belum diimplementasikan) |
| Tanggal | 2026-11-19 |
| Status | Usulan arsitektur untuk ditinjau |
| Referensi | `SPEC.md`, `UI-SPEC.md`, `TASKS.md` |
| Fokus | Migrasi penyimpanan dari localStorage ke backend Node.js + PostgreSQL/Supabase |

> **Dokumen ini hanya rencana.** Tidak ada backend sungguhan, login sungguhan, kredensial produksi, kunci API, atau perubahan konsep aplikasi yang diimplementasikan di repository ini. Prototipe lokal tetap menggunakan akun demo `pengrajin / karyaku-demo`, kunci `karyaku:products:v1`, dan sesi demo `karyaku_session_v1`.

---

## 1. Kondisi saat ini

KARYAKU saat ini adalah aplikasi Vite + JavaScript vanilla sepenuhnya sisi klien:

- Katalog publik, detail produk, profil pengrajin generik, dan tombol WhatsApp demo tetap dipertahankan.
- Produk disimpan di `localStorage` dengan kunci `karyaku:products:v1`; sesi demo di `karyaku_session_v1`.
- Dashboard pengrajin adalah prototipe lokal: bukan sistem autentikasi dan bukan multiuser.
- Tidak ada server, cookie, token, permintaan jaringan eksternal, atau data pribadi nyata.

Konsep yang **tidak berubah** setelah migrasi: katalog tanpa login, lima kategori, format Rupiah `id-ID`, ilustrasi lokal, label **Demo**, dan batasan bukan marketplace.

---

## 2. Target arsitektur

```text
┌────────────────┐        HTTPS        ┌────────────────────────┐
│     Browser    │ ──────────────────▶ │  Reverse proxy / CDN   │
│  Vite UI (JS)  │                     │  TLS, WAF, rate limit  │
└───────┬────────┘                     └───────────┬────────────┘
        │ (hanya prototipe)                        │
        ▼                                          ▼
┌────────────────┐                 ┌──────────────────────────────┐
│  localStorage  │                 │        Node.js API           │
│ karyaku:...v1  │                 │ cookie → CSRF → RBAC         │
└────────────────┘                 │ → validasi → service         │
                                   │ → audit log                  │
                                   └──────┬─────────────┬─────────┘
                                          │             │
                                          ▼             ▼
                            ┌───────────────────┐ ┌────────────────────┐
                            │ PostgreSQL /     │ │ Object storage     │
                            │ Supabase (RLS)   │ │ privat (foto)      │
                            └───────────────────┘ └────────────────────┘
```

Prinsip: frontend tetap menyajikan katalog publik, tetapi semua penulisan produk lewat API server. Server menjadi satu-satunya sumber kebenaran untuk identitas, peran, kepemilikan data, dan validasi.

---

## 3. Autentikasi aman

- Ganti kredensial demo dengan akun nyata: email unik + password, **hash Argon2id** (alternatif: bcrypt faktor ≥ 12). Password tidak pernah disimpan plaintext dan tidak dikirim ke log.
- Kebijakan password minimal 12 karakter, verifikasi email, dan MFA/TOTP untuk peran `pengrajin` dan `admin`.
- Pembatasan laju login (mis. 5 percobaan / 15 menit per IP + akun), *backoff* progresif, dan pencatatan kegagalan ke audit log.
- Rahasia aplikasi disimpan di *secret manager* / environment variabel, bukan di source code atau repository.
- Wajib HTTPS; header keamanan: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`.
- Semua endpoint bertanggung jawab memvalidasi sesi; tidak ada endpoint CRUD yang dipercaya hanya karena disembunyikan di UI.
- Akun demo `pengrajin / karyaku-demo` **dihapus total** di lingkungan produksi.

---

## 4. Session cookie HttpOnly, Secure, SameSite

Gunakan session sisi server dengan cookie, bukan token di `localStorage`:

```http
Set-Cookie: __Host-karyaku_session=<random-128bit>;
  HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

- **HttpOnly**: cookie tidak bisa dibaca JavaScript, sehingga mengurangi risiko pencurian sesi lewat XSS.
- **Secure**: cookie hanya dikirim melalui HTTPS.
- **SameSite=Lax** (atau `Strict` untuk area dashboard): membantu mencegah CSRF; tetap dipasangkan token CSRF untuk metode `POST/PUT/PATCH/DELETE`.
- Awalan `__Host-` mengharuskan `Secure`, `Path=/`, dan tanpa atribut `Domain`.
- Data session disimpan di Redis atau tabel `sessions` pada PostgreSQL: kedaluwarsa idle + absolut, rotasi ID saat login dan saat perubahan hak, serta penghancuran saat logout.
- Token CSRF synchronizer/double-submit dikirim via header, terikat pada sesi, dan diverifikasi di middleware sebelum mutasi.

---

## 5. RBAC di server

Peran: `pengunjung` (publik), `pengrajin` (pemilik katalog), `admin` (operator).

| Aksi | pengunjung | pengrajin | admin |
| --- | --- | --- | --- |
| Lihat katalog & detail | Ya | Ya | Ya |
| Tambah/edit/hapus produk sendiri | Tidak | Ya | Ya |
| Ubah produk milik pengrajin lain | Tidak | Tidak | Ya |
| Ekspor/impor data akun sendiri | Tidak | Ya | Ya |
| Lihat audit log | Tidak | Tidak | Ya |

- Peran dibaca **dari sesi server**, bukan dari `localStorage`, hash, atau input form.
- Terapkan *deny by default* di middleware dan di layer service; UI hanya menyembunyikan tombol, bukan menjadi kontrol keamanan.
- Pemisahan `admin` dan `pengrajin` dijaga dengan kebijakan terpisah agar eskalasi hak tidak mungkin dari endpoint CRUD biasa.

---

## 6. Isolasi data pemilik

- Tambahkan kolom `owner_id` pada tabel `products` (dan `images`), diisi dari sesi server, **bukan** dari body request.
- Setiap query produk oleh pengrajin wajib memakai `WHERE owner_id = :session.ownerId`; gunakan satu repository/service agar tidak ada query yang terlewat.
- Ekspor/impor JSON juga dibatasi pada `owner_id` yang sedang login.
- File gambar disimpan di object storage privat dengan nama generated; akses lewat URL bertanda tangan (*signed URL*) dan pemeriksaan kepemilikan.
- Uji IDOR: coba akses `id` produk orang lain sebagai `pengrajin` → harus ditolak dengan `403/404`.
- Gunakan UUID/ULID untuk ID eksternal agar tidak mudah ditebak; ID lama `prod-001` dipetakan saat migrasi.

---

## 7. Audit log

Tabel append-only `audit_log`:

| Kolom | Isi |
| --- | --- |
| `id`, `occurred_at` | Identitas dan waktu kejadian (UTC) |
| `actor_id`, `actor_role` | Pelaku dari sesi server |
| `action`, `entity_type`, `entity_id` | Mis. `product.update`, `product`, UUID |
| `before`, `after` | JSONB ringkas (field sensitif ditutup/mask) |
| `ip`, `user_agent`, `result` | Konteks dan status `success`/`failure` |

- Dicatat: login gagal/berhasil, logout, tambah/ubah/hapus produk, impor, ekspor, reset, dan perubahan peran.
- Nomor WhatsApp dan data pribadi lain di-*mask* sebelum ditulis ke log.
- Retensi misal 12 bulan; akses hanya `admin`; penyimpanan bersifat immutable/WORM dan dipantau untuk anomali.
- Audit log tidak bisa dihapus lewat endpoint CRUD produk biasa.

---

## 8. Validasi input

- Server memakai skema (mis. Zod) yang mencerminkan `SPEC.md` 4.1 + field `stok`:

| Field | Aturan server |
| --- | --- |
| `nama` | string 3–80 karakter, wajib |
| `kategori` | enum: anyaman, keramik, ukiran, tekstil, aksesori |
| `harga` | integer ≥ 0 |
| `stok` | integer ≥ 0 |
| `deskripsi` | string 10–500 karakter |
| `bahan` | string 3–120 karakter |
| `imageUrl` | path/object key internal atau data URL; menolak `http(s)://` eksternal |
| `namaPengrajin` | string 3–80 karakter |
| `unggulan` | boolean |

- Menolak field yang tidak dikenal, membatasi ukuran body, dan mengembalikan kode error konsisten.
- Upload: periksa MIME + *magic bytes*, maksimal 2 MB, simpan dengan nama generated, pindai malware, lalu referensikan dari DB.
- Teks pengguna tetap dirender sebagai teks (`textContent`), bukan HTML; `innerHTML`/`eval` tetap dilarang.
- Validasi klien boleh dipakai untuk umpan balik, tetapi **server tetap authoritative**.

---

## 9. Row Level Security (RLS) — jika memakai Supabase

RLS menjadi pertahanan berlapis, bukan pengganti RBAC di server:

- Aktifkan RLS pada `products`, `images`, `sessions`, `audit_log`, dan `profiles`.
- `products`: kebijakan `SELECT` untuk katalog pubblic/terbit; `INSERT/UPDATE/DELETE` hanya bila `owner_id = auth.uid()`.
- `audit_log`: `SELECT` hanya untuk peran admin; tidak ada kebijakan tulis untuk klien.
- Kunci `service_role` hanya dipakai di server dan tidak pernah dikirim ke browser; browser memakai kunci `anon` + JWT sesi pengguna bila perlu akses langsung.
- Uji kebijakan dengan dua akun pengrajin: akun A tidak boleh melihat/mengubah produk akun B.
- Jika memakai PostgreSQL mandiri tanpa Supabase, terapkan kebijakan yang sama lewat *database roles* + `SET LOCAL app.current_owner` pada setiap transaksi.

---

## 10. Pemetaan data

| Field localStorage | Kolom PostgreSQL | Tipe | Catatan |
| --- | --- | --- | --- |
| `id` | `id` | `uuid` / `text` | `prod-001` dipetakan ke UUID saat impor |
| `nama` | `nama` | `text` | unik per owner disarankan |
| `kategori` | `kategori` | enum | dibatasi 5 nilai |
| `harga` | `harga` | `integer` | Rupiah |
| `stok` | `stok` | `integer` | ≥ 0 |
| `deskripsi` | `deskripsi` | `text` | |
| `bahan` | `bahan` | `text` | |
| `imageUrl` | `image_key` | `text` | data URL lama dikonversi ke object storage |
| `namaPengrajin` | `nama_pengrajin` | `text` | generik/demo → diisi akun nyata saat migrasi akun |
| `unggulan` | `unggulan` | `boolean` | default `false` |
| — | `owner_id` | `uuid` | diisi dari akun, bukan dari berkas |
| — | `created_at`, `updated_at` | `timestamptz` | audit dasar |

Indeks: `(owner_id)`, `(kategori)`, `(nama)`, dan `(owner_id, updated_at)`.

---

## 11. Rencana migrasi bertahap

| Fase | Nama | Aktivitas | Exit criteria |
| --- | --- | --- | --- |
| 0 | Pembekuan kontrak | Finalisasi skema, simpan contoh berkas ekspor JSON, feature freeze UI | Kontrak field dan contoh data disetujui |
| 1 | Schema & lingkungan | Buat database, tabel, indeks, RLS, migrasi reversibel, environment staging | Migrasi `up`/`down` sukses di staging |
| 2 | Autentikasi & sesi | Terapkan hash password, cookie `__Host-`, CSRF, RBAC, rate limit | Alur login/logout/guard lolos dengan akun uji |
| 3 | Adapter penyimpanan | Ganti modul `store.js` dengan API client memakai antarmuka yang sama | Katalog & dashboard tampil identik tanpa perubahan visual |
| 4 | Migrasi data | Ekspor dari browser → script impor tervalidasi, deduplikasi ID, mapping `owner_id`, verifikasi jumlah/harga/stok | Data staging cocok dengan berkas ekspor |
| 5 | Hardening | Audit log, pemindaian upload, uji IDOR/RBAC/RLS, header keamanan | Uji akses lintas owner dan role salah ditolak |
| 6 | Cutover | Deploy di balik *feature flag*, uji regresi AC-01–AC-26, siapkan rollback | Smoke test produksi/staging hijau |
| 7 | Pembersihan | Nonaktifkan jalur demo di produksi, dokumentasi operasional, monitoring | Tidak ada kredensial demo atau `localStorage` sebagai sumber data |

Urutan dependency: kontrak data → schema → autentikasi → adapter → data → hardening → cutover → pembersihan.

---

## 12. Rollback dan risiko

- Simpan berkas ekspor JSON dan backup database dengan *point-in-time recovery* sebelum cutover.
- *Feature flag* memungkinkan kembali ke adapter localStorage untuk prototipe/internal; produksi kembali ke versi sebelum deploy.
- Risiko: perbedaan tipe data (`stok` bisa tidak ada pada data lama), duplikasi ID, konversi data URL ke object storage, sesi lama yang masih aktif, dan kuota penyimpanan gambar.
- Mitigasi: validasi sebelum impor, log setiap baris yang ditolak, rotasi paksa sesi saat cutover, dan pemantauan ukuran storage.

---

## 13. Yang tidak dilakukan

- Tidak mengimplementasikan backend, endpoint API, atau skema database sungguhan di repository ini.
- Tidak membuat login palsu/sungguhan baru; kredensial demo pada prototipe lokal tetap seperti sebelumnya dan diberi label jelas.
- Tidak menambah fitur di luar migrasi penyimpanan: tidak ada pembayaran, pengiriman, rating, wishlist, WhatsApp Business API, atau pengiriman data ke pihak ketiga.
- Tidak mengubah desain **Modern Artisan**, konsep aplikasi, katalog publik, dan tombol WhatsApp demo.
