# KARYAKU

Katalog digital kerajinan tangan UMKM lokal berbasis web, dengan fokus awal pada kerajinan Bali.

> **Status:** prototipe demo sisi klien. Seluruh data disimpan di browser, login pengrajin adalah simulasi lokal, dan aplikasi ini **bukan** marketplace transaksi.

---

## 1. Deskripsi dan tujuan

KARYAKU membantu pengunjung menemukan produk kerajinan tangan, mengenali pengrajinnya, dan menghubungi pengrajin melalui tautan WhatsApp demo. Pengrajin dapat mengelola katalog dan produknya melalui dashboard lokal yang disimulasikan.

Tujuan proyek ini adalah menyediakan katalog publik yang sederhana sekaligus menjadi sarana latihan pengembangan aplikasi web dengan bantuan AI. Katalog dapat dibuka tanpa login, sedangkan pengelolaan produk dibatasi oleh sesi demo.

Proyek ini berfokus pada fitur inti katalog dan pengelolaan produk. Transaksi, pembayaran, pengiriman, ulasan, dan fitur marketplace lainnya tidak termasuk cakupan.

---

## 2. Fitur utama

### Katalog publik

- **Delapan produk contoh** yang dimuat otomatis saat aplikasi pertama dibuka. Ilustrasi produk dibuat lokal sebagai SVG inline (data URL), bukan foto atau URL eksternal.
- **Lima kategori:** `anyaman`, `keramik`, `ukiran`, `tekstil`, `aksesori`.
- **Pencarian** pada nama, deskripsi, bahan, kategori, dan nama pengrajin (abaikan huruf besar/kecil).
- **Filter kategori** (`Semua` + lima kategori) yang dapat digabung dengan pencarian.
- **Enam pilihan pengurutan:** Unggulan, Nama A–Z, Nama Z–A, Harga Terendah, Harga Tertinggi, dan Kategori A–Z.
- **Ringkasan hasil** yang diperbarui secara dinamis serta tampilan kosong dengan tombol **Reset Filter**.
- **Halaman detail produk** berisi foto, harga format Rupiah `id-ID`, deskripsi, bahan, kategori, status unggulan, pengrajin, dan profil pengrajin generik.
- **Tautan WhatsApp demo** ke nomor `6281200000000` dengan pesan yang menyertakan nama produk. Nomor ditampilkan sebagai `0812-0000-0000 — nomor demo, bukan nomor nyata`.
- **Navbar** dengan menu Beranda, Katalog, dan Login Pengrajin. Logo KARYAKU dan menu Beranda kembali ke bagian atas halaman; menu Katalog mengarah langsung ke daftar produk.

### Dashboard pengrajin (demo)

- **Login simulasi** dengan kredensial `pengrajin` / `karyaku-demo`, ditampilkan di form. Tanpa sesi, halaman dashboard kembali ke katalog.
- **CRUD produk:** tambah, ubah, dan hapus produk dengan konfirmasi; perubahan tersimpan di browser dan muncul di katalog.
- **Statistik:** jumlah Produk, Total Stok, dan Kategori.
- **Validasi form** untuk nama, kategori, harga, stok, deskripsi, bahan, gambar, dan nama pengrajin.
- **Upload gambar** PNG, JPEG, atau WebP maksimal 2 MB, termasuk pemeriksaan tanda tangan biner berkas. SVG tidak diterima melalui upload, tetapi ilustrasi SVG bawaan tetap berfungsi.
- **Ekspor dan impor JSON** dengan batas maksimal 1.000 produk dan 2 MB per berkas.
- **Reset Data Demo** kembali ke delapan produk awal setelah konfirmasi, serta **Keluar (Demo)** yang menghapus sesi.
- **ProfileEditor** bersifat generik dan dinonaktifkan karena kunci profil belum disetujui.

---

## 3. Teknologi yang digunakan

| Bagian | Pilihan |
| --- | --- |
| Build tool | Vite 8 (`vite@8.3.8`) |
| Bahasa | JavaScript vanilla (ES module), HTML, CSS |
| Framework UI | Tidak ada; render DOM langsung |
| Pengujian | Vitest 5 (`vitest@5.1.1`) |
| Penyimpanan | `localStorage` browser |
| Backend / API / database | Tidak ada |
| Dependensi runtime | Tidak ada (hanya devDependency Vite dan Vitest) |
| Node.js | `^20.19.0` atau `>=22.12.0` (sesuai `engines` Vite 8) |
| Gaya visual | Konsep *Modern Artisan*: cream, terracotta, taupe, charcoal; font sans-serif sistem, tanpa webfont eksternal |

---

## 4. Struktur proyek

```text
KARYAKU-lab/
├── index.html              # Entry HTML dan mount point #app
├── src/
│   ├── main.js             # Inisialisasi store dan UI
│   ├── products.js         # Kategori, akun demo, ilustrasi, dan 8 produk seed
│   ├── store.js            # Validasi, localStorage, CRUD, ekspor/impor JSON, sesi demo
│   ├── ui.js               # Komponen, hash router, katalog, detail, login, dashboard
│   └── style.css           # Token desain, tata letak, responsivitas
├── tests/
│   ├── filter.test.js        # Pencarian, filter, dan sorting
│   ├── validasi.test.js      # Validasi produk dan URL gambar
│   ├── localStorage.test.js  # Seed, persistensi, impor, dan batas ukuran
│   ├── whatsapp.test.js      # Nomor dan URL WhatsApp demo
│   ├── gambar.test.js        # Tanda tangan berkas gambar
│   └── router.test.js        # Parsing hash termasuk URL malformed
├── package.json            # Script dev, build, preview, test
├── package-lock.json       # Lockfile dengan checksum integritas
├── CATATAN.md              # Catatan latihan dan tujuan aplikasi
├── SPEC.md                 # Spesifikasi sistem
├── UI-SPEC.md              # Spesifikasi UI/UX
├── TASKS.md                # Daftar tugas dan acceptance criteria
├── MIGRATION-PLAN.md       # Rencana migrasi produksi (belum diimplementasikan)
└── SECURITY-AUDIT.md       # Laporan audit keamanan
```

Folder `dist/` dihasilkan oleh `npm run build` dan tidak disimpan di git, bersama `node_modules/` dan `.env`.

---

## 5. Instalasi dan menjalankan aplikasi secara lokal

Prasyarat: Node.js dan npm terpasang.

```bash
# Masuk ke folder proyek
cd KARYAKU-lab

# Pasang dependensi sesuai lockfile
npm ci

# Jalankan server pengembangan
npm run dev
```

Buka alamat yang ditampilkan Vite di terminal (default `http://localhost:5173`).

Untuk masuk ke dashboard demo, pilih **Login Pengrajin** lalu gunakan:

| Field | Nilai |
| --- | --- |
| Username | `pengrajin` |
| Password | `karyaku-demo` |

Kunci `localStorage` yang dipakai aplikasi:

| Kunci | Isi |
| --- | --- |
| `karyaku_schema_version` | `1`; versi lain memicu seed ulang |
| `karyaku:products:v1` | Array produk, diisi delapan produk saat pertama dibuka |
| `karyaku_session_v1` | `demo-pengrajin` saat login, dikosongkan saat keluar |

Hapus data browser untuk situs ini bila ingin kembali ke kondisi awal, atau gunakan tombol **Reset Data Demo** di dashboard.

---

## 6. Testing dan build

```bash
# Menjalankan seluruh unit test (Vitest, mode run sekali)
npm test

# Membuat build produksi ke folder dist/
npm run build

# Melihat hasil build secara lokal
npm run preview
```

`npm test` menjalankan seluruh berkas di `tests/`; `npm run build` menghasilkan aset statis di `dist/` yang siap diunggah ke hosting statis.

---

## 7. Deployment Vercel

Aplikasi ini adalah situs statis hasil Vite, sehingga dapat di-deploy ke Vercel tanpa server tambahan. Repository **belum** menyimpan `vercel.json`; pengaturan berikut dimasukkan di dashboard Vercel saat membuat proyek:

| Pengaturan | Nilai |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` (atau `npm install`) |
| Root Directory | Folder proyek tempat `package.json` berada |
| Environment variable | Tidak diperlukan |

Catatan deployment:

- Navigasi memakai hash (`#/katalog`, `#/produk/...`, `#/login`, `#/dashboard`), sehingga tidak memerlukan aturan *rewrite* SPA.
- Tidak ada API, serverless function, cookie, atau rahasia yang perlu dikonfigurasi.
- Setelah deploy, pastikan delapan produk tampil, ilustrasi termuat, dan tautan WhatsApp demo membuka tab baru.
- Jika diperlukan, tambahkan header keamanan (misalnya CSP dan `X-Content-Type-Options: nosniff`) melalui konfigurasi hosting; repository ini belum menyimpannya.
- Data pengguna tetap berada di `localStorage` browser masing-masing, bukan di Vercel.

---

## 8. Batasan aplikasi

1. **Penyimpanan lokal.** Produk dan sesi disimpan plaintext di `localStorage` browser. Tidak ada sinkronisasi antarperangkat, browser, atau akun. Menghapus data browser mengembalikan katalog ke delapan produk contoh. Bila penyimpanan diblokir, perubahan hanya berlaku untuk sesi tersebut dan aplikasi menampilkan peringatan.
2. **Login demo, bukan autentikasi.** Kredensial ditampilkan di form dan sesi hanya berupa kunci `localStorage`. Penjaga dashboard dapat dilewati dari DevTools. Jangan memasukkan data pribadi atau data produksi; simulasi ini tidak cocok untuk autentikasi sungguhan.
3. **Tanpa backend.** Tidak ada server, REST API, basis data, pengiriman kredensial, atau permintaan jaringan eksternal selain tautan `wa.me` yang dibuka setelah pengguna mengklik tombol WhatsApp. `MIGRATION-PLAN.md` hanya berisi usulan arsitektur produksi dan belum diimplementasikan.
4. **Bukan marketplace.** Tidak ada keranjang, checkout, pembayaran, pengiriman, ongkos kirim, ulasan, rating, wishlist, atau WhatsApp Business API.
5. **WhatsApp demo.** Tombol hanya membuka tautan `wa.me` dengan nomor demo setelah diklik; tidak ada pengiriman pesan otomatis dan aplikasi tidak meminta nomor pengunjung.
6. **Batas berkas.** Upload gambar hanya PNG/JPEG/WebP maksimal 2 MB dengan pemeriksaan isi berkas. Impor JSON dibatasi 2 MB dan 1.000 produk. Ilustrasi SVG bawaan tetap tersedia, tetapi berkas SVG tidak dapat di-upload.
7. **Profil pengrajin generik.** Nama, wilayah `Bali`, cerita usaha, dan nomor WhatsApp bersifat contoh. Editor profil di dashboard dinonaktifkan.
8. **Keamanan hosting.** Belum ada CSP/header keamanan di kode aplikasi. Temuan audit F-01 hingga F-05 telah diremediasi; F-06 (akses demo sisi klien), F-07 (header keamanan), dan F-08 (rentang versi dependensi) masih menjadi catatan lanjutan. Lihat `SECURITY-AUDIT.md` untuk detailnya.

---

## 9. Dokumentasi terkait

- `CATATAN.md` — latihan dan tujuan aplikasi.
- `SPEC.md` — spesifikasi sistem dan acceptance criteria.
- `UI-SPEC.md` — spesifikasi UI/UX dan panduan visual.
- `TASKS.md` — daftar tugas dan definisi selesai.
- `MIGRATION-PLAN.md` — rencana migrasi produksi (belum diimplementasikan).
- `SECURITY-AUDIT.md` — temuan, bukti, dan rekomendasi keamanan.
