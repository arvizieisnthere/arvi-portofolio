// Foto otomatis diambil dari src/assets/interests/ berdasarkan NAMA FILE (tanpa ekstensi):
//   cinematography.jpg | uiux.jpg | development.jpg | research.jpg | leadership.jpg
// Format boleh jpg / jpeg / png / webp. Kalau file belum ada, kartu tampil placeholder abu-abu.
const files = import.meta.glob('../assets/interests/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const imageFor = (slug) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === slug)
  return key ? files[key] : null
}

export const interestsIntro = {
  eyebrow: '// EKSPLORASI & PASSION',
  title: 'APA YANG SAYA SUKA KERJAKAN?',
  text:
    'Kombinasi eksplorasi visual emosional dan logika komputasi untuk menciptakan produk yang berdaya guna dan memikat hati.',
}

// size: 'sm' = lebar 2 kolom, 'lg' = lebar 4 kolom (grid 6 kolom)
// href: ganti nanti dengan halaman detail masing-masing
export const interests = [
  { id: 1, slug: 'cinematography', no: '01', label: 'VISUAL', title: 'Cinematography & Grading',
    tags: ['Premiere', 'After Effects', 'DaVinci'], accent: '#ff8a5c', size: 'sm', href: '/interests/cinematography' },
  { id: 2, slug: 'uiux', no: '02', label: 'INTERACTION', title: 'UI/UX & Design Systems',
    tags: ['Figma', 'Atomic', 'Prototype'], accent: '#a9b8ff', size: 'sm', href: '/interests/uiux' },
  { id: 3, slug: 'development', no: '03', label: 'DEVELOPMENT', title: 'Web & Mobile Apps',
    tags: ['Flutter', 'Java Script', 'SQL'], accent: '#a9b8ff', size: 'sm', href: '/interests/development' },
  { id: 4, slug: 'research', no: '04', label: 'RESEARCH', title: 'ML, DL, AI, Innovation',
    tags: ['Python', 'NumPy & Pandas', 'Hugging Face'], accent: '#a9b8ff', size: 'sm', href: '/interests/research' },
  { id: 5, slug: 'leadership', no: '05', label: 'LEADERSHIP', title: 'Creative Movement & Communities',
    tags: ['OASE', 'Creatify', 'BEM Fasilkom'], accent: '#a9b8ff', size: 'lg', href: '/interests/leadership',
    badge: 'EXPERIENCE, CONNECTION, INSIGHT' },
].map((i) => ({ ...i, image: imageFor(i.slug) }))
