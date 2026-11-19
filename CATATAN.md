# CATATAN — KARYAKU

## 1. Tujuan Latihan
Mempelajari penggunaan AI agent dalam membantu proses pengembangan aplikasi web, mulai dari perencanaan, pembuatan struktur proyek, hingga implementasi fitur sederhana. Latihan ini juga bertujuan memahami cara memberikan instruksi kepada AI dan memeriksa hasil pekerjaannya.

## 2. Target Aplikasi
KARYAKU adalah platform katalog digital untuk memperkenalkan dan mempromosikan produk kerajinan tangan UMKM lokal. Platform ini menghubungkan calon pembeli dengan pengrajin melalui katalog produk, profil pengrajin, dan kontak WhatsApp.

Target pengguna:
- Pengunjung yang ingin mencari produk kerajinan tangan.
- Pengrajin UMKM yang ingin mempromosikan produknya.

Fitur utama:
- Katalog produk publik.
- Kategori kerajinan.
- Detail produk.
- Profil pengrajin.
- Login pengrajin.
- CRUD produk.
- Kontak pengrajin melalui WhatsApp.

Cakupan produk berasal dari berbagai daerah, dengan fokus awal pada kerajinan lokal Bali.

## 3. Batasan Workshop
- Tidak menyediakan transaksi dan pembayaran online.
- Tidak menyediakan sistem pengiriman barang.
- Tidak menyediakan fitur ulasan dan rating.
- Tidak menyediakan wishlist.
- Fokus pada katalog dan pengelolaan produk.
- Mengutamakan implementasi fitur inti yang sederhana.

## 4. Risiko Penggunaan AI
AI berpotensi menghasilkan kode yang tidak sesuai kebutuhan, mengandung kesalahan, atau memiliki celah keamanan. Oleh karena itu, setiap kode dan perubahan yang dihasilkan AI harus diperiksa dan diuji sebelum digunakan.


## Hasil Deployment KARYAKU

### Repository dan Deployment
- GitHub: https://github.com/Laviria-ti/KARYAKU
- Website: https://karyaku-beryl.vercel.app
- Branch utama: `main`
- Platform deployment: Vercel
- Framework: Vite

### Hasil Pengujian
- Unit test: 52 berhasil, 0 gagal.
- Build production: berhasil.
- Deployment Vercel: berhasil.
- Repository GitHub: berhasil terhubung dan di-push.

### Batasan Aplikasi
- Data produk disimpan menggunakan localStorage pada browser.
- Login masih berupa simulasi dan belum menggunakan backend.
- Aplikasi belum memiliki database server.
- WhatsApp menggunakan tautan kontak demo.

### Catatan Lanjutan
- Periksa kembali navigasi Beranda, Katalog, dan Login Pengrajin pada website online.
- Pengembangan backend dan autentikasi sungguhan masih dapat dilakukan pada tahap berikutnya.