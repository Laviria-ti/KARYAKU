import { describe, expect, it } from "vitest";
import { KATEGORI } from "../src/products.js";
import { validasiProduk } from "../src/store.js";

function inputValid() {
  return {
    nama: "Tas Anyam Uji",
    kategori: "anyaman",
    harga: 125000,
    stok: 5,
    deskripsi: "Deskripsi produk uji yang cukup panjang.",
    bahan: "Pandan, rotan",
    imageUrl: "data:image/svg+xml,%3Csvg%2F%3E",
    namaPengrajin: "Pengrajin Uji",
    unggulan: false,
  };
}

describe("validasiProduk — nama", () => {
  it("menerima produk valid dan memangkas spasi nama", () => {
    const hasil = validasiProduk({ ...inputValid(), nama: "  Tas Anyam Uji  " });
    expect(hasil.errors).toEqual({});
    expect(hasil.value.nama).toBe("Tas Anyam Uji");
  });

  it("menolak nama kosong atau hanya spasi", () => {
    expect(validasiProduk({ ...inputValid(), nama: "" }).errors.nama).toBeDefined();
    expect(validasiProduk({ ...inputValid(), nama: "   " }).errors.nama).toBe(
      "Nama produk wajib diisi.",
    );
  });

  it("membatasi nama sampai 80 karakter", () => {
    expect(validasiProduk({ ...inputValid(), nama: "a".repeat(80) }).errors.nama).toBeUndefined();
    expect(validasiProduk({ ...inputValid(), nama: "a".repeat(81) }).errors.nama).toBeDefined();
  });
});

describe("validasiProduk — kategori", () => {
  it("menerima kelima kategori yang tersedia", () => {
    for (const kategori of KATEGORI) {
      expect(validasiProduk({ ...inputValid(), kategori }).errors.kategori).toBeUndefined();
    }
  });

  it("menolak kategori di luar daftar", () => {
    expect(validasiProduk({ ...inputValid(), kategori: "semua" }).errors.kategori).toBe(
      "Pilih salah satu kategori yang tersedia.",
    );
  });
});

describe("validasiProduk — batas harga dan stok", () => {
  it("menerima harga 0 sebagai batas bawah", () => {
    expect(validasiProduk({ ...inputValid(), harga: 0 }).errors.harga).toBeUndefined();
  });

  it("menolak harga negatif, desimal, dan bukan angka", () => {
    expect(validasiProduk({ ...inputValid(), harga: -1 }).errors.harga).toBeDefined();
    expect(validasiProduk({ ...inputValid(), harga: 1.5 }).errors.harga).toBeDefined();
    expect(validasiProduk({ ...inputValid(), harga: "abc" }).errors.harga).toBeDefined();
    expect(validasiProduk({ ...inputValid(), harga: "" }).errors.harga).toBeDefined();
  });

  it("menerima stok 0 sebagai batas bawah", () => {
    expect(validasiProduk({ ...inputValid(), stok: 0 }).errors.stok).toBeUndefined();
  });

  it("menolak stok negatif, desimal, dan kosong", () => {
    expect(validasiProduk({ ...inputValid(), stok: -1 }).errors.stok).toBeDefined();
    expect(validasiProduk({ ...inputValid(), stok: 2.5 }).errors.stok).toBeDefined();
    expect(validasiProduk({ ...inputValid(), stok: "" }).errors.stok).toBeDefined();
  });
});

describe("validasiProduk — field pendukung", () => {
  it("menolak URL gambar eksternal", () => {
    expect(
      validasiProduk({ ...inputValid(), imageUrl: "https://example.com/foto.png" }).errors.imageUrl,
    ).toBe("Foto harus gambar lokal yang valid (PNG, JPEG, WebP, atau SVG aman).");
  });

  it("memakai placeholder bila imageUrl kosong", () => {
    const hasil = validasiProduk({ ...inputValid(), imageUrl: "" });
    expect(hasil.errors.imageUrl).toBeUndefined();
    expect(hasil.value.imageUrl).toContain("data:image/svg+xml");
  });
});

describe("validasiProduk — skema URL gambar (F-01, F-02)", () => {
  const ditolak = (imageUrl) => validasiProduk({ ...inputValid(), imageUrl }).errors.imageUrl;

  it("menolak URL relatif protokol dan http(s)", () => {
    expect(ditolak("//evil.example/track.png")).toBeDefined();
    expect(ditolak("https://evil.example/track.png")).toBeDefined();
    expect(ditolak("HtTp://evil.example/track.png")).toBeDefined();
  });

  it("menolak skema javascript, data:text/html, dan vbscript", () => {
    expect(ditolak("javascript:alert(1)")).toBeDefined();
    expect(ditolak("data:text/html,<script>alert(1)</script>")).toBeDefined();
    expect(ditolak("vbscript:msgbox(1)")).toBeDefined();
  });

  it("menolak SVG data URL yang memuat skrip atau event handler", () => {
    expect(ditolak("data:image/svg+xml,%3Csvg%20onload%3D%22alert(1)%22%2F%3E")).toBeDefined();
    expect(
      ditolak(`data:image/svg+xml;base64,${btoa("<svg onload='alert(1)'/>")}`),
    ).toBeDefined();
    expect(
      ditolak(
        `data:image/svg+xml,${encodeURIComponent("<svg><script>alert(1)</script></svg>")}`,
      ),
    ).toBeDefined();
  });

  it("menerima raster lokal, path lokal, dan SVG bawaan yang aman", () => {
    expect(ditolak("data:image/png;base64,iVBORw0KGgo=")).toBeUndefined();
    expect(ditolak("data:image/webp;base64,UklGRiQAAABXRUJQVlA4")).toBeUndefined();
    expect(ditolak("/gambar/lokal.svg")).toBeUndefined();
    expect(ditolak(inputValid().imageUrl)).toBeUndefined();
  });
});
