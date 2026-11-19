import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ambilPemberitahuan,
  ambilProduk,
  eksporJSON,
  hapusProduk,
  imporJSON,
  initStore,
  penyimpananOk,
  tambahProduk,
  resetProduk,
} from "../src/store.js";
import { PRODUCTS_SEED } from "../src/products.js";

function storageBaru() {
  const data = new Map();
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
    clear: () => data.clear(),
    key: (i) => [...data.keys()][i] ?? null,
    get length() {
      return data.size;
    },
  };
}

function produkImpor() {
  return {
    id: "prod-test-1",
    nama: "Produk Impor Uji",
    kategori: "tekstil",
    harga: 99000,
    stok: 3,
    deskripsi: "Deskripsi produk impor yang valid.",
    bahan: "Kapas alam",
    imageUrl: "data:image/svg+xml,%3Csvg%2F%3E",
    namaPengrajin: "Pengrajin Impor",
    unggulan: false,
  };
}

const isi = () => JSON.parse(localStorage.getItem("karyaku:products:v1"));

beforeEach(() => {
  vi.stubGlobal("localStorage", storageBaru());
  ambilPemberitahuan();
  initStore();
});

describe("localStorage — inisialisasi", () => {
  it("menulis delapan produk contoh dan schema version pada kunci yang benar", () => {
    expect(ambilProduk()).toHaveLength(8);
    expect(localStorage.getItem("karyaku_schema_version")).toBe("1");
    expect(isi()).toHaveLength(8);
    expect(isi()[0].nama).toBe(PRODUCTS_SEED[0].nama);
  });

  it("mendeteksi JSON rusak, memberi notifikasi, dan memulihkan seed", () => {
    localStorage.setItem("karyaku:products:v1", "{rusak");
    const produk = initStore();
    expect(produk).toHaveLength(8);
    expect(isi()).toHaveLength(8);
    expect(ambilPemberitahuan()).toContain("Data produk tidak valid atau rusak");
  });

  it("menolak payload JSON yang bukan array produk", () => {
    localStorage.setItem("karyaku:products:v1", JSON.stringify({ nama: "bukan array" }));
    initStore();
    expect(isi()).toHaveLength(8);
    expect(ambilPemberitahuan()).toContain("Data contoh dipulihkan");
  });

  it("menolak array berisi field dengan tipe salah", () => {
    const rusak = [{ ...produkImpor(), harga: "99ribu" }];
    localStorage.setItem("karyaku:products:v1", JSON.stringify(rusak));
    initStore();
    expect(isi()).toHaveLength(8);
    expect(ambilPemberitahuan()).toContain("Data contoh dipulihkan");
  });

  it("mengabaikan payload bila schema version berbeda", () => {
    localStorage.setItem("karyaku_schema_version", "9");
    localStorage.setItem("karyaku:products:v1", JSON.stringify([produkImpor()]));
    initStore();
    expect(isi()).toHaveLength(8);
    expect(localStorage.getItem("karyaku_schema_version")).toBe("1");
    expect(ambilPemberitahuan()).toBe("");
  });
});

describe("localStorage — persistensi dan impor/ekspor", () => {
  it("tambah, hapus, dan reset tersimpan setelah ditulis ulang", () => {
    const tambah = tambahProduk({
      nama: "Produk Baru Uji",
      kategori: "aksesori",
      harga: 10000,
      stok: 2,
      deskripsi: "Deskripsi produk baru untuk uji persistensi.",
      bahan: "Bambu",
      imageUrl: "",
      namaPengrajin: "Pengrajin Uji",
      unggulan: false,
    });
    expect(Object.keys(tambah.errors)).toHaveLength(0);
    expect(isi()).toHaveLength(9);

    expect(hapusProduk(tambah.product.id)).toBe(true);
    expect(isi()).toHaveLength(8);

    expect(resetProduk()).toBe(true);
    expect(isi()).toHaveLength(8);
    expect(isi()[0].nama).toBe(PRODUCTS_SEED[0].nama);
  });

  it("impor JSON valid mengganti data dan tersimpan di localStorage", () => {
    const hasil = imporJSON(JSON.stringify([produkImpor()]));
    expect(hasil.ok).toBe(true);
    expect(hasil.jumlah).toBe(1);
    expect(isi()).toHaveLength(1);
    expect(isi()[0].stok).toBe(3);
  });

  it("impor JSON rusak atau tidak valid ditolak tanpa mengubah data", () => {
    expect(imporJSON("{").ok).toBe(false);
    expect(imporJSON(JSON.stringify([{}])).ok).toBe(false);
    expect(isi()).toHaveLength(8);
  });

  it("ekspor JSON menghasilkan array produk lengkap dengan stok", () => {
    const hasil = JSON.parse(eksporJSON());
    expect(hasil).toHaveLength(8);
    expect(hasil.every((p) => Number.isInteger(p.stok))).toBe(true);
  });

  it("tetap memakai data memori bila localStorage tidak tersedia", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("diblokir");
      },
      setItem() {
        throw new Error("diblokir");
      },
    });
    expect(initStore()).toHaveLength(8);
    expect(penyimpananOk()).toBe(false);
  });
});
