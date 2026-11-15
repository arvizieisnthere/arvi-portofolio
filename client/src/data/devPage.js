// ============================================================
//  HALAMAN "WEB & MOBILE APPS"  →  /interests/development
//
//  FOTO (kamu import sendiri) — taruh di:  src/assets/dev/
//     laptop.jpg  → tampil di layar laptop 3D   (rasio ±16:10, mis. 1600×1000)
//     phone.jpg   → tampil di layar HP 3D       (rasio ±9:19, mis. 900×1900)
//  Format: jpg / jpeg / png / webp. Belum ada → layar berisi petunjuk.
//
//  MENAMBAH SECTION KE BAWAH: tambahkan satu objek lagi di `devSections`.
//     device : 'laptop' | 'phone'
//     image  : nama file di src/assets/dev (tanpa ekstensi), mis. 'laptop-2'
//     tone   : 'black' | 'wine'   (warna latar section)
//  Sisi teks/perangkat berganti otomatis (kiri-kanan) sesuai urutan.
//  Semua teks di bawah masih DUMMY → ganti sesukamu.
// ============================================================
const files = import.meta.glob('../assets/dev/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const find = (name) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === name)
  return key ? files[key] : null
}

export const devIntro = {
  kicker: '03 / DEVELOPMENT',
  lead: ['WEB &', 'MOBILE'],
  serif: 'apps.',
  text: 'Dari layar laptop sampai genggaman tangan. Dua perangkat, satu cara kerja: dirancang rapi dulu, baru dikodekan.',
  cue: 'SCROLL — PUTAR PERANGKATNYA',
}

export const devSections = [
  {
    id: 'web', device: 'laptop', image: 'laptop', tone: 'black', index: '01', label: 'WEB',
    title: 'Web', serif: 'yang terasa ringan.',
    alt: 'Laptop 3D yang menampilkan hasil proyek web',
    lead: 'Situs dan aplikasi web yang cepat dibuka, enak dipakai di layar kecil, dan gampang dirawat.',
    features: [
      { t: 'Dari Figma ke kode', d: 'Desain dipecah jadi komponen kecil (atomic) supaya konsisten dan gampang dipakai ulang.' },
      { t: 'Cepat & responsif', d: 'React dan Tailwind, dirancang untuk layar kecil dulu. Skillswap dan LearningSpace dibangun begini.' },
      { t: 'Data yang rapi', d: 'SQL di belakangnya, supaya isi situs bisa diubah lewat dashboard tanpa menyentuh kode.' },
    ],
    stack: ['React.js', 'Tailwind CSS', 'JavaScript', 'SQL'],
    cta: { label: 'Lihat proyek web', to: { pathname: '/', hash: '#projects' } },
  },
  {
    id: 'mobile', device: 'phone', image: 'phone', tone: 'wine', index: '02', label: 'MOBILE',
    title: 'Mobile', serif: 'yang tetap jalan.',
    alt: 'Ponsel 3D yang menampilkan hasil proyek aplikasi mobile',
    lead: 'Aplikasi yang nyaman di genggaman, dan tidak ikut mati ketika sinyal hilang.',
    features: [
      { t: 'Arsitektur bersih', d: 'Flutter dan Dart dengan Clean Architecture: tampilan, logika, dan data dipisah dengan jelas.' },
      { t: 'Tetap jalan tanpa sinyal', d: 'Data penting disimpan lokal di SQLite, jadi DonasiYUK tetap bisa dibuka saat offline.' },
      { t: 'Transparan untuk pengguna', d: 'Riwayat penyaluran dana ditampilkan terang, supaya donatur tahu uangnya pergi ke mana.' },
    ],
    stack: ['Flutter', 'Dart', 'SQLite', 'Clean Architecture'],
    cta: { label: 'Lihat DonasiYUK', to: { pathname: '/', hash: '#projects' } },
  },
].map((s) => ({ ...s, src: find(s.image) }))

export const devNext = { label: 'ML, DL, AI, Innovation', href: '/interests/research' }
