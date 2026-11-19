import { CERITA_USAHA, DEMO, KATEGORI, PLACEHOLDER_IMAGE } from "./products.js";
import {
  ambilProduk,
  hapusProduk,
  loginDemo,
  logoutDemo,
  penyimpananOk,
  resetProduk,
  sedangLogin,
  tambahProduk,
  ubahProduk,
  validasiProduk,
} from "./store.js";

let root = null;

const filterState = {
  q: "",
  kategori: "Semua",
  sort: "unggulan",
};

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  Object.entries(props).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else if (key === "for") node.htmlFor = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (value === true) {
      node.setAttribute(key, "");
    } else {
      node.setAttribute(key, String(value));
    }
  });

  tambahAnak(node, children);
  return node;
}

function tambahAnak(node, children) {
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) {
      tambahAnak(node, child);
      return;
    }
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
}

function rupiah(nilai) {
  return `Rp${new Intl.NumberFormat("id-ID").format(nilai)}`;
}

function navLink(label, href, aktif) {
  return el("a", {
    class: `nav-link${aktif === label ? " aktif" : ""}`,
    href,
    "aria-current": aktif === label ? "page" : null,
    text: label,
  });
}

function layout({ aktif = "", badge = "", children = [] }) {
  const navbar = el("header", { class: "navbar" }, [
    el("a", { class: "logo", href: "#/katalog" }, [
      el("span", { class: "logo-mark", "aria-hidden": "true" }),
      el("span", { text: "KARYAKU" }),
    ]),
    el("nav", { class: "nav-links", "aria-label": "Navigasi utama" }, [
      navLink("Beranda", "#/katalog", aktif),
      navLink("Katalog", "#/katalog", aktif),
      navLink("Tentang", "#/katalog", aktif),
      aktif === "dashboard"
        ? el("span", { class: "badge demo-badge", text: "MODE DEMO" })
        : navLink("Login Pengrajin", "#/login", aktif),
    ]),
  ]);

  const isi = [...children];
  if (!penyimpananOk()) {
    isi.unshift(
      el("div", {
        class: "alert alert-warning",
        role: "status",
        text: "Penyimpanan browser tidak tersedia. Perubahan hanya berlaku selama sesi ini.",
      }),
    );
  }
  if (badge) {
    isi.unshift(el("div", { class: "alert alert-demo", text: badge }));
  }

  const main = el("main", { id: "konten", class: "konten" }, isi);
  const footer = el("footer", { class: "footer" }, [
    el("span", { text: "KARYAKU · Katalog digital kerajinan lokal" }),
    el("span", { class: "muted", text: "Mode demo — bukan marketplace" }),
  ]);

  root.replaceChildren(navbar, main, footer);
  return main;
}

function badge(teks, varian = "") {
  return el("span", { class: `badge ${varian}`.trim(), text: teks });
}

function kartuProduk(produk) {
  return el(
    "a",
    {
      class: "card",
      href: `#/produk/${encodeURIComponent(produk.id)}`,
      "aria-label": `Lihat detail ${produk.nama}`,
    },
    [
      el("img", {
        src: produk.imageUrl,
        alt: `Ilustrasi ${produk.nama}`,
        loading: "lazy",
      }),
      el("div", { class: "card-body" }, [
        el("div", { class: "card-badges" }, [
          badge(produk.kategori, "badge-kategori"),
          produk.unggulan ? badge("Unggulan", "badge-unggulan") : null,
        ]),
        el("h3", { class: "card-title", text: produk.nama }),
        el("p", { class: "price", text: rupiah(produk.harga) }),
        el("p", { class: "muted small", text: produk.namaPengrajin }),
      ]),
    ],
  );
}

function daftarTersaring(daftar, filter) {
  const kata = filter.q.trim().toLowerCase();

  const hasil = daftar.filter((p) => {
    if (filter.kategori !== "Semua" && p.kategori !== filter.kategori) return false;
    if (!kata) return true;
    return [p.nama, p.deskripsi, p.bahan, p.kategori, p.namaPengrajin]
      .map((nilai) => String(nilai).toLowerCase())
      .some((nilai) => nilai.includes(kata));
  });

  const bandingNama = (a, b) =>
    a.nama.localeCompare(b.nama, "id") || a.id.localeCompare(b.id);

  switch (filter.sort) {
    case "nama-asc":
      return hasil.sort(bandingNama);
    case "nama-desc":
      return hasil.sort((a, b) => -bandingNama(a, b));
    case "harga-asc":
      return hasil.sort((a, b) => a.harga - b.harga || bandingNama(a, b));
    case "harga-desc":
      return hasil.sort((a, b) => b.harga - a.harga || bandingNama(a, b));
    case "kategori-asc":
      return hasil.sort(
        (a, b) => a.kategori.localeCompare(b.kategori, "id") || bandingNama(a, b),
      );
    default:
      return hasil.sort(
        (a, b) => Number(b.unggulan) - Number(a.unggulan) || bandingNama(a, b),
      );
  }
}

function renderKatalog() {
  const produk = ambilProduk();

  const cari = el("input", {
    id: "cari-produk",
    type: "search",
    placeholder: "Cari produk, bahan, atau pengrajin…",
    value: filterState.q,
    oninput: (event) => {
      filterState.q = event.target.value;
      perbarui();
    },
  });

  const chip = (kategori) =>
    el("button", {
      type: "button",
      class: `chip${filterState.kategori === kategori ? " aktif" : ""}`,
      dataset: { kategori },
      text: kategori,
      onclick: () => {
        filterState.kategori = kategori;
        perbarui();
      },
    });

  const chips = ["Semua", ...KATEGORI].map(chip);
  chips.forEach((item) => {
    item.addEventListener("click", () => {
      chips.forEach((lain) => lain.classList.toggle("aktif", lain === item));
    });
  });

  const urutkan = el(
    "select",
    {
      id: "urutkan",
      "aria-label": "Urutkan produk",
      onchange: (event) => {
        filterState.sort = event.target.value;
        perbarui();
      },
    },
    [
      el("option", { value: "unggulan", text: "Unggulan", selected: filterState.sort === "unggulan" }),
      el("option", { value: "nama-asc", text: "Nama A–Z", selected: filterState.sort === "nama-asc" }),
      el("option", { value: "nama-desc", text: "Nama Z–A", selected: filterState.sort === "nama-desc" }),
      el("option", { value: "harga-asc", text: "Harga Terendah", selected: filterState.sort === "harga-asc" }),
      el("option", { value: "harga-desc", text: "Harga Tertinggi", selected: filterState.sort === "harga-desc" }),
      el("option", { value: "kategori-asc", text: "Kategori A–Z", selected: filterState.sort === "kategori-asc" }),
    ],
  );

  const ringkasan = el("p", {
    class: "ringkasan",
    "aria-live": "polite",
  });
  const grid = el("div", { class: "grid-produk" });

  function perbarui() {
    const hasil = daftarTersaring(ambilProduk(), filterState);
    ringkasan.textContent = `${hasil.length} produk · ${KATEGORI.length} kategori`;

    if (!hasil.length) {
      grid.replaceChildren(
        el("div", { class: "empty-state" }, [
          el("p", { text: "Produk tidak ditemukan. Coba kata kunci atau kategori lain." }),
          el("button", {
            type: "button",
            class: "btn btn-secondary",
            text: "Reset Filter",
            onclick: reset,
          }),
        ]),
      );
      return;
    }
    grid.replaceChildren(...hasil.map(kartuProduk));
  }

  function reset() {
    filterState.q = "";
    filterState.kategori = "Semua";
    filterState.sort = "unggulan";
    cari.value = "";
    urutkan.value = "unggulan";
    chips.forEach((item, index) => item.classList.toggle("aktif", index === 0));
    perbarui();
  }

  const hero = el("section", { class: "hero" }, [
    el("div", { class: "hero-copy" }, [
      el("p", { class: "eyebrow", text: "KARYAKU" }),
      el("h1", { text: "Jelajahi keindahan kerajinan lokal Bali." }),
      el("p", {
        class: "hero-desc",
        text: "Temukan karya UMKM, kenali pengrajinnya, dan hubungi mereka langsung lewat katalog ini.",
      }),
      el("button", {
        type: "button",
        class: "btn btn-primary",
        text: "Jelajahi Katalog",
        onclick: () => cari.focus(),
      }),
    ]),
    el("div", { class: "hero-art", "aria-hidden": "true" }, [
      el("span", { text: "Anyam · Keramik · Ukiran" }),
    ]),
  ]);

  const toolbar = el("section", { class: "toolbar", "aria-label": "Pencarian dan filter" }, [
    el("div", { class: "field cari-field" }, [
      el("label", { for: "cari-produk", text: "Cari produk" }),
      cari,
    ]),
    el("div", { class: "field" }, [
      el("span", { class: "label", text: "Kategori" }),
      el("div", { class: "chips" }, chips),
    ]),
    el("div", { class: "field" }, [
      el("label", { for: "urutkan", text: "Urutkan" }),
      urutkan,
    ]),
    el("button", {
      type: "button",
      class: "btn btn-ghost reset-btn",
      text: "Reset Filter",
      onclick: reset,
    }),
  ]);

  layout({ aktif: "katalog", children: [hero, toolbar, ringkasan, grid] });
  perbarui();
}

function tautanWhatsapp(produk) {
  const pesan = `Halo KARYAKU, saya tertarik dengan produk ${produk.nama}. Bisa beri informasi lebih lanjut?`;
  return el("a", {
    class: "btn btn-primary",
    href: `https://wa.me/${DEMO.whatsapp}?text=${encodeURIComponent(pesan)}`,
    target: "_blank",
    rel: "noopener noreferrer",
    text: "Hubungi via WhatsApp (Demo) (tab baru)",
  });
}

function renderDetail(id) {
  const produk = ambilProduk().find((p) => p.id === id);

  if (!produk) {
    layout({
      aktif: "katalog",
      children: [
        el("section", { class: "empty-state" }, [
          el("h1", { text: "Produk tidak ditemukan" }),
          el("p", { text: "Produk yang Anda cari tidak tersedia di katalog." }),
          el("a", { class: "btn btn-secondary", href: "#/katalog", text: "Kembali ke Katalog" }),
        ]),
      ],
    });
    return;
  }

  const breadcrumb = el("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" }, [
    el("a", { href: "#/katalog", text: "Beranda" }),
    el("span", { text: "›", "aria-hidden": "true" }),
    el("a", { href: "#/katalog", text: "Katalog" }),
    el("span", { text: "›", "aria-hidden": "true" }),
    el("span", { text: produk.nama, "aria-current": "page" }),
  ]);

  const info = el("div", { class: "detail-info" }, [
    el("div", { class: "card-badges" }, [
      badge(produk.kategori, "badge-kategori"),
      produk.unggulan ? badge("Unggulan", "badge-unggulan") : null,
    ]),
    el("h1", { text: produk.nama }),
    el("p", { class: "price price-besar", text: rupiah(produk.harga) }),
    el("p", { text: produk.deskripsi }),
    el("p", { class: "muted", text: `Bahan: ${produk.bahan}` }),
    el("p", { class: "muted", text: `Pengrajin: ${produk.namaPengrajin}` }),
    tautanWhatsapp(produk),
    el("p", { class: "muted small", text: DEMO.whatsappTampil }),
    el("a", { class: "btn btn-ghost", href: "#/katalog", text: "Kembali ke Katalog" }),
  ]);

  const profil = el("section", { class: "artisan-card" }, [
    el("h2", { text: "Profil Pengrajin" }),
    el("div", { class: "artisan-head" }, [
      el("span", { class: "artisan-mark", "aria-hidden": "true" }),
      el("div", {}, [
        el("h3", { text: produk.namaPengrajin }),
        el("p", { class: "muted small", text: "Bali" }),
      ]),
    ]),
    el("p", { text: CERITA_USAHA }),
    tautanWhatsapp(produk),
  ]);

  layout({
    aktif: "katalog",
    children: [
      breadcrumb,
      el("section", { class: "detail" }, [
        el("img", {
          class: "detail-foto",
          src: produk.imageUrl,
          alt: `Ilustrasi ${produk.nama}`,
        }),
        info,
      ]),
      profil,
    ],
  });
}

function renderLogin() {
  const pesan = el("p", { class: "alert error", role: "alert", hidden: true });

  const form = el("form", { class: "form-panel login-form" }, [
    el("div", { class: "demo-banner" }, [
      el("strong", { text: "AKUN DEMO" }),
      el("span", { text: "Simulasi lokal, bukan autentikasi sungguhan." }),
      el("span", { class: "muted small", text: `${DEMO.username} / ${DEMO.password}` }),
    ]),
    el("h1", { text: "Login Pengrajin" }),
    pesan,
    el("div", { class: "field" }, [
      el("label", { for: "login-user", text: "Username" }),
      el("input", { id: "login-user", type: "text", autocomplete: "username", required: true }),
    ]),
    el("div", { class: "field" }, [
      el("label", { for: "login-pass", text: "Password" }),
      el("input", { id: "login-pass", type: "password", autocomplete: "current-password", required: true }),
    ]),
    el("button", { type: "submit", class: "btn btn-primary", text: "Masuk ke Dashboard (Demo)" }),
    el("a", { class: "btn btn-ghost", href: "#/katalog", text: "Kembali ke Katalog" }),
  ]);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = form.querySelector("#login-user").value.trim();
    const pass = form.querySelector("#login-pass").value;

    if (user !== DEMO.username || pass !== DEMO.password) {
      pesan.textContent = "Kredensial demo salah. Gunakan akun yang tertera di form.";
      pesan.hidden = false;
      return;
    }

    loginDemo();
    location.hash = "#/dashboard";
  });

  layout({ aktif: "login", children: [form] });
}

function konfirmasi(judul, teks, padaSetuju) {
  const dialog = el("dialog", { class: "dialog" }, [
    el("h2", { text: judul }),
    el("p", { text: teks }),
    el("div", { class: "dialog-actions" }, [
      el("button", {
        type: "button",
        class: "btn btn-secondary",
        text: "Batal",
        onclick: () => dialog.close(),
      }),
      el("button", {
        type: "button",
        class: "btn btn-danger",
        text: "Ya, lanjutkan",
        onclick: () => {
          padaSetuju();
          dialog.close();
        },
      }),
    ]),
  ]);

  dialog.addEventListener("close", () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
}

function renderDashboard() {
  if (!sedangLogin()) {
    history.replaceState(null, "", "#/katalog");
    renderKatalog();
    return;
  }

  const statProduk = el("strong", { class: "stat-angka" });
  const statUnggulan = el("strong", { class: "stat-angka" });
  const statKategori = el("strong", { class: "stat-angka" });
  const daftar = el("div", { class: "daftar-produk" });

  function perbaruiData() {
    const produk = ambilProduk();
    statProduk.textContent = String(produk.length);
    statUnggulan.textContent = String(produk.filter((p) => p.unggulan).length);

    const hitung = new Map();
    produk.forEach((p) => hitung.set(p.kategori, (hitung.get(p.kategori) || 0) + 1));
    const terbanyak = [...hitung.entries()].sort((a, b) => b[1] - a[1])[0];
    statKategori.textContent = terbanyak ? terbanyak[0] : "—";

    daftar.replaceChildren(
      ...produk.map((p) =>
        el("div", { class: "product-row" }, [
          el("img", { src: p.imageUrl, alt: "", class: "thumb" }),
          el("div", {}, [
            el("strong", { text: p.nama }),
            el("div", { class: "muted small", text: `${p.kategori} · ${rupiah(p.harga)}` }),
          ]),
          el("span", { class: "muted small", text: p.namaPengrajin }),
          el("span", { class: "row-actions" }, [
            el("button", {
              type: "button",
              class: "btn btn-secondary btn-kecil",
              text: "Edit",
              onclick: () => bukaForm(p),
            }),
            el("button", {
              type: "button",
              class: "btn btn-danger btn-kecil",
              text: "Hapus",
              onclick: () =>
                konfirmasi("Hapus produk", `Hapus ${p.nama} dari katalog?`, () => {
                  hapusProduk(p.id);
                  perbaruiData();
                }),
            }),
          ]),
        ]),
      ),
    );
  }

  const panelError = el("p", { class: "alert error", role: "alert", hidden: true });
  const panelSukses = el("p", { class: "alert success", role: "status", hidden: true });
  const fileError = el("p", { class: "muted small error-teks", hidden: true });
  const preview = el("img", { class: "preview", src: PLACEHOLDER_IMAGE, alt: "Pratinjau foto produk" });

  let draftImage = PLACEHOLDER_IMAGE;
  let editingId = null;

  const field = (id, label, node) =>
    el("div", { class: "field" }, [el("label", { for: id, text: label }), node]);

  const nama = el("input", { id: "form-nama", type: "text", maxlength: "80", required: true });
  const kategori = el(
    "select",
    { id: "form-kategori", required: true },
    ["", ...KATEGORI].map((k, i) =>
      el("option", { value: k, text: i === 0 ? "Pilih kategori" : k }),
    ),
  );
  const harga = el("input", { id: "form-harga", type: "number", min: "0", step: "1", required: true });
  const deskripsi = el("textarea", { id: "form-deskripsi", rows: "3", maxlength: "500", required: true });
  const bahan = el("input", { id: "form-bahan", type: "text", maxlength: "120", required: true });
  const pengrajin = el("input", { id: "form-pengrajin", type: "text", maxlength: "80", required: true, value: "Pengrajin Anyam Lestari" });
  const unggulan = el("input", { id: "form-unggulan", type: "checkbox" });
  const file = el("input", { id: "form-file", type: "file", accept: "image/png,image/jpeg,image/webp,image/svg+xml" });

  file.addEventListener("change", () => {
    const berkas = file.files && file.files[0];
    if (!berkas) return;
    const tipeDiterima = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!tipeDiterima.includes(berkas.type) || berkas.size > 2 * 1024 * 1024) {
      fileError.textContent = "Gunakan PNG/JPEG/WebP/SVG dengan ukuran maksimal 2 MB.";
      fileError.hidden = false;
      file.value = "";
      return;
    }
    const pembaca = new FileReader();
    pembaca.onload = () => {
      draftImage = String(pembaca.result);
      preview.src = draftImage;
      fileError.hidden = true;
    };
    pembaca.onerror = () => {
      fileError.textContent = "Gagal membaca berkas. Coba file lain.";
      fileError.hidden = false;
    };
    pembaca.readAsDataURL(berkas);
  });

  function kosongkanForm() {
    editingId = null;
    nama.value = "";
    kategori.value = "";
    harga.value = "";
    deskripsi.value = "";
    bahan.value = "";
    pengrajin.value = "Pengrajin Anyam Lestari";
    unggulan.checked = false;
    file.value = "";
    draftImage = PLACEHOLDER_IMAGE;
    preview.src = draftImage;
    panelError.hidden = true;
    panelSukses.hidden = true;
    fileError.hidden = true;
  }

  function bukaForm(produk = null) {
    kosongkanForm();
    if (!produk) {
      panel.hidden = false;
      panel.scrollIntoView();
      nama.focus();
      return;
    }

    editingId = produk.id;
    nama.value = produk.nama;
    kategori.value = produk.kategori;
    harga.value = String(produk.harga);
    deskripsi.value = produk.deskripsi;
    bahan.value = produk.bahan;
    pengrajin.value = produk.namaPengrajin;
    unggulan.checked = produk.unggulan;
    draftImage = produk.imageUrl;
    preview.src = draftImage;
    panel.hidden = false;
    panel.scrollIntoView();
    nama.focus();
  }

  const form = el("form", { class: "form-panel" }, [
    el("h2", { text: "Form Produk" }),
    panelError,
    panelSukses,
    field("form-nama", "Nama produk", nama),
    field("form-kategori", "Kategori", kategori),
    field("form-harga", "Harga (Rp)", harga),
    field("form-deskripsi", "Deskripsi", deskripsi),
    field("form-bahan", "Bahan", bahan),
    field("form-pengrajin", "Nama pengrajin", pengrajin),
    el("div", { class: "field" }, [
      el("label", { for: "form-file", text: "Foto produk (lokal, maksimal 2 MB)" }),
      file,
      fileError,
      preview,
    ]),
    el("label", { class: "check" }, [unggulan, el("span", { text: "Tandai sebagai unggulan" })]),
    el("div", { class: "dialog-actions" }, [
      el("button", { type: "submit", class: "btn btn-primary", text: "Simpan Produk" }),
      el("button", {
        type: "button",
        class: "btn btn-secondary",
        text: "Batal",
        onclick: () => {
          kosongkanForm();
          panel.hidden = true;
        },
      }),
    ]),
  ]);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = {
      nama: nama.value,
      kategori: kategori.value,
      harga: harga.value,
      deskripsi: deskripsi.value,
      bahan: bahan.value,
      imageUrl: draftImage,
      namaPengrajin: pengrajin.value,
      unggulan: unggulan.checked,
    };
    const { errors } = validasiProduk(input);
    if (Object.keys(errors).length) {
      panelError.textContent = Object.values(errors)[0];
      panelError.hidden = false;
      panelSukses.hidden = true;
      return;
    }

    const hasil = editingId
      ? ubahProduk(editingId, input)
      : tambahProduk(input);

    if (Object.keys(hasil.errors).length) {
      panelError.textContent = Object.values(hasil.errors)[0];
      panelError.hidden = false;
      return;
    }

    perbaruiData();
    if (!hasil.tersimpan) {
      panelError.textContent = "Perubahan berlaku untuk sesi ini, tetapi localStorage tidak tersedia.";
      panelError.hidden = false;
      return;
    }

    panelError.hidden = true;
    panelSukses.textContent = editingId ? "Produk diperbarui." : "Produk ditambahkan.";
    panelSukses.hidden = false;
    kosongkanForm();
    panel.hidden = true;
  });

  const panel = el("section", { class: "form-panel-wrap", hidden: true }, [form]);

  const profil = el("section", { class: "artisan-card" }, [
    el("h2", { text: "Profil Pengrajin (Demo)" }),
    el("p", { class: "muted small", text: "Field berikut hanya generik sampai key profil disetujui." }),
    field("prof-nama", "Nama pengrajin", el("input", { id: "prof-nama", type: "text", value: "Pengrajin Anyam Lestari", disabled: true })),
    field("prof-wilayah", "Wilayah umum", el("input", { id: "prof-wilayah", type: "text", value: "Bali", disabled: true })),
    field("prof-cerita", "Cerita usaha", el("textarea", { id: "prof-cerita", rows: "2", disabled: true, text: CERITA_USAHA })),
    field("prof-wa", "Nomor WhatsApp demo", el("input", { id: "prof-wa", type: "text", value: DEMO.whatsappTampil, disabled: true })),
  ]);

  layout({
    aktif: "dashboard",
    children: [
      el("section", { class: "dashboard-head" }, [
        el("div", {}, [
          el("h1", { text: "Dashboard Pengrajin" }),
          el("p", { class: "muted", text: "Simulasi lokal — perubahan hanya tersimpan di browser ini." }),
        ]),
        el("div", { class: "dialog-actions" }, [
          el("button", {
            type: "button",
            class: "btn btn-primary",
            text: "+ Tambah Produk",
            onclick: () => bukaForm(),
          }),
          el("button", {
            type: "button",
            class: "btn btn-secondary",
            text: "Reset Data Demo",
            onclick: () =>
              konfirmasi("Reset Data Demo", "Kembalikan katalog ke 8 produk contoh?", () => {
                resetProduk();
                perbaruiData();
              }),
          }),
          el("button", {
            type: "button",
            class: "btn btn-ghost",
            text: "Keluar (Demo)",
            onclick: () => {
              logoutDemo();
              location.hash = "#/katalog";
            },
          }),
        ]),
      ]),
      el("section", { class: "stats" }, [
        el("div", { class: "stat" }, [statProduk, el("span", { text: "Produk" })]),
        el("div", { class: "stat" }, [statUnggulan, el("span", { text: "Unggulan" })]),
        el("div", { class: "stat" }, [statKategori, el("span", { text: "Kategori terbanyak" })]),
      ]),
      panel,
      daftar,
      profil,
    ],
  });

  perbaruiData();
}

function ruteSaatIni() {
  const bagian = location.hash.replace(/^#\/?/, "");
  if (bagian.startsWith("produk/")) {
    return { nama: "detail", id: decodeURIComponent(bagian.slice("produk/".length)) };
  }
  if (bagian === "login") return { nama: "login" };
  if (bagian === "dashboard") return { nama: "dashboard" };
  return { nama: "katalog" };
}

function render() {
  const rute = ruteSaatIni();
  if (rute.nama === "detail") return renderDetail(rute.id);
  if (rute.nama === "login") return renderLogin();
  if (rute.nama === "dashboard") return renderDashboard();
  return renderKatalog();
}

export function initUI() {
  root = document.getElementById("app");
  if (!location.hash) {
    history.replaceState(null, "", "#/katalog");
  }
  window.addEventListener("hashchange", render);
  render();
}
