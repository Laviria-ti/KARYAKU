# LAPORAN AUDIT KEAMANAN — KARYAKU

| Informasi | Nilai |
| --- | --- |
| Tanggal audit | 2026-11-19 |
| Ruang lingkup | Kode yang benar-benar ada di repository (`src/`, `index.html`, `package.json`, `package-lock.json`, `tests/`, `.gitignore`) |
| Referensi | [OWASP Top 10:2025](https://top10.owasp.org/2025/) (A01–A10) |
| Metode | Tinjauan kode statis + probe runtime Node.js + uji browser Chromium + `npm audit` |
| Perubahan kode | **Tidak ada.** Audit ini hanya menghasilkan laporan ini. |
| Konteks | Aplikasi Vite + JS vanilla, sepenuhnya sisi klien, **prototipe demo lokal** tanpa backend |

## Status verifikasi

| Status | Arti |
| --- | --- |
| **Terbukti (kode + runtime)** | Ditemukan di kode dan berhasil direproduksi dengan probe/uji browser |
| **Terbukti (kode)** | Ditemukan di kode; dampaknya belum direproduksi penuh |
| **Tidak ditemukan** | Pemeriksaan dilakukan, tidak ditemukan bukti masalah |
| **Sesuai desain demo** | Perilaku memang disengaja dan diberi label demo, bukan kerentanan produksi |
| **Tidak relevan** | Tidak ada permukaan serangan yang sesuai di prototipe lokal |

---

## 1. Ringkasan temuan

| ID | OWASP 2025 | Temuan | Risiko | Status |
| --- | --- | --- | --- | --- |
| F-01 | A05 / A06 | Validasi `imageUrl` hanya menolak `http(s)://`; URL relatif protokol (`//host/...`) diterima dan memicu request eksternal | **Sedang** | Terbukti (kode + runtime) |
| F-02 | A05 | `javascript:` dan `data:text/html` diterima sebagai `imageUrl`; tidak tereksekusi di `<img>` modern, tetapi tetap URL tidak sah | Rendah | Terbukti (kode + runtime) |
| F-03 | A10 | `decodeURIComponent()` pada hash tanpa `try/catch` → `URIError` saat URL produk malformed | Rendah | Terbukti (kode + runtime) |
| F-04 | A05 / A08 | Upload gambar hanya memeriksa MIME dari browser dan ukuran, tanpa *magic bytes*; SVG diterima apa adanya | Rendah–Sedang | Terbukti (kode) |
| F-05 | A06 / A10 | Impor JSON tidak membatasi jumlah item maupun ukuran payload | Rendah–Sedang | Terbukti (kode + runtime) |
| F-06 | A01 / A07 | Akses dashboard hanya dijaga kunci `localStorage` yang bisa ditulis siapa pun pada origin yang sama | Rendah (demo) / Tinggi (jika diproduksi) | Terbukti (kode), sesuai desain demo |
| F-07 | A02 | Tidak ada Content-Security-Policy / header keamanan pada HTML statis | Rendah | Terbukti (kode) |
| F-08 | A03 | Dependensi memakai rentang caret (`^`); lockfile sudah mengunci versi dan integritas | Rendah | Terbukti (kode), mitigasi sudah ada |
| — | A04, A08, A09 | Tidak ada data sensitif, kriptografi, log server, atau backend pada prototipe | — | Tidak relevan / sesuai desain demo |

**Kesimpulan risiko:** tidak ditemukan temuan berisiko **Tinggi/Kritis** dalam ruang lingkup prototipe lokal. Satu temuan berisiko **Sedang** (F-01). Temuan F-06 menjadi **Tinggi/Kritis** hanya jika desain demo ini dipakai untuk data atau akun nyata — hal tersebut sudah dicegah secara eksplisit di `MIGRATION-PLAN.md`.

---

## 2. Temuan rinci

### F-01 — Validasi URL gambar tidak lengkap (memicu request eksternal)

- **Lokasi:** `src/store.js:37-39` (`bukanUrlEksternal`), `src/store.js:104-106` (`validasiProduk`), `src/store.js:123` (`produkValid`), `src/ui.js:140-144` (`kartuProduk`), `src/ui.js:611` (thumb dashboard)
- **Kode:**
  ```js
  function bukanUrlEksternal(nilai) {
    return !/^https?:\/\//i.test(String(nilai || "").trim());
  }
  ```
- **Bukti runtime (Node):** `//evil.example/x.png` → **DITERIMA**; `https://evil.example/x.png` → ditolak.
- **Bukti runtime (browser):** import JSON berisi `imageUrl: "//evil.example/track.png"` diterima (`ok: true`), tersimpan di localStorage, dan network log mencatat:
  ```
  http://evil.example/track.png   state: completed   resourceType: image
  ```
- **Dampak:** melanggar batasan "tanpa request eksternal" pada `SPEC.md`; dapat dipakai untuk melacak pengunjung, memuat aset dari host pihak ketiga, atau memprobes alamat localhost/LAN dari browser korban melalui `<img>`.
- **Rekomendasi:** ganti pendekatan blacklist dengan whitelist skema yang diizinkan, misalnya hanya `data:image/(png|jpeg|webp|svg+xml)` dan path relatif `/...`; secara eksplisit tolak `//`, `javascript:`, `data:text/html`, dan skema lain. Tambahkan CSP `img-src 'self' data:` sebagai lapisan pertahanan.
- **Status:** **Terbukti (kode + runtime)** — risiko **Sedang**.

### F-02 — Skema `javascript:` dan `data:text/html` diterima sebagai URL gambar

- **Lokasi:** sama dengan F-01; sink di `src/ui.js:140-144` dan `src/ui.js:654`/`716` (`preview.src`)
- **Bukti runtime:** `javascript:alert(1)` dan `data:text/html,<script>alert(1)</script>` keduanya **DITERIMA** oleh `validasiProduk()`. Di browser, `<img src="javascript:window.__auditXss=1">` menghasilkan `net::ERR_UNKNOWN_URL_SCHEME`, variabel `window.__auditXss` tetap `undefined`, dan tidak ada skrip yang berjalan.
- **Dampak:** **belum terbukti sebagai XSS** pada Chromium modern karena `<img>` tidak mengeksekusi skrip. Ini adalah celah validasi/pertahanan berlapis: jika suatu hari nilai yang sama dipindahkan ke atribut `href`/`iframe`, risikonya langsung menjadi XSS.
- **Rekomendasi:** whitelist skema seperti pada F-01; jangan mengandalkan fakta bahwa `<img>` aman saat ini.
- **Status:** **Terbukti (kode + runtime)** — risiko **Rendah** saat ini.

### F-03 — Penanganan URL produk malformed (exception)

- **Lokasi:** `src/ui.js:953-961` (`ruteSaatIni`) dan `src/ui.js:963-969` (`render`)
- **Kode:**
  ```js
  if (bagian.startsWith("produk/")) {
    return { nama: "detail", id: decodeURIComponent(bagian.slice("produk/".length)) };
  }
  ```
- **Bukti runtime:** membuka `#/produk/%E0%A4%A` menghasilkan error konsol:
  ```
  URIError: URI malformed
      at decodeURIComponent (<anonymous>)
      at ... (bundle produksi)
  ```
  Render tidak selesai, tampilan sebelumnya tetap tampil (stale view).
- **Dampak:** gangguan ketersediaan lokal/UX; bukan eksekusi kode.
- **Rekomendasi:** bungkus `decodeURIComponent` dengan `try/catch`, dan arahkan ke halaman "Produk tidak ditemukan" atau katalog bila decoding gagal.
- **Status:** **Terbukti (kode + runtime)** — risiko **Rendah**.

### F-04 — Pemeriksaan upload gambar hanya berbasis MIME

- **Lokasi:** `src/ui.js:702-725` (handler `change` pada `#form-file`)
- **Kode:** pemeriksaan `["image/png","image/jpeg","image/webp","image/svg+xml"].includes(berkas.type)` dan `berkas.size > 2 * 1024 * 1024`, lalu `FileReader.readAsDataURL(berkas)`.
- **Analisis:** `File.type` berasal dari metadata yang dikendalikan pengguna/\*client\* dan dapat dipalsukan; tidak ada pemeriksaan *magic bytes*, tidak ada sanitasi SVG, dan tidak ada pembatasan panjang data URL terhadap kuota `localStorage`.
- **Dampak:** file bukan gambar dapat masuk sebagai data URL. Eksploitasi XSS **tidak terbukti** pada `<img>` modern (lihat F-02), tetapi risiko tetap ada untuk *parser* lain dan untuk kehabisan kuota penyimpanan.
- **Rekomendasi:** periksa tanda tangan biner (PNG/JPEG/WebP), untuk SVG lakukan sanitasi ketat atau tolak SVG, dan batasi total ukuran data URL sebelum menulis ke localStorage.
- **Status:** **Terbukti (kode)** — risiko **Rendah–Sedang**.

### F-05 — Impor JSON tanpa batas ukuran/jumlah

- **Lokasi:** `src/store.js:206-231` (`imporJSON`), `src/store.js:129-137` (`daftarValid`)
- **Analisis:** `JSON.parse` dibungkus `try/catch` dan `daftarValid` memeriksa tipe, panjang teks, enum, serta keunikan `id`. Namun tidak ada batas untuk `hasil.length`, ukuran berkas, atau kedalaman/struktur keseluruhan.
- **Bukti runtime (Node):** impor array berisi **20.000 produk** diterima dengan `ok: true`.
- **Dampak:** penguncian UI saat merender ribuan kartu/baris tabel, serta kemungkinan melebihi kuota `localStorage` (yang sudah ditangani dengan fallback `storageOk`, tetapi pengalaman pengguna tetap memburuk).
- **Rekomendasi:** tentukan batas misalnya maksimal 1.000 produk dan 2 MB per berkas; kembalikan pesan error yang jelas bila terlampaui.
- **Status:** **Terbukti (kode + runtime)** — risiko **Rendah–Sedang**.

### F-06 — Kontrol akses dashboard demo bersifat klien-saja

- **Lokasi:** `src/store.js:268-282` (`sedangLogin`, `loginDemo`, `logoutDemo`), `src/ui.js:551-556` (guard `renderDashboard`), `src/products.js:3-9` (kredensial demo)
- **Analisis:** `sedangLogin()` hanya membandingkan `localStorage["karyaku_session_v1"]` dengan `"demo-pengrajin"`. Kunci tersebut dapat ditulis langsung dari DevTools atau skrip lain pada origin yang sama, sehingga dashboard dapat dibuka tanpa through form login. Tidak ada server, cookie, atau otorisasi.
- **Dampak:** sesuai desain: ini adalah simulasi lokal, data yang dijaga juga hanya data demo di browser yang sama. Menjadi **A01/A07 berisiko Tinggi** jika kredensial/session model ini dipakai untuk akun atau data nyata.
- **Rekomendasi:** pertahankan label **MODE DEMO** dan teks "Simulasi lokal, bukan autentikasi sungguhan"; jangan menambahkan data nyata. Implementasi sesame server (Argon2id, cookie `__Host-` HttpOnly/Secure/SameSite, CSRF, RBAC, isolasi `owner_id`) sudah direncanakan di `MIGRATION-PLAN.md` fase 2–3 dan **tidak** diimplementasikan di sini.
- **Status:** **Terbukti (kode)** — **sesuai desain demo**.

### F-07 — Tidak ada CSP / header keamanan pada HTML statis

- **Lokasi:** `index.html:1-14` (tidak ada `<meta http-equiv="Content-Security-Policy">`); tidak ada konfigurasi server/konfigurasi Vite khusus di repository.
- **Analisis:** aplikasi tidak memuat aset eksternal, sehingga permukaan serangan kecil. Namun tidak ada kebijakan yang mencegah skrip inline pihak ketiga, `img-src` sembarang origin, atau `frame-ancestors` bila kelak di-embed.
- **Rekomendasi:** pada deployment statis, tambahkan CSP minimal `default-src 'self'; img-src 'self' data:; script-src 'self'; object-src 'none'; frame-ancestors 'none'` melalui header hosting (atau meta sebagai fallback), plus `X-Content-Type-Options: nosniff` dan `Referrer-Policy: no-referrer`.
- **Status:** **Terbukti (kode)** — risiko **Rendah**.

### F-08 — Rantai pasok dependensi

- **Lokasi:** `package.json` (devDependencies `vite ^8.3.8`, `vitest ^5.1.1`), `package-lock.json` (lockfileVersion 3, `resolved` + `integrity` sha512 untuk tiap paket), `.gitignore:1-3`.
- **Hasil `npm audit --json` (aktual):**
  ```json
  "vulnerabilities": {},
  "metadata": { "vulnerabilities": { "info": 0, "low": 0, "moderate": 0,
                 "high": 0, "critical": 0, "total": 0 },
                "dependencies": { "total": 67 } }
  ```
- **Versi terpasang:** `vite@8.3.8`, `vitest@5.1.1`. `node_modules/`, `dist/`, dan `.env` sudah diabaikan git.
- **Catatan:** rentang caret mengizinkan pembaruan minor/patch saat `npm install` tanpa lockfile; lockfile yang ter-commit sudah memitigasi ini. Tidak ada skrip `postinstall` kustom, tidak ada dependensi produksi selain bundler/test.
- **Rekomendasi:** gunakan `npm ci` di CI, pertahankan commit lockfile, jalankan `npm audit` berkala, dan pertimbangkan pins versi eksak atauDependabot.
- **Status:** **Tidak ditemukan kerentanan** pada saat audit — risiko **Rendah**.

---

## 3. Fokus pemeriksaan tambahan

### XSS dan penggunaan `innerHTML`

- Pencarian ke seluruh repository (kecuali `node_modules/`) untuk `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval(`, `new Function` menemukan **hanya penyebutan di dokumentasi** (`TASKS.md:124`, `SPEC.md:156,170`, `MIGRATION-PLAN.md:151`), **bukan kode aplikasi**.
- `src/ui.js:26-57` (`el`, `tambahAnak`) memakai `textContent`, `createTextNode`, dan `setAttribute`; tidak ada template HTML dari data produk.
- Uji browser dengan nama produk `Audit XSS <img src=x onerror=alert(1)>`: teks tampil apa adanya sebagai teks, `document.querySelectorAll('#app script, #app img[onerror]').length === 0`.
- **Status: Tidak ditemukan XSS yang terbukti.** Catatan: praktik aman ini harus tetap dijaga karena F-01/F-02 melemahkan validasi URL.

### Penanganan URL dan input pengguna

- `href` detail produk memakai `encodeURIComponent(produk.id)` (`src/ui.js:136`) — aman.
- URL WhatsApp (`src/ui.js:392-410`) memvalidasi nomor dengan regex `^[1-9]\d{7,14}$` dan menyandikan pesan dengan `encodeURIComponent`; `target="_blank"` disertai `rel="noopener noreferrer"` — aman. Nomor demo dan teks "bukan nomor nyata" bersifat publik/disengaja.
- Celah yang ditemukan: F-01, F-02, F-03, F-04.

### Validasi impor JSON

- Positif: `JSON.parse` dalam `try/catch`; validasi tipe, panjang, enum kategori, integer ≥ 0 untuk `harga`/`stok`, `id` unik; `normalisasi()` hanya menyalin field yang dikenal (mencegah field tambahan/injeksi proto).
- Negatif: F-05 (tanpa batas ukuran). Tidak ada tanda tangan/integritas berkas — **sesuai desain demo**, bukan temuan produksi.
- Pesan error sudah tidak membocorkan stack trace ke UI.

### Keamanan localStorage

- Kunci memakai prefix `karyaku:` / `karyaku_` (`src/store.js:3-5`); baca/tulis dibungkus `try/catch`; versi schema `1`; data rusak dimulihkan ke seed dengan notifikasi (`src/store.js:139-170`).
- Data disimpan plaintext, tetapi hanya berisi katalog demo dan nomor WhatsApp demo — **tidak ada data pribadi nyata**. Risiko Utama adalah akses oleh skrip pada origin yang sama (lihat F-06); karena XSS tidak ditemukan, tidak ada jalur eksploitasi yang terbukti.
- Fallback memori saat penyimpanan diblokir sudah ada dan diberi tahu ke pengguna (`src/ui.js:104-112`, `src/ui.js:828-835`).

### Kebocoran secret / API key

- Tidak ditemukan file `.env`, kunci API, token, `Bearer`, kunci privat, atau variabel lingkungan rahasia di source/konfigurasi yang ter-commit.
- Satu-satunya kredensial literal adalah `pengrajin / karyaku-demo` di `src/products.js:4-5`, dan sengaja ditampilkan di form login (`src/ui.js:489`) dengan label **AKUN DEMO** — **bukan secret**, dan sesuai desain prototipe.
- Tidak ada permintaan jaringan ke API pihak ketiga; satu-satunya URL eksternal adalah `https://wa.me/...` yang dibuka setelah pengguna mengklik tombol WhatsApp demo.

### Kontrol akses dashboard demo

- Lihat F-06. Guard hanya di sisi klien dan dapat dilewati, tetapi tidak melindungi data nyata. Tidak ada fitur admin, tidak ada endpoint, tidak adamulti-tenant, sehingga tidak ada IDOR/RBAC yang bisa diuji di prototipe ini.

---

## 4. Pemetaan OWASP Top 10:2025

| Kategori | Status pada KARYAKU | Bukti / catatan |
| --- | --- | --- |
| A01 Broken Access Control | Sesuai desain demo; **Tinggi** bila diproduksi | F-06; rencana RBAC/owner isolation di `MIGRATION-PLAN.md` |
| A02 Security Misconfiguration | Rendah | F-07; tidak ada CSP/header keamanan, tetapi tidak ada aset eksternal |
| A03 Software Supply Chain Failures | Rendah / tidak ditemukan | F-08; `npm audit` 0 temuan, lockfile + integritas ada |
| A04 Cryptographic Failures | Tidak relevan | Tanpa password nyata, tanpa data sensitif, tanpa kriptografi |
| A05 Injection | Rendah | Tanpa SQL/eval/innerHTML; F-01, F-02, F-04 adalah celah validasi input/URL |
| A06 Insecure Design | Rendah–Sedang | F-05; localStorage sebagai sumber kebenalan memang desain demo |
| A07 Authentication Failures | Sesuai desain demo | Login demo plaintext tanpa rate limit, diberi label simulasi |
| A08 Software or Data Integrity Failures | Rendah | Impor JSON tanpa tanda tangan (demo); F-04; tidak ada pipeline CI/CD di repo |
| A09 Security Logging and Alerting Failures | Tidak relevan | Tidak ada server/log; audit log direncanakan di `MIGRATION-PLAN.md` §7 |
| A10 Mishandling of Exceptional Conditions | Rendah | F-03; exception lain sudah ditangani (`JSON.parse`, localStorage, pembacaan berkas) |

---

## 5. Prioritas rekomendasi (tanpa implementasi pada audit ini)

1. **F-01 (Sedang):** ganti `bukanUrlEksternal` dengan whitelist skema gambar; tambahkan CSP `img-src 'self' data:`.
2. **F-05 (Rendah–Sedang):** batasi jumlah produk dan ukuran berkas impor.
3. **F-04 (Rendah–Sedang):** validasi *magic bytes* dan/atau tolak/sanitasi SVG pada upload.
4. **F-03 (Rendah):** `try/catch` pada `decodeURIComponent` di router hash.
5. **F-02 (Rendah):** whitelist skema menutup masalah ini sekaligus dengan F-01.
6. **F-07 (Rendah):** tambahkan header/CSP pada hosting statis.
7. **F-06 & F-08:** pertahankan mitigasi yang sudah ada (label demo + lockfile/`npm ci`); jangan bawa desain demo ke produksi — gunakan `MIGRATION-PLAN.md`.

---

## 6. Catatan verifikasi

- Tone audit ini **hanya laporan**: tidak ada baris kode aplikasi, spesifikasi, `CATATAN.md`, atau konfigurasi yang diubah selama audit.
- Probe Node.js dan uji browser dilakukan terhadap build yang sudah ada (`dist/`), dengan server preview sementara yang sudah dihentikan.
- Data localStorage pada browser uji tidak dijadikan bagian dari repository.
- Temuan bertanda "Terbukti (runtime)" dapat direproduksi dengan: memasukkan `imageUrl: "//evil.example/track.png"` melalui impor JSON, membuka `#/produk/%E0%A4%A`, dan menjalankan `npm audit --json`.
