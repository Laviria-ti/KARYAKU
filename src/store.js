import { DEMO, KATEGORI, PLACEHOLDER_IMAGE, PRODUCTS_SEED } from "./products.js";

const KEY_VERSION = "karyaku_schema_version";
const KEY_PRODUCTS = "karyaku_products_v1";
const KEY_SESSION = "karyaku_session_v1";
const SCHEMA = "1";

let memory = salinSeed();
let sessionMemory = false;
let storageOk = true;

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

export function validasiProduk(input) {
  const errors = {};
  const value = {
    nama: String(input.nama ?? "").trim(),
    kategori: String(input.kategori ?? ""),
    harga: Number(input.harga),
    deskripsi: String(input.deskripsi ?? "").trim(),
    bahan: String(input.bahan ?? "").trim(),
    imageUrl: String(input.imageUrl ?? "").trim() || PLACEHOLDER_IMAGE,
    namaPengrajin: String(input.namaPengrajin ?? "").trim(),
    unggulan: Boolean(input.unggulan),
  };

  if (value.nama.length < 3 || value.nama.length > 80) {
    errors.nama = "Nama harus 3–80 karakter.";
  }
  if (!KATEGORI.includes(value.kategori)) {
    errors.kategori = "Pilih salah satu kategori yang tersedia.";
  }
  if (!Number.isInteger(value.harga) || value.harga < 0) {
    errors.harga = "Harga harus bilangan bulat minimal 0.";
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
  if (!p || typeof p !== "object") return false;
  if (typeof p.id !== "string" || !p.id) return false;
  if (typeof p.nama !== "string" || p.nama.length < 3 || p.nama.length > 80) return false;
  if (!KATEGORI.includes(p.kategori)) return false;
  if (!Number.isInteger(p.harga) || p.harga < 0) return false;
  if (typeof p.deskripsi !== "string" || p.deskripsi.length < 10) return false;
  if (typeof p.bahan !== "string" || p.bahan.length < 3) return false;
  if (typeof p.imageUrl !== "string" || !bukanUrlEksternal(p.imageUrl)) return false;
  if (typeof p.namaPengrajin !== "string" || p.namaPengrajin.length < 3) return false;
  return typeof p.unggulan === "boolean";
}

function muat() {
  const versi = baca(KEY_VERSION);
  const mentah = baca(KEY_PRODUCTS);
  let daftar = null;

  if (versi === SCHEMA && mentah) {
    try {
      const hasil = JSON.parse(mentah);
      if (Array.isArray(hasil) && hasil.every(produkValid)) {
        daftar = hasil;
      }
    } catch {
      daftar = null;
    }
  }

  if (!daftar) {
    daftar = salinSeed();
    tulis(KEY_VERSION, SCHEMA);
    tulis(KEY_PRODUCTS, JSON.stringify(daftar));
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
