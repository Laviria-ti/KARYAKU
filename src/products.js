export const KATEGORI = ["anyaman", "keramik", "ukiran", "tekstil", "aksesori"];

export const DEMO = {
  username: "pengrajin",
  password: "karyaku-demo",
  sesi: "demo-pengrajin",
  whatsapp: "6281200000000",
  whatsappTampil: "0812-0000-0000 — nomor demo, bukan nomor nyata",
};

export const CERITA_USAHA =
  "Pengrajin ini mengembangkan kerajinan secara keluarga dan mempertahankan motif lokal dengan bahan yang tersedia di sekitar wilayahnya. Karya dibuat dalam jumlah kecil agar setiap bagian tetap mendapat perhatian.";

function ilustrasi(latar, motif, label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" role="img" aria-label="${label}">
  <rect width="640" height="480" fill="${latar}"/>
  <circle cx="320" cy="210" r="132" fill="${motif}" opacity="0.22"/>
  <path d="M188 210h264M214 158h212M214 262h212" stroke="${motif}" stroke-width="14" stroke-linecap="round" opacity="0.75"/>
  <path d="M250 118l140 184M390 118L250 302" stroke="${motif}" stroke-width="8" opacity="0.45"/>
  <rect x="150" y="78" width="340" height="278" rx="28" fill="none" stroke="${motif}" stroke-width="6" opacity="0.55"/>
  <text x="320" y="416" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="700" fill="#39352F">${label}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const PLACEHOLDER_IMAGE = ilustrasi("#F6F0E7", "#C58B68", "Kerajinan KARYAKU");

export const PRODUCTS_SEED = [
  {
    id: "prod-001",
    nama: "Tas Anyam Pandan",
    kategori: "anyaman",
    harga: 125000,
    stok: 12,
    deskripsi: "Tas anyam ringan untuk kebutuhan harian, ditenun dengan motif lokal.",
    bahan: "Pandan, rotan",
    imageUrl: ilustrasi("#E9DCC8", "#8A5638", "Anyaman"),
    namaPengrajin: "Pengrajin Anyam Lestari",
    unggulan: true,
  },
  {
    id: "prod-002",
    nama: "Mangkuk Keramik Sengkar",
    kategori: "keramik",
    harga: 89000,
    stok: 7,
    deskripsi: "Mangkuk keramik berukuran sedang dengan glasir alam dan motif sederhana.",
    bahan: "Tanah liat, glasir alam",
    imageUrl: ilustrasi("#E4E0D6", "#6F6052", "Keramik"),
    namaPengrajin: "Pengrajin Keramik Ardhana",
    unggulan: false,
  },
  {
    id: "prod-003",
    nama: "Ukiran Kayu Cendana",
    kategori: "ukiran",
    harga: 245000,
    stok: 4,
    deskripsi: "Ukiran kayu kecil dengan motif khas Bali untuk pelengkap ruang.",
    bahan: "Kayu cendana",
    imageUrl: ilustrasi("#E7D7C3", "#8A5638", "Ukiran"),
    namaPengrajin: "Pengrajin Ukir Suasta",
    unggulan: true,
  },
  {
    id: "prod-004",
    nama: "Kain Tenun Motif Awan",
    kategori: "tekstil",
    harga: 180000,
    stok: 20,
    deskripsi: "Kain tenun dengan motif awan dan pewarna alam yang lembut.",
    bahan: "Kapas, pewarna alam",
    imageUrl: ilustrasi("#E8E1D3", "#8B7967", "Tekstil"),
    namaPengrajin: "Pengrajin Tenun Warna",
    unggulan: false,
  },
  {
    id: "prod-005",
    nama: "Gelang Manik Bambu",
    kategori: "aksesori",
    harga: 65000,
    stok: 0,
    deskripsi: "Gelang manik bambu yang ringan dan nyaman dipakai sehari-hari.",
    bahan: "Bambu, benang",
    imageUrl: ilustrasi("#EDE3CE", "#6F6052", "Aksesori"),
    namaPengrajin: "Pengrajin Aksesori Alam",
    unggulan: false,
  },
  {
    id: "prod-006",
    nama: "Keranjang Rotan Mini",
    kategori: "anyaman",
    harga: 95000,
    stok: 15,
    deskripsi: "Keranjang rotan mini untuk menyimpan barang kecil di meja.",
    bahan: "Rotan",
    imageUrl: ilustrasi("#E9DCC8", "#8A5638", "Rotan"),
    namaPengrajin: "Pengrajin Anyam Lestari",
    unggulan: false,
  },
  {
    id: "prod-007",
    nama: "Piring Keramik Motif Air",
    kategori: "keramik",
    harga: 78000,
    stok: 9,
    deskripsi: "Piring keramik bermotif air, cocok untuk sajian harian.",
    bahan: "Tanah liat, glasir alam",
    imageUrl: ilustrasi("#E4E0D6", "#6F6052", "Keramik"),
    namaPengrajin: "Pengrajin Keramik Ardhana",
    unggulan: true,
  },
  {
    id: "prod-008",
    nama: "Sarung Bantal Tekstil Bali",
    kategori: "tekstil",
    harga: 110000,
    stok: 6,
    deskripsi: "Sarung bantal tekstil dengan motif lokal dan warna hangat.",
    bahan: "Kapas",
    imageUrl: ilustrasi("#E8E1D3", "#8B7967", "Tekstil"),
    namaPengrajin: "Pengrajin Tenun Warna",
    unggulan: false,
  },
];
