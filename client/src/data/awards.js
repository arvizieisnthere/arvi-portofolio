// ============================================================
// CARA PASANG FOTO
// 1. Taruh foto di  src/assets/awards/  (nama file bebas)
// 2. Buka comment import di bawah
// 3. Ganti  image: null  pada award terkait dengan variabel importnya
// Selama image masih null, tampil placeholder "FOTO DUMMY".
// Ukuran ideal foto: landscape ±1600 x 1000 px.
// ============================================================
import film from '../assets/awards/film.jpg'
import uiux from '../assets/awards/uiux.jpg'
import pkm from '../assets/awards/pkm.jpg'
import bplan from '../assets/awards/bplan.jpg'
import digital from '../assets/awards/digital.jpg'
import innopa from '../assets/awards/innopa.jpg'

export const awardsIntro = {
  eyebrow: '// PRESTASI & PENGHARGAAN',
  title: 'HALL OF FAME',
  text: 'Bukti nyata kolaborasi, eksekusi, dan keberanian mencoba—dari layar film sampai panggung pitching.',
}

const O = '#f0622d', B = '#2447d9', P = '#5b2bd6'

// rank: 1/2/3 = podium, null = non-podium (dipakai untuk statistik)
export const awards = [
  {
    id: 'film', image: film, accent: O, rank: 1, field: 'Film',
    badge: '1ST PLACE', event: 'FESTIVAL FILM 2024',
    title: 'Juara 1 FLS2N Kategori Short Movie "Passion or Future"',
    desc: 'Produser, DoP, Editor Video dan Audio.',
    tags: ['Produser', 'DoP', 'Editor Video', 'Audio'],
  },
  {
    id: 'uiux', image: uiux, accent: B, rank: 2, field: 'UI/UX',
    badge: 'BEST UI', event: 'FASILKOM TECH DAY',
    title: 'Juara 2 Event UI/UX Competition 2025 dengan Tema SYNC',
    desc: 'Make a UI/UX dalam develop Website Skillswap, serta Prototype.',
    tags: ['UI/UX', 'Website Skillswap', 'Prototype'],
  },
  {
    id: 'pkm', image: pkm, accent: P, rank: null, field: 'Riset',
    badge: 'TOP 5 PAPER', event: 'PKM UMB',
    title: 'Pekan Kreativitas Mahasiswa',
    desc: 'Tahap Eksternal (Pendanaan), mencatat seluruh kegiatan tim, membuat laporan, serta mengatur administrasi dan menemukan temuan baru "Veggie Roll".',
    tags: ['Pendanaan', 'Laporan', 'Administrasi', 'Veggie Roll'],
  },
  {
    id: 'bplan', image: bplan, accent: O, rank: 2, field: 'Bisnis',
    badge: 'SILVER MEDAL', event: 'IGNITE FUTURE FEST',
    title: 'Silver Medal Business Plan Competition',
    desc: 'Perancangan Inovasi Digital Platform "WargaConnect" hingga tahap Pitching di UIN Bandung.',
    tags: ['Business Plan', 'WargaConnect', 'Pitching'],
  },
  {
    id: 'digital', image: digital, accent: B, rank: 1, field: 'Inovasi',
    badge: 'BEST INNOVATION & PITCHING', event: 'INOVASI DIGITAL',
    title: 'Juara 1 Innovation Digital Executive Impact Week',
    desc: 'Membangun platform dari ide sendiri "Parenting1stKey" sampai tahap pitching bersama tim yang saya bawa, dengan role sebagai CEO.',
    tags: ['CEO', 'Parenting1stKey', 'Pitching'],
  },
  {
    id: 'innopa', image: innopa, accent: P, rank: 3, field: 'Inovasi',
    badge: 'BRONZE MEDAL', event: 'INNOVATION EVENT',
    title: 'Bronze Medal Pekan Inovasi Nasional Innopa',
    desc: 'Membawa inovasi "Parenting1stKey" hingga membuka booth dan pitching di tempat.',
    tags: ['Booth', 'Pitching', 'Parenting1stKey'],
  },
]
