# SPESIFIKASI SISTEM — KARYAKU

| Informasi | Nilai |
| --- | --- |
| Versi | 1.0 (dirapikan) |
| Tanggal | 2026-11-19 |
| Status | Siap ditinjau sebelum implementasi |
| Referensi | `CATATAN.md`, `UI-SPEC.md`, `TASKS.md` |
| Fokus | MVP workshop, tanpa backend |

> Dokumen ini hanya spesifikasi. Kode aplikasi belum ditulis.

---

## 1. Tujuan aplikasi

KARYAKU adalah katalog digital berbasis web untuk memperkenalkan dan mempromosikan kerajinan tangan UMKM lokal, dengan fokus awal pada Bali.

- Menyajikan katalog publik tanpa login.
- Memudahkan pencarian, filter kategori, dan sorting produk.
- Menampilkan detail produk, profil pengrajin, dan cerita usaha.
- Menyediakan kontak WhatsApp sebagai simulasi demo.
- Memberi pengrajin dashboard lokal untuk mengelola produk.
- Menjadi media latihan memberi instruksi kepada AI dan memeriksa hasilnya.

---

## 2. Target pengguna

- **Pengunjung / calon pembeli:** mencari produk, membandingkan harga, membaca cerita pengrajin, dan menghubungi pengrajin lewat WhatsApp demo.
- **Pengrajin UMKM:** masuk lewat login simulasi dan mengelola katalog produknya.

Batasan pengguna:

- Pengunjung tidak dapat membeli atau membayar di aplikasi.
- Login pengrajin bukan autentikasi sungguhan; data hanya tersimpan di browser.

---

## 3. Daftar fitur MVP

| ID | Fitur | Deskripsi | Aktor |
| --- | --- | --- | --- |
| F-01 | Katalog produk | Grid kartu produk publik | Pengunjung, Pengrajin |
| F-02 | 8 produk contoh | Data awal di-seed saat pertama dibuka | Pengunjung, Pengrajin |
| F-03 | Kategori | Anyaman, keramik, ukiran, tekstil, aksesori | Pengunjung |
| F-04 | Pencarian | Case-insensitive pada nama, deskripsi, bahan, kategori, nama pengrajin | Pengunjung |
| F-05 | Filter kategori | `Semua` + 5 kategori, bisa digabung pencarian | Pengunjung |
| F-06 | Sorting | Unggulan, Nama A–Z/Z–A, Harga Terendah/Tertinggi, Kategori A–Z | Pengunjung |
| F-07 | Detail produk | Foto, nama, harga, deskripsi, bahan, kategori, pengrajin, status unggulan | Pengunjung |
| F-08 | Profil pengrajin | Nama, wilayah umum, cerita usaha singkat | Pengunjung |
| F-09 | WhatsApp demo | Tautan `wa.me` dengan nomor dan label demo | Pengunjung |
| F-10 | Login pengrajin | Simulasi lokal dengan banner demo | Pengrajin |
| F-11 | Dashboard CRUD | Tambah, lihat, ubah, hapus produk dengan konfirmasi | Pengrajin |
| F-12 | Foto lokal | Upload lokal atau aset lokal; tanpa URL eksternal | Pengrajin |
| F-13 | localStorage | Produk dan sesi demo tersimpan di browser | Sistem |

### 3.1 Aturan katalog

- Urutan proses: **pencarian → filter kategori → sorting**.
- Pencarian memakai huruf kecil dan membuang spasi di awal/akhir; cocok sebagian kata.
- Jika kosong, tampilkan pesan *"Produk tidak ditemukan. Coba kata kunci atau kategori lain."* dan tombol **Reset Filter**.
- Sorting deterministik: nilai sama diurutkan oleh `nama`, lalu `id`.
- Harga memakai format Indonesia, contoh `Rp125.000`.
- Jumlah hasil diumumkan dengan `aria-live`.

### 3.2 Delapan produk contoh

Nama pengrajin bersifat generik/demo. Gambar dibuat lokal, bukan foto orang dan bukan URL eksternal.

| ID | Nama | Kategori | Harga | Bahan | Pengrajin | Unggulan | Foto |
| --- | --- | --- | ---: | --- | --- | --- | --- |
| `prod-001` | Tas Anyam Pandan | anyaman | 125000 | Pandan, rotan | Pengrajin Anyam Lestari | Ya | `/images/produk-01.svg` |
| `prod-002` | Mangkuk Keramik Sengkar | keramik | 89000 | Tanah liat, glasir alam | Pengrajin Keramik Ardhana | Tidak | `/images/produk-02.svg` |
| `prod-003` | Ukiran Kayu Cendana | ukiran | 245000 | Kayu cendana | Pengrajin Ukir Suasta | Ya | `/images/produk-03.svg` |
| `prod-004` | Kain Tenun Motif Awan | tekstil | 180000 | Kapas, pewarna alam | Pengrajin Tenun Warna | Tidak | `/images/produk-04.svg` |
| `prod-005` | Gelang Manik Bambu | aksesori | 65000 | Bambu, benang | Pengrajin Aksesori Alam | Tidak | `/images/produk-05.svg` |
| `prod-006` | Keranjang Rotan Mini | anyaman | 95000 | Rotan | Pengrajin Anyam Lestari | Tidak | `/images/produk-06.svg` |
| `prod-007` | Piring Keramik Motif Air | keramik | 78000 | Tanah liat, glasir alam | Pengrajin Keramik Ardhana | Ya | `/images/produk-07.svg` |
| `prod-008` | Sarung Bantal Tekstil Bali | tekstil | 110000 | Kapas | Pengrajin Tenun Warna | Tidak | `/images/produk-08.svg` |

### 3.3 Profil pengrajin

- Nama pengrajin diambil dari produk.
- Wilayah umum: Bali, tanpa alamat lengkap.
- Cerita usaha generik 1–2 paragraf.
- Tombol WhatsApp demo tersedia di blok profil.

### 3.4 WhatsApp demo

- Nomor demo: `6281200000000`, ditampilkan sebagai `0812-0000-0000 — nomor demo, bukan nomor nyata`.
- Tautan: `https://wa.me/6281200000000?text=<pesan-terencode>`.
- Pesan awal: `Halo KARYAKU, saya tertarik dengan produk {namaProduk}. Bisa beri informasi lebih lanjut?`
- Label UI wajib memuat kata **Demo**. Tidak meminta atau menyimpan nomor pengunjung.

### 3.5 Login simulasi

- Kredensial demo: `pengrajin` / `karyaku-demo`, ditampilkan di form.
- Banner: **AKUN DEMO — simulasi lokal, bukan autentikasi sungguhan**.
- Gagal: *"Kredensial demo salah. Gunakan akun yang tertera di form."*
- Berhasil: simpan `karyaku_session_v1 = demo-pengrajin`.
- Dashboard tanpa sesi kembali ke katalog; **Keluar (Demo)** menghapus sesi.
- Tanpa hash, token, cookie, server session, atau pengiriman kredensial.

### 3.6 Foto produk lokal

- Format: PNG, JPEG, WebP, SVG. Maksimal 2 MB per file.
- Upload dikonversi menjadi data URL; kosong memakai `/images/placeholder.svg`.
- Dilarang memakai URL `http://` atau `https://` sebagai `imageUrl`.

---

## 4. Model data

### 4.1 Skema produk

| Field | Tipe | Aturan | Contoh |
| --- | --- | --- | --- |
| `id` | string | Unik, `prod-001`, `prod-002`, … | `prod-001` |
| `nama` | string | 3–80 karakter | `Tas Anyam Pandan` |
| `kategori` | enum | anyaman, keramik, ukiran, tekstil, aksesori | `anyaman` |
| `harga` | number | Bulat, ≥ 0, Rupiah | `125000` |
| `deskripsi` | string | 10–500 karakter | `Tas anyam ringan untuk harian.` |
| `bahan` | string | 3–120 karakter | `Pandan, rotan` |
| `imageUrl` | string | Path lokal atau data URL | `/images/produk-01.svg` |
| `namaPengrajin` | string | 3–80 karakter, generik/demo | `Pengrajin Anyam Lestari` |
| `unggulan` | boolean | Default `false` saat tambah | `true` |

Field turunan, tidak disimpan: `hargaFormatted`, `kategoriLabel`, `whatsappUrl`, `ceritaUsaha`.

### 4.2 Penyimpanan

| Key | Isi | Perilaku |
| --- | --- | --- |
| `karyaku_schema_version` | `1` | Beda atau kosong memicu seed ulang |
| `karyaku_products_v1` | Array produk | Di-seed 8 item jika belum ada |
| `karyaku_session_v1` | `demo-pengrajin` atau kosong | Dibuat saat login, dihapus saat keluar |

- Teks pengguna dirender sebagai teks, bukan HTML.
- Jika data localStorage rusak, kembalikan ke seed.
- Tombol **Reset Data Demo** mengembalikan 8 produk awal.
- Tidak ada sinkronisasi antarperangkat atau browser.

---

## 5. Non-functional requirements

| ID | Kategori | Requirement | Uji singkat |
| --- | --- | --- | --- |
| NFR-01 | Stack | Vite + JavaScript vanilla, HTML, CSS; tanpa framework/backend | Dependency hanya Vite |
| NFR-02 | Jaringan | Tanpa request eksternal, CDN, atau pihak ketiga | Network tab lokal saja |
| NFR-03 | API key | Tanpa key, token, atau secret | Tidak ada env rahasia |
| NFR-04 | Responsif | Nyaman dipakai 360–1440 px | Tanpa scroll horizontal di 360 px |
| NFR-05 | Aksesibilitas | Semantik, label, fokus, `alt`, kontras ≥ 4.5:1 | Keyboard dan pembaca layar dasar |
| NFR-06 | Performa | 8 produk tampil < 2 detik di `vite dev` | Tanpa spinner menggantung |
| NFR-07 | Keamanan | Tanpa `innerHTML` untuk data produk; tanpa `eval` | Tag script tampil sebagai teks |
| NFR-08 | Privasi | Tanpa data pribadi pada data contoh | Audit seed, profil, pesan WA |
| NFR-09 | Konsistensi | Format Rupiah `id-ID` | `Rp125.000` |
| NFR-10 | Maintainability | Modul terpisah per tanggung jawab | Bukan satu file besar |
| NFR-11 | Stabilitas | Console bersih pada alur normal dan empty state | Tidak ada error uncaught |
| NFR-12 | Bahasa | Label UI berbahasa Indonesia | Istilah konsisten |

---

## 6. Risiko

| ID | Risiko / dampak | Mitigasi |
| --- | --- | --- |
| R-01 | Kode AI menyimpang atau salah logika | Tinjau baris demi baris, jalankan AC |
| R-02 | Celah XSS lewat `innerHTML` atau `eval` | Render teks, validasi input, uji NFR-07 |
| R-03 | Login demo disangka autentikasi nyata | Banner **MODE DEMO** di form dan dashboard |
| R-04 | Nomor WA demo terisi nomor pribadi | Placeholder `0812-0000-0000` + label demo |
| R-05 | localStorage penuh karena gambar | Batas 2 MB/file + pesan kuota jelas |
| R-06 | Mode privat memblokir localStorage | Peringatan + aplikasi tetap usable dalam sesi |
| R-07 | Sorting/filter kombinasi tidak deterministik | Tie-breaker `nama`, lalu `id` |
| R-08 | Gambar contoh melanggar hak cipta | SVG/PNG buatan sendiri, bukan foto orang |
| R-09 | Perintah terminal berbahaya | Hanya perintah Vite standar; minta persetujuan bila ragu |

---

## 7. Out of scope

- Marketplace penuh: keranjang, checkout, invoice, pembayaran online.
- Pengiriman barang, tracking, ongkos kirim.
- Ulasan, rating, komentar publik, wishlist, favorit.
- Autentikasi sungguhan: register, reset password, OAuth, database user.
- Backend, REST API, server, hosting produksi.
- WhatsApp Business API, webhook, API key, token, layanan cloud.
- Data pribadi nyata pada data contoh.
- Perintah terminal berbahaya atau destruktif.
- Multi-bahasa dan multi-mata uang.

---

## 8. Acceptance criteria

| ID | Given | When | Then |
| --- | --- | --- | --- |
| AC-01 | Aplikasi pertama dibuka | Katalog dimuat | 8 kartu tampil, tanpa prompt login |
| AC-02 | Katalog terbuka | Lihat kontrol kategori | `Semua` + 5 kategori tersedia |
| AC-03 | Katalog terbuka | Cari `pandan` | Hasil sesuai, abaikan huruf besar/kecil |
| AC-04 | Katalog terbuka | Cari `  ROTAN  ` | Spasi dibuang, produk rotan ditemukan |
| AC-05 | Katalog terbuka | Pilih `keramik` | Tepat 2 produk tampil |
| AC-06 | Filter anyaman + cari rotan | Sort harga terendah | Tetap anyaman, harga menaik |
| AC-07 | Pencarian tidak cocok | Lihat halaman | Pesan kosong + tombol **Reset Filter** |
| AC-08 | Klik **Reset Filter** | Katalog diperbarui | Pencarian kosong, `Semua`, `Unggulan` |
| AC-09 | Kartu `prod-001` diklik | Detail terbuka | Foto, nama, `Rp125.000`, deskripsi, bahan, kategori, pengrajin, badge tampil |
| AC-10 | Detail terbuka | Baca blok profil | Nama + cerita usaha tampil, tanpa alamat lengkap |
| AC-11 | Detail terbuka | Klik tombol WhatsApp | `wa.me` nomor demo terbuka, pesan berisi nama produk |
| AC-12 | Form login dilihat | Baca form | Teks demo + kredensial tertera |
| AC-13 | Form login terbuka | Password salah | Pesan error, dashboard tidak terbuka |
| AC-14 | Form login terbuka | Isi kredensial demo | Dashboard terbuka dengan banner **MODE DEMO** |
| AC-15 | Tanpa sesi | Buka URL dashboard | Kembali ke katalog |
| AC-16 | Dashboard terbuka | Tambah produk valid | Produk muncul setelah refresh |
| AC-17 | Dashboard terbuka | Edit harga, refresh | Berubah di katalog dan dashboard |
| AC-18 | Dashboard terbuka | Hapus, batalkan konfirmasi | Produk tidak terhapus |
| AC-19 | Dashboard terbuka | Hapus, setujui konfirmasi | Produk hilang setelah refresh |
| AC-20 | Form tambah | Upload PNG 1 MB | Foto tampil, tanpa URL eksternal |
| AC-21 | Form tambah | Upload file 3 MB | Error maksimal 2 MB, data tidak tersimpan |
| AC-22 | Form tambah | Nama diisi `<script>alert(1)</script>` | Jadi teks, tanpa alert, console bersih |
| AC-23 | Dashboard terbuka | Klik **Reset Data Demo** | Kembali ke 8 produk awal |
| AC-24 | Dashboard terbuka | Klik **Keluar (Demo)** | Sesi hilang, dashboard tertutup |
| AC-25 | Semua halaman | Cek network tab | Hanya localhost/aset lokal |
| AC-26 | Semua halaman | Cari fitur di luar scope | Tidak ada UI pembayaran, pengiriman, rating, wishlist |

---

## 9. Implementation plan per iterasi

| Iterasi | Fokus | Deliverable | Exit criteria |
| --- | --- | --- | --- |
| I-0 | Review spesifikasi | `CATATAN.md`, `SPEC.md`, `UI-SPEC.md`, `TASKS.md` | Tidak ada pertanyaan terbuka |
| I-1 | Setup & fondasi | Vite, struktur modul, seed + storage + format | AC-01 lulus, console bersih |
| I-2 | Katalog & kategori | Grid kartu, badge, Rupiah, aset lokal | AC-02 dan AC-09 lulus |
| I-3 | Interaksi katalog | Pencarian, filter, sorting, empty state, reset | AC-03–AC-08 lulus |
| I-4 | Detail & pengrajin | Halaman detail, profil, WhatsApp demo | AC-09–AC-11 lulus |
| I-5 | Login simulasi | Form, banner, sesi, guard, logout | AC-12–AC-15 dan AC-24 lulus |
| I-6 | CRUD & foto | Tambah/ubah/hapus, konfirmasi, upload, reset | AC-16–AC-23 lulus |
| I-7 | QA & hardening | Uji manual, aksesibilitas, keamanan, README | Semua AC lulus |

Urutan dependency: storage/seed → katalog → interaksi → detail → auth demo → CRUD → QA. Setiap iterasi diuji manual sebelum lanjut.
