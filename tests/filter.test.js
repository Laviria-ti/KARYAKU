import { describe, expect, it } from "vitest";
import { daftarTersaring } from "../src/ui.js";
import { PRODUCTS_SEED } from "../src/products.js";

const filter = (q = "", kategori = "Semua", sort = "unggulan") => ({ q, kategori, sort });
const nama = (daftar) => daftar.map((p) => p.nama);

describe("daftarTersaring — pencarian", () => {
  it("menemukan produk berdasarkan nama tanpa mempedulikan huruf besar/kecil", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("pandan"));
    expect(nama(hasil)).toEqual(["Tas Anyam Pandan"]);
  });

  it("membuang spasi di awal dan akhir kata kunci", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("  ROTAN  "));
    expect(nama(hasil).sort()).toEqual(["Keranjang Rotan Mini", "Tas Anyam Pandan"]);
  });

  it("mencari pada deskripsi, bahan, dan nama pengrajin", () => {
    expect(nama(daftarTersaring(PRODUCTS_SEED, filter("Ardhana")))).toHaveLength(2);
    expect(nama(daftarTersaring(PRODUCTS_SEED, filter("glasir alam")))).toHaveLength(2);
  });

  it("mengembalikan array kosong bila tidak ada yang cocok", () => {
    expect(daftarTersaring(PRODUCTS_SEED, filter("kata-yang-tidak-ada"))).toEqual([]);
  });
});

describe("daftarTersaring — filter dan sorting", () => {
  it("filter kategori keramik menampilkan tepat dua produk", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("", "keramik"));
    expect(hasil).toHaveLength(2);
    expect(hasil.every((p) => p.kategori === "keramik")).toBe(true);
  });

  it("menggabungkan pencarian dan filter kategori", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("rotan", "anyaman"));
    expect(nama(hasil).sort()).toEqual(["Keranjang Rotan Mini", "Tas Anyam Pandan"]);
  });

  it("kombinasi anyaman + rotan + sort harga terendah tetap terurut dan terfilter", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("rotan", "anyaman", "harga-asc"));
    expect(hasil.map((p) => p.harga)).toEqual([95000, 125000]);
    expect(hasil.every((p) => p.kategori === "anyaman")).toBe(true);
  });

  it("sorting unggulan mengutamakan produk unggulan", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter());
    expect(hasil.slice(0, 3).every((p) => p.unggulan)).toBe(true);
    expect(hasil.slice(3).every((p) => !p.unggulan)).toBe(true);
  });

  it("sorting nama Z–A menempatkan Ukiran Kayu Cendana di awal", () => {
    const hasil = daftarTersaring(PRODUCTS_SEED, filter("", "Semua", "nama-desc"));
    expect(hasil[0].nama).toBe("Ukiran Kayu Cendana");
  });
});
