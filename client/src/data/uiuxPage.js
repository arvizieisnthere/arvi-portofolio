// ============================================================
//  HALAMAN "UI/UX & DESIGN SYSTEMS"  →  /interests/uiux
//
//  FOTO / GAMBAR (opsional, taruh di src/assets/uiux/):
//     flow.png   → screenshot alur Figma kamu (ditampilkan di kanvas yang bisa digeser & di-zoom)
//     cover.jpg  → gambar yang muncul di kartu pada tahap "Halaman" (animasi atom → halaman)
//  Format: jpg / jpeg / png / webp / svg. Kalau belum ada, dipakai gambar bawaan.
//
//  Semua teks di bawah masih DUMMY → ganti sesukamu.
// ============================================================
const files = import.meta.glob('../assets/uiux/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const find = (name) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === name)
  return key ? files[key] : null
}

export const uxIntro = {
  kicker: '02 / INTERACTION',
  lines: ['UI/UX', '& DESIGN'],
  serif: 'Systems.',
  text: 'Desain yang baik terlihat seperti tidak ada. Yang ada hanya sistem yang konsisten, dan orang yang tidak perlu berpikir dua kali.',
  cue: 'SCROLL — BONGKAR ISINYA',
  artboard: 'UI/UX & Design Systems',
}

/* ---------- 01 · token ---------- */
export const uxTokens = {
  idx: '01 / TOKEN',
  a: 'Ubah satu token,',
  b: 'semuanya ikut.',
  text: 'Design system itu bukan kumpulan komponen, tapi kumpulan keputusan. Geser nilainya, lihat seluruh antarmuka menyesuaikan.',
  presets: [
    { id: 'tegas', label: 'Tegas', r: 0, u: 8, fw: 800, theme: 'dark' },
    { id: 'netral', label: 'Netral', r: 10, u: 8, fw: 600, theme: 'light' },
    { id: 'lembut', label: 'Lembut', r: 28, u: 11, fw: 500, theme: 'light' },
  ],
}

/* ---------- 02 · atomic ---------- */
export const uxAtomic = {
  idx: '02 / ATOMIC',
  a: 'Dari atom',
  b: 'sampai halaman.',
  image: find('cover'),
  stages: [
    { name: 'Atom', d: 'Elemen terkecil yang berdiri sendiri: tombol, kolom input, tag, avatar.' },
    { name: 'Molekul', d: 'Beberapa atom dipasangkan sehingga punya fungsi, misalnya label dan input.' },
    { name: 'Organisme', d: 'Gabungan molekul menjadi bagian antarmuka yang utuh. Di sini: sebuah kartu.' },
    { name: 'Template', d: 'Organisme ditaruh di kerangka layout. Strukturnya jelas, isinya belum nyata.' },
    { name: 'Halaman', d: 'Konten asli masuk. Di sinilah desain benar-benar diuji.' },
  ],
}

/* ---------- 03 · kanvas ---------- */
export const uxCanvas = {
  idx: '03 / CANVAS',
  a: 'Peta alurnya,',
  b: 'bisa kamu geser.',
  text: 'Seret untuk menggeser. Tahan Ctrl (atau Cmd) sambil scroll untuk zoom. Ketuk angka untuk membaca keputusan di baliknya.',
  image: find('flow'),
  world: { w: 1600, h: 900 },
  pins: [
    { x: 760, y: 110, t: 'Registrasi dan login dipisah', d: 'Dua tugas berbeda tidak seharusnya berebut satu layar. Pengguna baru tidak perlu melihat kolom yang bukan untuknya.' },
    { x: 1140, y: 390, t: 'Satu aksi utama per layar', d: 'Di layar bayar hanya ada satu tombol yang menonjol, jadi tidak ada keraguan harus menekan yang mana.' },
    { x: 760, y: 670, t: 'Status selalu terlihat', d: 'Riwayat dan verifikasi dibuat terbuka supaya pengguna tahu dananya sudah sampai mana.' },
  ],
}

export const uxNext = { label: 'Web & Mobile Apps', href: '/interests/development' }
