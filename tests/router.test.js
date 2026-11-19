import { afterEach, describe, expect, it, vi } from "vitest";
import { ruteSaatIni } from "../src/ui.js";

const pasangHash = (hash) => vi.stubGlobal("location", { hash });

afterEach(() => vi.unstubAllGlobals());

describe("ruteSaatIni — penanganan hash (F-03)", () => {
  it("mendekode id produk yang valid", () => {
    pasangHash("#/produk/prod-001");
    expect(ruteSaatIni()).toEqual({ nama: "detail", id: "prod-001" });
  });

  it("tidak melempar error pada escape Unicode yang malformed", () => {
    pasangHash("#/produk/%E0%A4%A");
    expect(ruteSaatIni()).toEqual({ nama: "detail", id: null });
  });

  it("mengembalikan null untuk escape persen yang tidak lengkap", () => {
    pasangHash("#/produk/%");
    expect(ruteSaatIni()).toEqual({ nama: "detail", id: null });
  });

  it("mengenali rute login, dashboard, dan fallback katalog", () => {
    pasangHash("#/login");
    expect(ruteSaatIni()).toEqual({ nama: "login" });
    pasangHash("#/dashboard");
    expect(ruteSaatIni()).toEqual({ nama: "dashboard" });
    pasangHash("#/katalog");
    expect(ruteSaatIni()).toEqual({ nama: "katalog" });
    pasangHash("");
    expect(ruteSaatIni()).toEqual({ nama: "katalog" });
  });
});
