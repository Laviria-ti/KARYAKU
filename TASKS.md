# DAFTAR TUGAS — KARYAKU

| Informasi | Nilai |
| --- | --- |
| Versi | 1.0 (dirapikan) |
| Tanggal | 2026-11-19 |
| Referensi | `CATATAN.md`, `SPEC.md`, `UI-SPEC.md` |
| Catatan | Daftar tugas saja; tidak ada kode aplikasi di sini. |

Saat ini baru ada tiga dokumen. Belum ada `package.json`, `index.html`, atau kode aplikasi.

**Definisi selesai:** acceptance criteria terpenuhi dan berkas terkait ditinjau tanpa error baru di console.

**Dependency:** storage disiapkan di M-01 sebagai fondasi, lalu diverifikasi penuh di M-08. Urutan milestone mengikuti daftar di bawah; pemetaan ke iterasi `SPEC.md`: M-01 = I-1, M-02/M-03 = I-2/I-3, M-04/M-05/M-06 = I-4, M-07/M-08 = I-5/I-6, M-09 = I-7, M-10 = build akhir.

---

## M-01 — Scaffold proyek

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-01.01 | Inisialisasi Vite vanilla | `npm install` dan `npm run dev` jalan; tanpa dependency runtime selain Vite; tanpa request eksternal; console bersih | `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, `.gitignore` |
| T-01.02 | Struktur modul dasar | Data/seed, storage, format, validasi, dan UI terpisah; bukan satu file besar | `src/main.js`, `src/data/seed.js`, `src/lib/*.js`, `src/ui/components.js` |
| T-01.03 | Aset gambar lokal | 8 SVG/PNG + placeholder; semua path valid; tanpa foto orang atau URL eksternal | `public/images/produk-01.svg` … `produk-08.svg`, `public/images/placeholder.svg` |
| T-01.04 | Token desain | Warna dan tipografi sesuai `UI-SPEC.md`; focus terlihat; tanpa webfont eksternal | `src/styles/tokens.css`, `src/styles/base.css` |
| T-01.05 | Fondasi seed localStorage | Buka pertama memuat 8 produk; refresh tidak menduplikasi | `src/data/seed.js`, `src/lib/storage.js`, `src/main.js` |

---

## M-02 — Katalog produk

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-02.01 | Navbar, Hero, Footer | Logo KARYAKU, tautan Beranda/Katalog/Tentang/Login, CTA "Jelajahi Katalog", catatan demo di footer | `index.html`, `src/ui/layout.js`, `src/styles/layout.css` |
| T-02.02 | Kartu produk | Foto, badge kategori/unggulan, nama, Rupiah, nama pengrajin; hover dan focus jelas | `src/ui/components.js`, `src/styles/components.css` |
| T-02.03 | Render 8 produk | Tepat 8 kartu (AC-01); `prod-001` bertanda `Rp125.000`; tanpa prompt login | `src/ui/catalog.js`, `src/main.js` |
| T-02.04 | Grid responsif | 1 kolom di 360 px, 2 di tablet, 3 di 1024 px, 4 di ≥1280 px; tanpa scroll horizontal | `src/styles/catalog.css`, `src/styles/tokens.css` |
| T-02.05 | Ringkasan hasil | Baris "8 produk · 5 kategori" muncul dan ikut berubah saat filter dipakai | `src/ui/catalog.js`, `index.html` |

---

## M-03 — Pencarian dan filter kategori

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-03.01 | Pencarian | `pandan` ditemukan tanpa peduli huruf (AC-03); `  ROTAN  ` sama dengan `rotan` (AC-04); mencakup nama, deskripsi, bahan, kategori, pengrajin | `src/lib/filter.js`, `src/ui/catalog.js` |
| T-03.02 | Filter kategori | `Semua` + 5 kategori (AC-02); `keramik` menampilkan 2 produk (AC-05); chip aktif memakai Terracotta Deep | `src/ui/catalog.js`, `src/styles/catalog.css` |
| T-03.03 | Sorting 6 opsi | Unggulan, Nama A–Z/Z–A, Harga Terendah/Tertinggi, Kategori A–Z; tie-breaker `nama` lalu `id` (AC-06) | `src/lib/filter.js`, `src/ui/catalog.js` |
| T-03.04 | Pipeline gabungan | Urutan pencarian → filter → sorting dipertahankan; kombinasi anyaman + rotan + harga tetap benar (AC-06) | `src/lib/filter.js`, `src/main.js` |
| T-03.05 | Empty state & reset | Pesan "Produk tidak ditemukan…" + Reset Filter (AC-07); reset mengembalikan `Semua` dan `Unggulan` (AC-08) | `src/ui/catalog.js`, `src/ui/components.js` |

---

## M-04 — Detail produk

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-04.01 | Navigasi detail | Klik kartu `prod-001` membuka detail sesuai (AC-09); breadcrumb dan "Kembali ke Katalog" berfungsi | `src/main.js`, `src/ui/detail.js`, `src/ui/layout.js` |
| T-04.02 | Layout detail | Foto besar + kategori, badge, nama, harga, deskripsi, bahan, pengrajin (AC-09); 2 kolom desktop, 1 kolom mobile | `src/ui/detail.js`, `src/styles/detail.css` |
| T-04.03 | Render aman | Input `<script>alert(1)</script>` tampil sebagai teks, tanpa alert, console bersih (AC-22) | `src/ui/detail.js`, `src/ui/components.js` |
| T-04.04 | Format harga | `Rp125.000` konsisten dengan kartu (NFR-09) | `src/lib/format.js`, `src/ui/detail.js` |

---

## M-05 — Profil pengrajin

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-05.01 | Data profil generik | Nama dari produk, wilayah "Bali", cerita 1–2 paragraf; tanpa alamat/email/nomor pribadi (AC-10) | `src/data/artisans.js`, `src/data/seed.js` |
| T-05.02 | Kartu profil di detail | Inisial motif, nama, wilayah, cerita, dan tombol WhatsApp demo tampil sesuai `UI-SPEC.md` 4.2 | `src/ui/detail.js`, `src/styles/detail.css` |
| T-05.03 | Audit privasi | Seed, profil, dan pesan WA bebas data pribadi nyata (NFR-08, R-04) | `src/data/seed.js`, `src/data/artisans.js`, `src/lib/whatsapp.js` |

> Catatan: field profil di dashboard tetap generik sampai `karyaku_profile_v1` disetujui. Lihat `UI-SPEC.md` 4.4 dan T-07.08.

---

## M-06 — Tombol WhatsApp

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-06.01 | Komponen tombol | Teks memuat "(Demo)"; tersedia di detail dan kartu profil; hover/focus terlihat | `src/ui/components.js`, `src/styles/components.css` |
| T-06.02 | Tautan WA demo | `wa.me/6281200000000` + pesan berisi nama produk ter-encode (AC-11); nomor ditampilkan `0812-0000-0000` | `src/lib/whatsapp.js`, `src/ui/detail.js` |
| T-06.03 | Tab baru aksesibel | Tab baru diberi penanda "(tab baru)"; tidak meminta/menyimpan nomor pengunjung | `src/ui/components.js`, `src/ui/detail.js` |
| T-06.04 | Tanpa integrasi nyata | Tidak ada WhatsApp Business API, webhook, atau kiriman ke pihak ketiga (AC-25) | `src/lib/whatsapp.js` |

---

## M-07 — Dashboard CRUD produk

Field profil di dashboard hanya memakai data generik sampai `karyaku_profile_v1` disetujui.

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-07.01 | Login simulasi | Teks demo + kredensial tertera (AC-12); salah → error (AC-13); benar → dashboard + banner (AC-14) | `src/ui/auth.js`, `src/styles/auth.css`, `src/main.js` |
| T-07.02 | Guard & logout | Tanpa sesi, URL dashboard kembali ke katalog (AC-15); Keluar menghapus sesi (AC-24) | `src/ui/auth.js`, `src/lib/storage.js`, `src/ui/layout.js` |
| T-07.03 | Shell dashboard | Judul, subjudul demo, SummaryStat, dan daftar ProductListRow sesuai `UI-SPEC.md` 4.4 | `src/ui/dashboard.js`, `src/styles/dashboard.css` |
| T-07.04 | Tambah & edit | Validasi field `SPEC.md` 4.1; produk baru muncul setelah refresh (AC-16); edit harga muncul di katalog (AC-17) | `src/ui/dashboard.js`, `src/lib/validation.js`, `src/lib/storage.js` |
| T-07.05 | Hapus dengan konfirmasi | Batal → tidak terhapus (AC-18); setuju → hilang setelah refresh (AC-19); Escape menutup dialog | `src/ui/dashboard.js`, `src/ui/components.js` |
| T-07.06 | Foto lokal | PNG/JPEG/WebP/SVG ≤ 2 MB tampil tanpa URL eksternal (AC-20); 3 MB ditolak (AC-21); kosong → placeholder | `src/lib/image.js`, `src/ui/dashboard.js` |
| T-07.07 | Reset Data Demo | Konfirmasi → kembali ke 8 produk + schema version direset (AC-23) | `src/ui/dashboard.js`, `src/lib/storage.js` |
| T-07.08 | ProfileEditor demo | Field nama, wilayah, cerita, WA demo; hanya data generik; aktif penuh bila key profil disetujui | `src/ui/dashboard.js`, `src/lib/storage.js` |

---

## M-08 — localStorage

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-08.01 | Wrapper storage | Data bukan array → kembali ke seed tanpa crash; `karyaku_schema_version` mengontrol seed ulang | `src/lib/storage.js`, `src/data/seed.js` |
| T-08.02 | Persistensi CRUD | Tambah/edit/hapus/reset tertulis ke storage; tetap ada setelah refresh (AC-16, AC-17, AC-19, AC-23) | `src/lib/storage.js`, `src/ui/dashboard.js` |
| T-08.03 | Sesi demo | Login menulis `karyaku_session_v1`; logout menghapus; refresh menjaga sesi, logout memblokir (AC-14, AC-15, AC-24) | `src/lib/storage.js`, `src/ui/auth.js` |
| T-08.04 | Kuota & mode privat | Penuh/blokir → pesan jelas, tetap usable dalam sesi, tanpa error uncaught (R-05, R-06) | `src/lib/storage.js`, `src/ui/dashboard.js` |
| T-08.05 | Tanpa kiriman data | Tidak ada fetch, API key, token, cookie, atau server session (NFR-02, NFR-03) | `src/lib/storage.js`, `src/main.js` |
| T-08.06 | Key profil bila disetujui | Jika disetujui, `karyaku_profile_v1` berisi data generik; jika tidak, lewati | `src/lib/storage.js`, `src/data/artisans.js` |

---

## M-09 — Testing

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-09.01 | Uji AC | AC-01–AC-26 lulus; checklist `UI-SPEC.md` 8.3 tercentang | `TASKS.md`, `README.md` |
| T-09.02 | Responsif & aksesibel | Diuji 360/768/1024/1280 px + zoom 200%; Tab, Enter, Escape, focus, `alt`, label form berfungsi | `src/styles/*.css`, `index.html`, `src/ui/*.js` bila diperbaiki |
| T-09.03 | Keamanan & privasi | Tanpa `innerHTML` data produk, `eval`, request eksternal, atau data pribadi; AC-22 dan AC-25 lulus | `src/ui/*.js`, `src/lib/*.js` bila diperbaiki |
| T-09.04 | Error & empty state | Pencarian kosong, login salah, file > 2 MB, storage penuh, dashboard tanpa sesi memberi pesan jelas; console bersih | `src/ui/catalog.js`, `src/ui/auth.js`, `src/ui/dashboard.js` |
| T-09.05 | Smoke lintas browser | Alur katalog → detail → WA → login → CRUD lulus di Chromium dan Firefox | `TASKS.md`, berkas sumber bila ada bug |
| T-09.06 | Finalisasi | Semua milestone ditandai selesai; bukti progres ada di `TASKS.md` | `TASKS.md`, `README.md` |

---

## M-10 — Build

| ID | Tugas | Acceptance criteria | Berkas yang mungkin berubah |
| --- | --- | --- | --- |
| T-10.01 | Build produksi | `npm run build` sukses; `dist/` berisi HTML, JS, CSS, gambar; tanpa dependency gagal | `dist/`, `package.json`, `vite.config.js` |
| T-10.02 | Preview build | `npm run preview` jalan; smoke AC-01, AC-09, AC-14, AC-16 lulus di hasil build | `dist/`, `TASKS.md` |
| T-10.03 | Path aset | 8 gambar + placeholder termuat dari `dist/`; tanpa request ke domain lain (AC-25) | `dist/images/`, `vite.config.js` |
| T-10.04 | README | Cara install, dev, build, preview, kredensial demo, dan batasan: bukan marketplace, login simulasi, data di browser | `README.md`, `TASKS.md` |
| T-10.05 | Serah terima | M-01–M-10 selesai; tidak ada perintah destruktif dijalankan (R-09) | `TASKS.md`, `README.md` |

---

## Catatan penting

1. Perkiraan berkas bersifat panduan; struktur akhir boleh menyesuaikan selama modul tetap terpisah.
2. Login tetap simulasi dan diberi label demo di setiap titik temu pengguna.
3. Nomor WhatsApp, nama pengrajin, dan cerita usaha tetap generik.
4. Dilarang menambah checkout, pembayaran, pengiriman, rating, wishlist, backend, API key, atau perintah berbahaya.
5. Hasil AI wajib diperiksa dan diuji terhadap acceptance criteria sebelum ditandai selesai.
