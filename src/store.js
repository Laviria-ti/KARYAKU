import { DEMO, KATEGORI, PLACEHOLDER_IMAGE, PRODUCTS_SEED } from "./products.js";

const KEY_VERSION = "karyaku_schema_version";
const KEY_PRODUCTS = "karyaku:products:v1";
const KEY_SESSION = "karyaku_session_v1";
const SCHEMA = "1";

let memory = salinSeed();
let sessionMemory = false;
let storageOk = true;
let pemberitahuan = "";

function salinSeed() {
  return PRODUCTS_SEED.map((item) => ({ ...item }));
}

function baca(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    storageOk = false;
    return null;
  }
}

function tulis(key, nilai) {
  try {
    localStorage.setItem(key, nilai);
    storageOk = true;
    return true;
  } catch {
    storageOk = false;
    return false;
  }
}

function bukanUrlEksternal(nilai) {
  return !/^https?:\/\//i.test(String(nilai || "").trim());
}

function normalisasi(p) {
  return {
    id: p.id,
    nama: p.nama,
    kategori: p.kategori,
    harga: p.harga,
    stok: p.stok,
    deskripsi: p.deskripsi,
    bahan: p.bahan,
    imageUrl: p.imageUrl,
    namaPengrajin: p.namaPengrajin,
    unggulan: p.unggulan,
  };
}

export function validasiProduk(input) {
  const errors = {};
  const hargaMentah = input.harga;
  const stokMentah = input.stok;
  const value = {
    nama: String(input.nama ?? "").trim(),
    kategori: String(input.kategori ?? ""),
    harga: Number(hargaMentah),
    stok: Number(stokMentah),
    deskripsi: String(input.deskripsi ?? "").trim(),
    bahan: String(input.bahan ?? "").trim(),
    imageUrl: String(input.imageUrl ?? "").trim() || PLACEHOLDER_IMAGE,
    namaPengrajin: String(input.namaPengrajin ?? "").trim(),
    unggulan: Boolean(input.unggulan),
  };

  if (!value.nama) {
    errors.nama = "Nama produk wajib diisi.";
  } else if (value.nama.length > 80) {
    errors.nama = "Nama maksimal 80 karakter.";
  }
  if (!KATEGORI.includes(value.kategori)) {
    errors.kategori = "Pilih salah satu kategori yang tersedia.";
  }
  if (
    hargaMentah === "" ||
    hargaMentah === null ||
    hargaMentah === undefined ||
    !Number.isInteger(value.harga) ||
    value.harga < 0
  ) {
    errors.harga = "Harga harus bilangan bulat minimal 0.";
  }
  if (
    stokMentah === "" ||
    stokMentah === null ||
    stokMentah === undefined ||
    !Number.isInteger(value.stok) ||
    value.stok < 0
  ) {
    errors.stok = "Stok harus bilangan bulat minimal 0.";
  }
  if (value.deskripsi.length < 10 || value.deskripsi.length > 500) {
    errors.deskripsi = "Deskripsi harus 10–500 karakter.";
  }
  if (value.bahan.length < 3 || value.bahan.length > 120) {
    errors.bahan = "Bahan harus 3–120 karakter.";
  }
  if (!bukanUrlEksternal(value.imageUrl)) {
    errors.imageUrl = "Foto harus lokal atau hasil upload, bukan URL eksternal.";
  }
  if (value.namaPengrajin.length < 3 || value.namaPengrajin.length > 80) {
    errors.namaPengrajin = "Nama pengrajin harus 3–80 karakter.";
  }

  return { errors, value };
}

function produkValid(p) {
  if (!p || typeof p !== "object" || Array.isArray(p)) return false;
  if (typeof p.id !== "string" || !p.id) return false;
  if (typeof p.nama !== "string" || !p.nama || p.nama.length > 80) return false;
  if (!KATEGORI.includes(p.kategori)) return false;
  if (!Number.isInteger(p.harga) || p.harga < 0) return false;
  if (!Number.isInteger(p.stok) || p.stok < 0) return false;
  if (typeof p.deskripsi !== "string" || p.deskripsi.length < 10 || p.deskripsi.length > 500) return false;
  if (typeof p.bahan !== "string" || p.bahan.length < 3 || p.bahan.length > 120) return false;
  if (typeof p.imageUrl !== "string" || !bukanUrlEksternal(p.imageUrl)) return false;
  if (typeof p.namaPengrajin !== "string" || p.namaPengrajin.length < 3 || p.namaPengrajin.length > 80) return false;
  if (typeof p.unggulan !== "boolean") return false;
  return true;
}

function daftarValid(daftar) {
  if (!Array.isArray(daftar)) return false;
  const id = new Set();
  for (const p of daftar) {
    if (!produkValid(p) || id.has(p.id)) return false;
    id.add(p.id);
  }
  return true;
}

function muat() {
  const versi = baca(KEY_VERSION);
  const mentah = baca(KEY_PRODUCTS);
  let daftar = null;
  let rusak = false;

  if (mentah) {
    try {
      const hasil = JSON.parse(mentah);
      if (versi === SCHEMA && daftarValid(hasil)) {
        daftar = hasil.map(normalisasi);
      } else if (versi === SCHEMA) {
        rusak = true;
      }
    } catch {
      rusak = true;
    }
  }

  if (!daftar) {
    daftar = salinSeed();
    tulis(KEY_VERSION, SCHEMA);
    tulis(KEY_PRODUCTS, JSON.stringify(daftar));
    if (rusak) {
      pemberitahuan = "Data produk tidak valid atau rusak. Data contoh dipulihkan.";
    }
  }

  memory = daftar;
  sessionMemory = baca(KEY_SESSION) === DEMO.sesi;
  return memory;
}

function simpan() {
  return tulis(KEY_PRODUCTS, JSON.stringify(memory));
}

function idBerikutnya() {
  const angka = memory
    .map((p) => Number.parseInt(p.id.replace("prod-", ""), 10))
    .filter((n) => Number.isFinite(n));
  const maks = angka.length ? Math.max(...angka) : 0;
  return `prod-${String(maks + 1).padStart(3, "0")}`;
}

export function initStore() {
  return muat();
}

export function ambilProduk() {
  return memory.map((p) => ({ ...p }));
}

export function penyimpananOk() {
  return storageOk;
}

export function ambilPemberitahuan() {
  const pesan = pemberitahuan;
  pemberitahuan = "";
  return pesan;
}

export function eksporJSON() {
  return JSON.stringify(ambilProduk(), null, 2);
}

export function imporJSON(teks) {
  let hasil;
  try {
    hasil = JSON.parse(teks);
  } catch {
    return { ok: false, pesan: "Berkas bukan JSON yang valid." };
  }

  if (!daftarValid(hasil)) {
    return {
      ok: false,
      pesan: "Struktur produk tidak valid. Pastikan array produk memiliki field lengkap, tipe benar, dan id unik.",
    };
  }

  memory = hasil.map(normalisasi);
  const tersimpan = simpan();
  return {
    ok: true,
    jumlah: memory.length,
    tersimpan,
    pesan: tersimpan
      ? `${memory.length} produk berhasil diimpor.`
      : `${memory.length} produk diimpor, tetapi localStorage tidak tersedia.`,
  };
}

export function tambahProduk(input) {
  const { errors, value } = validasiProduk(input);
  if (Object.keys(errors).length) return { errors, product: null, tersimpan: false };

  const product = { ...value, id: idBerikutnya() };
  memory = [...memory, product];
  const tersimpan = simpan();
  return { errors: {}, product, tersimpan };
}

export function ubahProduk(id, input) {
  const indeks = memory.findIndex((p) => p.id === id);
  if (indeks < 0) return { errors: {}, product: null, tersimpan: false, ditemukan: false };

  const { errors, value } = validasiProduk(input);
  if (Object.keys(errors).length) return { errors, product: null, tersimpan: false, ditemukan: true };

  const product = { ...value, id };
  memory = memory.map((p, i) => (i === indeks ? product : p));
  const tersimpan = simpan();
  return { errors: {}, product, tersimpan, ditemukan: true };
}

export function hapusProduk(id) {
  memory = memory.filter((p) => p.id !== id);
  return simpan();
}

export function resetProduk() {
  memory = salinSeed();
  const versi = tulis(KEY_VERSION, SCHEMA);
  const data = simpan();
  return versi && data;
}

export function sedangLogin() {
  const nilai = baca(KEY_SESSION);
  if (nilai === DEMO.sesi) return true;
  if (nilai === null) return sessionMemory;
  return false;
}

export function loginDemo() {
  sessionMemory = true;
  return tulis(KEY_SESSION, DEMO.sesi);
}

export function logoutDemo() {
  sessionMemory = false;
  return tulis(KEY_SESSION, "");
}
