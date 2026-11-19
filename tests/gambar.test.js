import { describe, expect, it } from "vitest";
import { tandaGambarValid } from "../src/ui.js";

const teks = (nilai) => Uint8Array.from(nilai, (c) => c.charCodeAt(0));

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0]);
const webp = new Uint8Array([...teks("RIFF"), 0, 0, 0, 0, ...teks("WEBP")]);

describe("tandaGambarValid — validasi isi berkas (F-04)", () => {
  it("menerima tanda tangan PNG, JPEG, dan WebP yang benar", () => {
    expect(tandaGambarValid("image/png", png)).toBe(true);
    expect(tandaGambarValid("image/jpeg", jpeg)).toBe(true);
    expect(tandaGambarValid("image/webp", webp)).toBe(true);
  });

  it("menolak MIME yang tidak cocok dengan isi berkas", () => {
    expect(tandaGambarValid("image/jpeg", png)).toBe(false);
    expect(tandaGambarValid("image/png", jpeg)).toBe(false);
    expect(tandaGambarValid("image/webp", png)).toBe(false);
  });

  it("menolak berkas teks yang dipalsukan sebagai gambar", () => {
    expect(tandaGambarValid("image/png", teks("ini bukan gambar"))).toBe(false);
    expect(tandaGambarValid("image/jpeg", teks("<html></html>"))).toBe(false);
  });

  it("menolak SVG karena upload SVG tidak lagi diterima", () => {
    expect(tandaGambarValid("image/svg+xml", teks("<svg/>"))).toBe(false);
    expect(tandaGambarValid("image/png", teks("<svg/>"))).toBe(false);
  });

  it("menolak input bukan Uint8Array", () => {
    expect(tandaGambarValid("image/png", null)).toBe(false);
    expect(tandaGambarValid("image/png", [0x89, 0x50])).toBe(false);
  });
});
