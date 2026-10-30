// Foto otomatis diambil dari src/assets/gallery/ berdasarkan NAMA FILE: "<kartu>-<foto>.jpg"
//   kartu = 1..8 (urutan dari kiri-atas ke kanan-bawah), foto = 1..4 (urutan flip)
//   contoh: 1-1.jpg 1-2.jpg 1-3.jpg 1-4.jpg  → kartu pertama, 4 foto
// Format boleh jpg / jpeg / png / webp. Foto yang belum ada tampil sebagai placeholder berwarna.
const files = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const imageFor = (name) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === name)
  return key ? files[key] : null
}

export const galleryIntro = {
  eyebrow: '// VISUAL ARCHIVE & BTS',
  title: 'SNAP & MEDIA SHOWCASE',
  text: 'Kompilasi rekaman visual, rig kamera produksi, eksplorasi mockup UI, dan proses kreatif di lapangan.',
}

const PHOTOS_PER_CARD = 4

// alt = deskripsi singkat untuk pembaca layar; ubah sesuai foto aslimu
const cards = [
  { alt: 'Fotografer di puncak bukit' },
  { alt: 'Mockup UI di laptop' },
  { alt: 'Suasana produksi malam' },
  { alt: 'Tools desain Adobe' },
  { alt: 'Timeline video editing' },
  { alt: 'Kode di layar ponsel' },
  { alt: 'Clapperboard di lokasi syuting' },
  { alt: 'Audiens di acara komunitas' },
]

export const gallery = cards.map((c, n) => ({
  id: n + 1,
  alt: c.alt,
  photos: Array.from({ length: PHOTOS_PER_CARD }, (_, m) => ({
    src: imageFor(`${n + 1}-${m + 1}`),
    label: `FOTO ${n + 1}-${m + 1}`,
    hue: (n * 41 + m * 67) % 360,
  })),
}))
