import { describe, expect, it } from "vitest";
import { DEMO } from "../src/products.js";
import { nomorWaValid, urlWhatsapp } from "../src/ui.js";

const produk = { nama: "Tas Anyam Pandan" };

describe("nomorWaValid", () => {
  it("menerima nomor WhatsApp demo yang valid", () => {
    expect(nomorWaValid(DEMO.whatsapp)).toBe(true);
    expect(nomorWaValid("6281234567890")).toBe(true);
  });

  it("menolak nomor dengan awalan 0, huruf, tanda +, atau panjang di luar batas", () => {
    expect(nomorWaValid("0812000000000")).toBe(false);
    expect(nomorWaValid("62812abc")).toBe(false);
    expect(nomorWaValid("+6281200000000")).toBe(false);
    expect(nomorWaValid("12345")).toBe(false);
    expect(nomorWaValid("6281200000000000000")).toBe(false);
    expect(nomorWaValid(null)).toBe(false);
  });
});

describe("urlWhatsapp", () => {
  it("memakai nomor demo dan menyisipkan nama produk ke pesan terencode", () => {
    const url = urlWhatsapp(produk);
    expect(url.startsWith(`https://wa.me/${DEMO.whatsapp}?text=`)).toBe(true);
    expect(url).not.toContain(" ");
    expect(url).toContain("%20");

    const pesan = new URL(url).searchParams.get("text");
    expect(pesan).toContain("Tas Anyam Pandan");
    expect(pesan).toContain("Halo KARYAKU");
  });

  it("memakai nomor kustom yang valid", () => {
    expect(urlWhatsapp(produk, "6281234567890")).toContain("wa.me/6281234567890?text=");
  });

  it("mengembalikan string kosong untuk nomor tidak valid", () => {
    expect(urlWhatsapp(produk, "0812000000000")).toBe("");
    expect(urlWhatsapp(produk, "bukan-nomor")).toBe("");
  });
});
