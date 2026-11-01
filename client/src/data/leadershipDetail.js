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
      { n: 20, s: '+', l: 'anggota aktif' },
      { n: 24, s: '', l: 'event & project' },
      { n: 3, s: '', l: 'divisi utama' },
      { n: 1, s: '', l: 'rumah buat ide-ide gila' },
    ],
    chapters: [
      { no: '01', when: 'Awal 2024', title: 'Cuma anak-anak dalam 1 kelas yang sama', text: 'Semua berasal dari saya yang diberikan tugas membuat video perkenalan TI yang dipercaya oleh Kaprodi. Tetapi saya mengusulkan untuk membuat Video Profile. Saya membutuhkan banyak orang sehingga saya menarik yang sekarang menjadi tim saya.', cap: 'awal mula, membangun teamwork' },
      { no: '02', when: 'Pertengahan 2024', title: 'Bagi divisi, bagi kopi', text: 'Tentunya agar terarah seya membuat struktural hingga resmi menjadi komunitas Fakultas. Terdapat 3 divisi utama: RnD, Visual n Media, Talent n Content. Semuanya berkerja sama menjadi satu kesatuan.', cap: 'rapat rutin tiap minggu, sambil ngopi' },
      { no: '03', when: '2025-Now', title: 'Semakin Dikenal, Semakin Luas', text: 'Tentunya semakin dikenal, semakin luas jangkauan komunitas ini. Hingga sering dipercaya Dosen untuk ikut-ikut mengadakan acara dari panitia kecil, hingga acara besar.', cap: 'hari-H, semua sibuk' },
    ],
    highlights: [
      { tag: 'Rapat Rutin', title: 'Meeting n Grow', text: 'Dari nol sampai bisa menciptakan inovasi yang terbarukan.' },
      { tag: 'Manajemen', title: 'Sosmed Fasilkom', text: 'Membuat jadwal dan timeline untuk Sosial Media Fasilkom.' },
      { tag: 'PANITIA', title: 'Panitia Tiap Event', text: 'Tiap ada event selalu memberikan kontribusi dan ganti-gantian.' },
      { tag: 'BUILD', title: 'A Innovation', text: 'Dari ide sampai implementasi, hingga dilombakan dan banyak penghargaan.' },
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
      'UKK OASE adalah Organisasi Mahasiswa Sosial Peduli Lingkungan. Menjadi wadah nyata bagi mahasiswa untuk menyalurkan kepedulian terhadap sesama dan lingkungan, dengan aksi nyata di lapangan.',
    keywords: ['PEDULI', 'LINGKUNGAN', 'SOSIAL', 'KEMANUSIAAN', 'AKSI NYATA', 'BERBAGI'],
    stats: [
      { n: 1000, s: '+', l: 'anggota yang turun langsung' },
      { n: 100, s: '+', l: 'aksi sosial' },
      { n: 20, s: '+', l: 'desa & komunitas' },
      { n: 100, s: '+', l: 'campaign' },
    ],
    chapters: [
      { no: '01', when: 'Masa awal', title: 'Baru masuk, dipercaya jadi Ketua Pelaksana', text: 'Harusnya awal jadi anggota dari 30 lebih orang itu mengikuti Edukasi. Tapi karna ada bencana kebakaran, jadi saya langsung gerak sebagai ketua pelaksana yang dipercaya oleh Kepala Departemen dan Wakilnya.', cap: 'aksi pertama, aksi nyata!' },
      { no: '02', when: 'Tengah jalan', title: 'After 1 Periode, Jadi Kepala Departemen Sosial', text: 'Setelah 1 periode sebagai anggota, saya mencalonkan diri sebagai Kepala Departemen Sosial. dan Menang hingga memiliki 35 anggota baru yang saya sudah interview.', cap: 'Pemimpin Sosial yang terkenal.' },
      { no: '03', when: 'Sekarang', title: 'Menciptakan Suasana, Nyaman, Aman ke Anggota', text: 'Fokus kita bergeser: bukan cuma kasih bantuan, tapi bantu orang bisa jalan sendiri. Pelan-pelan, tapi terasa.', cap: 'foto bareng habis capek' },
    ],
    highlights: [
      { tag: 'AKSI', title: 'Peduli Bencana', text: 'Terjun langsung ke lokasi bencana untuk membantu korban. Memberi bantuan dari Open Donation.' },
      { tag: 'CALON', title: 'Mulai Yakin Untuk Membawa Perubahan', text: 'Siap menjalankan tugasnya dan membawa perubahan.' },
      { tag: 'EDUKASI', title: 'Bergerak Demi Kepedulian', text: 'Menjadi Pemimpin untuk membangun generasi yang peduli.' },
      { tag: 'LKMM', title: 'Melatih Kepemimpinan Anggota', text: 'Menjadi panitia LACTO (Leadership and Character Training OASE)' },
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
