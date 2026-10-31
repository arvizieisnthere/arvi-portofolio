// ============================================================
//  ISI HALAMAN DETAIL JEJAK (semua teks di sini masih DUMMY → ganti sesuka kamu)
//  Satu layout dipakai untuk ketiganya; yang beda hanya isi file ini.
//
//  FOTO: taruh di src/assets/leadership/
//    <slug>.jpg      → foto utama (dipakai juga di kartu & hero)
//    <slug>-1.jpg ... <slug>-4.jpg → foto tambahan (momen cerita & highlight)
//  Kalau foto tambahan belum ada, otomatis pakai foto utama; kalau itu pun belum ada → placeholder.
// ============================================================
const files = import.meta.glob('../assets/leadership/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const find = (name) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === name)
  return key ? files[key] : null
}
// n = 0 → foto utama, n = 1..4 → foto tambahan
export const photoFor = (slug, n = 0) => (n ? find(`${slug}-${n}`) || find(slug) : find(slug))

export const details = {
  creatify: {
    big: ['CREATIFY', 'COMMUNITY'],
    tagline: ['Bikin ruang buat', 'yang suka bikin.'],
    intro:
      'Awalnya cuma sekumpulan anak yang hobi ngulik video, desain, dan kode di sela jam kuliah. Sekarang jadi rumah buat siapa pun yang pengin bikin sesuatu, dan nggak takut salah dulu.',
    keywords: ['VISUAL', 'MEDIA', 'WEBSITE', 'APP', 'AI', 'KOLABORASI', 'NGULIK'],
    stats: [
      { n: 120, s: '+', l: 'anggota yang aktif nongkrong' },
      { n: 24, s: '', l: 'event & workshop' },
      { n: 6, s: '', l: 'divisi kreatif' },
      { n: 1, s: '', l: 'rumah buat ide-ide gila' },
    ],
    chapters: [
      { no: '01', when: 'Awal 2024', title: 'Cuma niat nongkrong, jadinya gerakan', text: 'Semua berawal dari grup chat isi lima orang yang bosan sama tugas kuliah doang. Kita pengin punya tempat buat bikin hal yang beneran kita suka: video, desain, sampai kode ngasal. Ternyata yang mau gabung banyak banget.', cap: 'rapat pertama, kursi kurang' },
      { no: '02', when: 'Pertengahan 2024', title: 'Bagi divisi, bagi kopi', text: 'Biar nggak chaos, kita bagi divisi: visual, media, web & app, sama riset AI. Tiap divisi punya "proyek gila" sendiri. Kadang jadi, kadang bubar, tapi yang penting jalan terus.', cap: 'sprint desain jam 2 pagi' },
      { no: '03', when: '2025', title: 'Event pertama, kursinya nggak cukup', text: 'Workshop pertama kita kebanjiran peserta sampai ada yang duduk di lantai. Panik? Banget. Seru? Lebih banget. Dari situ kita sadar ini udah bukan sekadar komunitas kampus.', cap: 'hari-H, semua sibuk' },
    ],
    highlights: [
      { tag: 'WORKSHOP', title: 'Editing kilat 3 jam', text: 'Dari nol sampai bisa bikin video pendek. Laptop pinjaman pun jadi.' },
      { tag: 'LOMBA', title: 'Poster challenge', text: 'Satu tema, 48 jam, puluhan poster. Juri sampai bingung milih.' },
      { tag: 'PAMERAN', title: 'Karya kita dipajang', text: 'Pertama kalinya hasil ngulik dipajang gede, bukan cuma di folder.' },
      { tag: 'BUILD', title: 'Hackathon kecil-kecilan', text: 'Sehari bikin prototype app. Sebagian masih kita pakai sampai sekarang.' },
    ],
    lessons: [
      { a: 'Ide bagus nggak ada gunanya kalau', hl: 'cuma tinggal di kepala', b: '.' },
      { a: 'Tim yang kuat bukan yang paling jago, tapi yang', hl: 'mau saling nunggu', b: '.' },
      { a: 'Berantakan dulu,', hl: 'rapihin belakangan', b: '.' },
    ],
  },

  oase: {
    big: ['UKK', 'OASE'],
    tagline: ['Peduli itu kerja,', 'bukan cuma niat.'],
    intro:
      'UKK OASE itu tempat belajar jadi manusia yang berguna. Dari bersihin lingkungan sampai ngajar anak-anak, semuanya dikerjain bareng. Pakai tenaga, bukan cuma caption.',
    keywords: ['PEDULI', 'LINGKUNGAN', 'SOSIAL', 'KEMANUSIAAN', 'AKSI NYATA', 'BERBAGI'],
    stats: [
      { n: 35, s: '+', l: 'relawan yang turun langsung' },
      { n: 12, s: '', l: 'aksi sosial' },
      { n: 8, s: '', l: 'desa & komunitas' },
      { n: 500, s: '+', l: 'paket bantuan tersalur' },
    ],
    chapters: [
      { no: '01', when: 'Masa awal', title: 'Mulai dari yang kecil-kecil', text: 'Aksi pertama cuma bersih-bersih area kampus dan bagi-bagi makanan. Sederhana, tapi dari situ kelihatan siapa yang beneran mau turun tangan.', cap: 'aksi pertama, masih malu-malu' },
      { no: '02', when: 'Tengah jalan', title: 'Turun ke luar kampus', text: 'Kita mulai kunjungan ke komunitas dan desa. Ngobrol langsung sama warga bikin kita sadar kebutuhan mereka sering beda sama yang kita bayangin.', cap: 'ngobrol sama warga, lupa waktu' },
      { no: '03', when: 'Sekarang', title: 'Jadi jembatan, bukan cuma pemberi', text: 'Fokus kita bergeser: bukan cuma kasih bantuan, tapi bantu orang bisa jalan sendiri. Pelan-pelan, tapi terasa.', cap: 'foto bareng habis capek' },
    ],
    highlights: [
      { tag: 'AKSI', title: 'Jumat bersih', text: 'Sapu, karung, dan semangat. Area kampus bersih, hati ikut ringan.' },
      { tag: 'BERBAGI', title: 'Paket bantuan keliling', text: 'Ratusan paket, puluhan relawan, satu hari yang panjang tapi worth it.' },
      { tag: 'BELAJAR', title: 'Kelas kecil anak desa', text: 'Ngajar sambil main. Ternyata kita yang paling banyak belajar.' },
      { tag: 'PEDULI', title: 'Galang dana kilat', text: 'Dari satu postingan, terkumpul lebih dari yang kita kira.' },
    ],
    lessons: [
      { a: 'Bantuan terbaik adalah yang', hl: 'bikin orang berdaya', b: '.' },
      { a: 'Dengerin dulu,', hl: 'baru bertindak', b: '.' },
      { a: 'Capek di lapangan itu', hl: 'capek yang paling jujur', b: '.' },
    ],
  },

  'bem-fasilkom': {
    big: ['BEM', 'FASILKOM'],
    tagline: ['Suara mahasiswa,', 'teknologinya kita.'],
    intro:
      'Di Departemen Riset & Teknologi, tugasnya bukan cuma bikin laporan. Kita ngulik data, bikin website profil kabinet, dan ngebangun jalur aspirasi supaya suara mahasiswa nggak berhenti di grup chat.',
    keywords: ['RISET', 'TEKNOLOGI', 'ASPIRASI', 'ADVOKASI', 'WEBSITE', 'KAJIAN'],
    stats: [
      { n: 18, s: '', l: 'riset & kajian' },
      { n: 1, s: '', l: 'website profil kabinet' },
      { n: 200, s: '+', l: 'aspirasi mahasiswa masuk' },
      { n: 12, s: '', l: 'bulan masa kabinet' },
    ],
    chapters: [
      { no: '01', when: 'Awal kabinet', title: 'Kenalan sama masalahnya dulu', text: 'Sebelum bikin apa-apa, kita kumpulin keluhan dan kebutuhan mahasiswa. Ternyata banyak yang butuh hal sepele: info yang jelas dan tempat nyampein pendapat.', cap: 'rapat kerja, banyak catatan' },
      { no: '02', when: 'Tengah kabinet', title: 'Bangun website, sambil belajar', text: 'Website profil BEM kita kerjain dari desain sampai kode. Banyak revisi, banyak begadang, tapi hasilnya bisa dipakai semua orang.', cap: 'debugging bareng, jam malam' },
      { no: '03', when: 'Akhir kabinet', title: 'Aspirasi yang akhirnya terdengar', text: 'Jalur aspirasi terintegrasi mulai rame. Yang tadinya cuma ngeluh di belakang, sekarang bisa nyampein langsung dan dapat tanggapan.', cap: 'serah terima, lega' },
    ],
    highlights: [
      { tag: 'RISET', title: 'Kajian kebutuhan mahasiswa', text: 'Survei, olah data, jadi bahan keputusan. Angka yang bisa dipertanggungjawabkan.' },
      { tag: 'WEBSITE', title: 'Profil kabinet online', text: 'Struktur, program kerja, dan semua info dalam satu tempat yang rapi.' },
      { tag: 'ADVOKASI', title: 'Ruang aspirasi', text: 'Satu formulir, satu jalur, tanpa ribet. Semua masukan tercatat.' },
      { tag: 'BELAJAR', title: 'Sharing teknologi', text: 'Sesi santai buat bahas tools yang berguna buat kuliah dan karier.' },
    ],
    lessons: [
      { a: 'Data bikin suara kita', hl: 'susah diabaikan', b: '.' },
      { a: 'Teknologi itu alat, yang penting', hl: 'siapa yang kebantu', b: '.' },
      { a: 'Organisasi mengajarkan', hl: 'ngatur diri sendiri', b: ' dulu sebelum ngatur orang lain.' },
    ],
  },
}
