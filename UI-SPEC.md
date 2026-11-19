# SPESIFIKASI UI/UX — KARYAKU

| Informasi | Nilai |
| --- | --- |
| Versi | 1.0 (dirapikan) |
| Tanggal | 2026-11-19 |
| Status | Siap ditinjau sebelum implementasi UI |
| Referensi | `SPEC.md`, `TASKS.md` |
| Konsep | Modern Artisan, mobile-first |

> Spesifikasi UI/UX saja. Wireframe di bawah adalah representasi teks, bukan markup.

---

## 1. Identitas visual dan palet warna

**Modern Artisan** menghadirkan katalog seperti galeri kecil: latar cream hangat, aksen terracotta, tipografi rapi, dan foto produk sebagai pusat perhatian. Ruang kosong dipakai secara sadar agar produk terasa dipamerkan, bukan sekadar terdaftar.

- **Hangat:** cream sebagai kanvas, terracotta sebagai aksen organik.
- **Artistik:** foto besar, garis tipis, badge kecil, ritme tidak padat.
- **Modern:** sudut lembut, tata letak bersih, tanpa dekorasi berlebih.
- **Profesional:** kontras terbaca, label konsisten, status demo jelas.

### 1.1 Palet dasar

| Peran | Nama | Hex | Pemakaian |
| --- | --- | --- | --- |
| Utama | Cream | `#F6F0E7` | Latar halaman, kartu, form |
| Aksen | Terracotta | `#C58B68` | Motif, border aktif, dekorasi, badge unggulan |
| Pendukung | Taupe | `#8B7967` | Ikon, garis, teks besar sekunder |
| Teks | Charcoal | `#39352F` | Judul, body, label, harga |

### 1.2 Turunan aksesibel

| Varian | Hex | Pemakaian |
| --- | --- | --- |
| Taupe Teks | `#6F6052` | Teks sekunder, metadata, caption |
| Terracotta Deep | `#8A5638` | Tombol utama berteks putih, fokus, tautan penting |
| Cream Tipis | `#FBF8F3` | Permukaan kartu, area hover ringan |
| Garis Halus | `#DED3C5` | Border input, divider, garis tabel |

### 1.3 Aturan kontras

| Kombinasi | Rasio | Keputusan |
| --- | ---: | --- |
| Charcoal / Cream | 10.75:1 | Aman untuk semua teks |
| Taupe Teks / Cream | 5.34:1 | Aman untuk teks kecil |
| Taupe / Cream | 3.69:1 | Teks besar, ikon, garis; bukan body kecil |
| Terracotta / Cream | 2.55:1 | Dekorasi dan border; **bukan teks** |
| Charcoal / Terracotta | 4.21:1 | Teks besar tebal saja |
| Putih / Terracotta Deep | 6.05:1 | Aman untuk tombol utama |

Larangan: teks kecil Terracotta di atas Cream, teks putih di atas Terracotta standar, dan status yang hanya memakai warna.

### 1.4 Ruang dan bentuk

| Elemen | Pedoman |
| --- | --- |
| Skala jarak | 4, 8, 12, 16, 24, 32, 48, 64, 96 px |
| Jarak antarbagian | 40–56 px mobile, 64–96 px desktop |
| Lebar konten | Maksimal 1200 px, margin otomatis |
| Sudut | 16 px kartu, 10 px tombol, 8 px badge/input |
| Border | 1 px Garis Halus, 2 px untuk fokus/aktif |
| Bayangan | Sangat lembut, hanya saat kartu diangkat hover |

---

## 2. Tipografi

Font memakai sans-serif sistem tanpa webfont eksternal: `ui-sans-serif`, `system-ui`, `Segoe UI`, `Roboto`, `Helvetica Neue`, `Arial`, lalu fallback sans-serif.

| Peran | Ukuran | Berat | Tinggi baris | Pemakaian |
| --- | ---: | --- | ---: | --- |
| Display hero | 40–48 px | 700 | 1.15 | Hero desktop |
| Judul halaman | 30–36 px | 700 | 1.2 | Judul tiap halaman |
| Judul bagian | 22–26 px | 600 | 1.25 | "Cerita Pengrajin" |
| Judul kartu | 17–19 px | 600 | 1.3 | Nama produk/pengrajin |
| Body | 15–16 px | 400 | 1.6 | Deskripsi, form |
| Metadata | 13–14 px | 500 | 1.5 | Kategori, bahan, jumlah hasil |
| Eyebrow | 11–12 px | 700 | 1.4 | `KARYAKU`, `MODE DEMO` |

- Judul rapat, eyebrow kapital dengan jarak antarhuruf renggang.
- Body dibatasi sekitar 60–65 karakter per baris.
- Harga menonjol, berat 700, warna Charcoal.
- Di mobile, display hero turun ke 30–34 px dan judul halaman ke 24–28 px.

---

## 3. Komponen UI

| Komponen | Isi | Variasi / state |
| --- | --- | --- |
| Navbar | Logo, Beranda, Katalog, Tentang, Login/Keluar | Horizontal desktop, menu mobile; hover, focus, aktif |
| Logo Lockup | Wordmark KARYAKU + motif terracotta | Standar, kompak; focus saat diklik |
| Hero | Eyebrow, judul, subjudul, CTA | Split desktop, tumpuk mobile |
| SearchField | Ikon, input, hapus teks | Kosong, terisi, error, focus |
| FilterKategori | `Semua` + 5 kategori | Chip/select; aktif, focus |
| SortSelect | Label + 6 opsi urutan | Focus, hover |
| ProductCard | Foto, badge, nama, harga, pengrajin | Standar, unggulan, placeholder; hover, focus |
| PriceLabel | Rupiah `id-ID` | Reguler, menonjol di detail |
| Badge | Teks + opsional ikon | Kategori, Unggulan, Demo |
| EmptyState | Ilustrasi, pesan, Reset Filter | Tombol focus |
| Breadcrumb | Beranda › Katalog › Produk | Tautan hover/focus |
| ArtisanProfileCard | Nama, wilayah, cerita, motif | Ringkas di detail |
| WhatsAppButton | Ikon + teks "(Demo)" | Primer di detail, sekunder di profil |
| DemoBanner | Ikon + "MODE DEMO" | Di login dan dashboard |
| FormField | Label, input/textarea/select/file | Default, focus, error, disabled |
| ConfirmDialog | Pertanyaan, Batal, Hapus/Reset | Escape menutup, focus terjebak |
| InlineAlert | Pesan sukses/error/info | Muncul dan bisa ditutup |
| SummaryStat | Angka besar + label | Jumlah produk, unggulan, kategori |
| ProductListRow | Foto kecil, nama, kategori, harga, aksi | Tabel desktop, kartu mobile |
| ProfileEditor | Nama, wilayah, cerita, WA demo | Lihat/edit; focus, error |
| Footer | Logo kecil, tagline, catatan demo | Desktop, mobile |
| SkipLink | "Lewati ke konten" | Muncul saat Tab pertama |

### 3.1 State interaksi

| State | Perlakuan |
| --- | --- |
| Default | Border Garis Halus, latar Cream/Cream Tipis |
| Hover | Latar naik satu level, bayangan lembut, aksen terracotta |
| Focus | Outline 2 px Terracotta Deep, jarak 2 px, jangan dihapus |
| Aktif | Terracotta Deep + teks putih untuk chip/filter |
| Disabled | Opacity turun, kursor nonaktif, teks tetap terbaca |
| Error | Border lebih tebal + pesan tertulis, bukan hanya warna |
| Saving | Teks "Menyimpan…", tombol sementara nonaktif |

Tombol: **Utama** Terracotta Deep + teks putih; **Sekunder** Cream Tipis + border Taupe; **Teks** Terracotta Deep tanpa border; **Berbahaya** merah bumi gelap + konfirmasi.

---

## 4. Struktur halaman

### 4.1 Katalog / Beranda

1. SkipLink.
2. Navbar dengan logo KARYAKU dan tautan navigasi.
3. Hero: eyebrow, judul, subjudul, CTA "Jelajahi Katalog".
4. Ringkasan "8 produk · 5 kategori" dengan pengumuman jumlah hasil.
5. Toolbar: SearchField, FilterKategori, SortSelect, Reset Filter.
6. Grid ProductCard.
7. EmptyState bila hasil kosong.
8. Footer.

Foto produk menjadi elemen terbesar kartu. Tidak ada banner transaksi atau pembayaran.

### 4.2 Detail produk

1. Navbar.
2. Breadcrumb.
3. Foto produk besar dengan `alt` deskriptif.
4. Kategori, badge unggulan, nama, harga, deskripsi, bahan, nama pengrajin.
5. WhatsAppButton "(Demo)".
6. ArtisanProfileCard berisi wilayah dan cerita usaha.
7. Tautan "Kembali ke Katalog".
8. Footer.

Layout dua kolom di desktop, satu kolom di mobile.

### 4.3 Login demo

1. Navbar dengan tautan kembali.
2. Kartu form di tengah.
3. DemoBanner: "AKUN DEMO — simulasi lokal, bukan autentikasi sungguhan".
4. Kredensial demo tertera: `pengrajin` / `karyaku-demo`.
5. Field username, password, tombol "Masuk ke Dashboard (Demo)".
6. InlineAlert untuk kesalahan.

### 4.4 Dashboard pengrajin

1. Navbar dengan badge **MODE DEMO** dan tombol Keluar.
2. Judul + subjudul simulasi lokal.
3. SummaryStat: jumlah produk, unggulan, kategori terbanyak.
4. Toolbar: Tambah Produk, Reset Data Demo.
5. Daftar produk memakai ProductListRow.
6. Panel form Tambah/Edit di tempat yang sama, bukan halaman terpisah.
7. ConfirmDialog untuk Hapus dan Reset.
8. ProfileEditor: nama, wilayah, cerita, nomor WA demo.
9. Footer ringkas.

Catatan: `SPEC.md` belum memiliki key profil. Field profil tetap generik sampai `karyaku_profile_v1` disetujui; tidak meminta data pribadi nyata.

---

## 5. Alur navigasi

### 5.1 Pengunjung

1. Beranda → Hero → klik "Jelajahi Katalog".
2. Cari kata kunci → pilih kategori → pilih sorting.
3. Klik kartu → Detail Produk.
4. Baca detail → lihat ArtisanProfileCard → klik WhatsApp "(Demo)".
5. Kembali ke Katalog lewat breadcrumb atau tombol kembali.
6. Jika hasil kosong → klik Reset Filter.

### 5.2 Pengrajin

1. Navbar → Login Pengrajin → baca banner demo.
2. Isi kredensial → berhasil masuk Dashboard, gagal tetap di form.
3. Di Dashboard pilih: Tambah, Edit, Hapus, Reset Data Demo, atau Kelola Profil.
4. Simpan perubahan → cek katalog publik.
5. Keluar (Demo) → sesi dihapus, dashboard tertutup.

### 5.3 Aturan navigasi

- Satu judul utama per halaman.
- Breadcrumb hanya di Detail Produk.
- Tautan tab baru diberi penanda "(tab baru)" untuk pembaca layar.
- Guard dashboard berlaku sebelum konten CRUD dirender.
- Tidak ada alur ke checkout, pembayaran, pengiriman, rating, atau wishlist.

---

## 6. Wireframe teks — desktop

### 6.1 Katalog

```text
+----------------------------------------------------+
| [KARYAKU] Beranda Katalog Tentang  [Login Pengrajin] |
+----------------------------------------------------+
| KARYAKU / Katalog kerajinan UMKM lokal             |
| Jelajahi kerajinan lokal Bali.  [ FOTO HERO ]      |
| [ Jelajahi Katalog ]                               |
+----------------------------------------------------+
| 8 produk · 5 kategori                              |
| [ Cari... ] [Semua][Anyaman][Keramik][Ukiran]      |
| [Tekstil][Aksesori] Urutkan [Unggulan] [Reset]     |
+----------------------------------------------------+
| +----------+ +----------+ +----------+             |
| | FOTO     | | FOTO     | | FOTO     |             |
| | [Unggulan]| |          | |          |             |
| | Tas Anyam| | Mangkuk  | | Ukiran   |             |
| | Rp125.000 | | Rp89.000 | | Rp245.000 |            |
| +----------+ +----------+ +----------+             |
| ... 5 kartu lainnya ...                            |
+----------------------------------------------------+
| Footer                                             |
+----------------------------------------------------+
```

### 6.2 Detail produk

```text
+----------------------------------------------------+
| [KARYAKU] Beranda Katalog Tentang  [Login Pengrajin] |
| Beranda > Katalog > Tas Anyam Pandan               |
+----------------------------------------------------+
| [ FOTO BESAR ]   [Anyaman] [Unggulan]              |
|                  Tas Anyam Pandan                  |
|                  Rp125.000                         |
|                  Deskripsi, bahan, pengrajin        |
|                  [ Hubungi via WA (Demo) ]         |
|                  [ Kembali ke Katalog ]            |
+----------------------------------------------------+
| PROFIL PENGRAJIN                                   |
| Pengrajin Anyam Lestari · Bali                     |
| Cerita usaha generik 1-2 paragraf.                 |
| [ Hubungi via WhatsApp (Demo) ]                    |
+----------------------------------------------------+
```

### 6.3 Dashboard

```text
+----------------------------------------------------+
| [KARYAKU][MODE DEMO] Dashboard Katalog [Keluar]    |
| Dashboard Pengrajin — simulasi lokal               |
+----------------------------------------------------+
| [8 Produk] [3 Unggulan] [3 Kategori]               |
| [ + Tambah Produk ] [ Reset Data Demo ]            |
+----------------------------------------------------+
| FOTO | NAMA              | KATEGORI | HARGA  | AKSI |
| [im] | Tas Anyam Pandan  | anyaman  | 125000 | [Edit][Hapus] |
| ...                                                  |
+----------------------------------------------------+
| PROFIL PENGRAJIN (DEMO)                            |
| Nama / Wilayah / Cerita / WA demo   [ Simpan ]     |
+----------------------------------------------------+
```

### 6.4 Login demo

```text
+----------------------------------------------------+
| [KARYAKU]                              [ Kembali ]  |
+----------------------------------------------------+
|              +------------------------------+      |
|              | MODE DEMO                    |      |
|              | Bukan autentikasi sungguhan. |      |
|              | pengrajin / karyaku-demo     |      |
|              | Username [................]  |      |
|              | Password [................]  |      |
|              | [ Masuk ke Dashboard ]       |      |
|              +------------------------------+      |
+----------------------------------------------------+
```

---

## 7. Wireframe teks — mobile

### 7.1 Katalog

```text
+----------------------------+
| [KARYAKU]          [ Menu ] |
+----------------------------+
| KARYAKU / Katalog kerajinan|
| Jelajahi kerajinan lokal.  |
| [ FOTO HERO ]              |
| [ Jelajahi Katalog ]       |
+----------------------------+
| 8 produk · 5 kategori      |
| [ Cari produk...        ]  |
| [Semua][Anyaman][Keramik]  |
| [Ukiran][Tekstil][Aksesori]|
| Urutkan [Unggulan] [Reset] |
+----------------------------+
| +------------------------+ |
| | FOTO PRODUK            | |
| | [Unggulan]             | |
| | Tas Anyam Pandan       | |
| | Anyaman · Rp125.000    | |
| +------------------------+ |
| ... kartu berikutnya ...   |
+----------------------------+
| Footer                     |
+----------------------------+
```

### 7.2 Detail

```text
+----------------------------+
| [KARYAKU]          [ Menu ] |
| < Kembali ke Katalog       |
+----------------------------+
| [ FOTO PRODUK BESAR ]      |
+----------------------------+
| [Anyaman] [Unggulan]       |
| Tas Anyam Pandan           |
| Rp125.000                  |
| Deskripsi, bahan, pengrajin|
| [ Hubungi via WA (Demo) ]  |
+----------------------------+
| PROFIL PENGRAJIN           |
| Pengrajin A · Bali         |
| Cerita usaha singkat.      |
| [ Hubungi WA (Demo) ]      |
+----------------------------+
```

### 7.3 Dashboard

```text
+----------------------------+
| [KARYAKU][DEMO]   [Keluar] |
| Dashboard Pengrajin        |
| Simulasi lokal.            |
+----------------------------+
| [8 Produk] [3 Unggulan]    |
| [ + Tambah Produk ]        |
| [ Reset Data Demo ]        |
+----------------------------+
| +------------------------+ |
| | [im] Tas Anyam Pandan  | |
| | anyaman · Rp125.000    | |
| | [Edit]      [Hapus]    | |
| +------------------------+ |
| PROFIL PENGRAJIN (DEMO)    |
| Nama / Wilayah / Cerita    |
| [ Simpan Profil Demo ]     |
+----------------------------+
```

### 7.4 Login demo

```text
+----------------------------+
| [KARYAKU]       [ Kembali ] |
+----------------------------+
| +------------------------+ |
| | MODE DEMO              | |
| | Bukan autentikasi nyata| |
| | pengrajin / karyaku-demo | |
| | Username [...........] | |
| | Password [...........] | |
| | [ Masuk (Demo) ]       | |
| +------------------------+ |
+----------------------------+
```

---

## 8. Responsivitas dan aksesibilitas

### 8.1 Breakpoint

| Lebar | Perlakuan |
| --- | --- |
| < 480 px | Satu kolom, navbar ringkas, tombol penuh lebar |
| 480–767 px | Satu kolom, chip filter bisa digeser horizontal |
| 768–1023 px | Dua kolom katalog, hero masih tumpuk |
| 1024–1279 px | Tiga kolom katalog, hero split, detail dua kolom |
| ≥ 1280 px | Empat kolom katalog, konten maksimal 1200 px |

- Mobile-first: satu kolom dulu, lalu tambah kolom di layar lebih besar.
- Foto kartu memakai rasio tetap dan crop proporsional, bukan distorsi.
- Toolbar ditumpuk di mobile, sejajar di desktop.
- Tidak ada scroll horizontal di 360 px kecuali chip filter yang memang digeser.
- Konten tetap terbaca saat zoom 200%.

### 8.2 Aksesibilitas

| Area | Pedoman |
| --- | --- |
| Kontras | Ikuti aturan 1.3; Taupe Teks untuk teks kecil |
| Fokus | Outline 2 px Terracotta Deep, jarak 2 px |
| Keyboard | Tab berurutan, Enter mengirim, Escape menutup dialog |
| Skip link | "Lewati ke konten" muncul saat Tab pertama |
| Semantik | Satu judul utama, heading berurutan, nav/main/footer jelas |
| Gambar | `alt` deskriptif untuk produk, `alt` kosong untuk dekorasi |
| Status dinamis | Jumlah hasil, error, sukses diumumkan dengan `aria-live` |
| Form | Label terlihat; placeholder bukan pengganti label |
| Sentuhan | Target minimum 44 × 44 px di mobile |
| Warna | Status memakai teks, bukan warna saja |
| Demo | Label demo hadir di login, dashboard, dan WhatsApp |
| Gerakan | Hormati preferensi pengurangan gerakan |

### 8.3 Checklist

- [ ] Palet dan kontras sesuai bagian 1.3.
- [ ] Komponen punya state default, hover, focus, disabled bila relevan.
- [ ] Foto produk menjadi elemen terbesar di kartu dan detail.
- [ ] Katalog tidak padat di desktop maupun mobile.
- [ ] Label **MODE DEMO** terlihat di semua titik demo.
- [ ] Tidak ada UI pembayaran, pengiriman, rating, atau wishlist.
- [ ] Wireframe mobile disetujui sebelum style desktop dikunci.

Konsistensi fitur dan pengujian mengacu ke `SPEC.md`; pelaksanaan tugas mengacu ke `TASKS.md`.
