// Foto otomatis diambil dari src/assets/projects/ berdasarkan NAMA FILE (tanpa ekstensi), sesuai `slug` di bawah.
// Contoh: donasiyuk.jpg, skillswap.png, bizmap.webp ... Kalau belum ada, kartu tampil placeholder.
const files = import.meta.glob('../assets/projects/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const imageFor = (slug) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === slug)
  return key ? files[key] : null
}

export const projectsIntro = {
  eyebrow: '// SELECTED WORKS',
  title: 'KATALOG PROYEK UNGGULAN',
  text:
    'Koleksi karya lintas disiplin: aplikasi mobile mandiri, film naratif, branding identitas kampus, hingga pemodelan NLP.',
}

// Satu kategori = satu warna label. Label di kartu otomatis ikut warna kategorinya,
// dan otomatis masuk ke tab filter yang sama. Mau tambah kategori? Cukup tambah di sini.
export const categories = [
  { id: 'mobile',  label: 'MOBILE APP',         color: '#2447d9' },
  { id: 'video',   label: 'VIDEO EDITING',      color: '#c2255c' },
  { id: 'design',  label: 'DESAIN & BRANDING',  color: '#0e8a6b' },
  { id: 'website', label: 'WEBSITE',            color: '#ff2727' },
  { id: 'ai',      label: 'AI & INFRASTRUKTUR', color: '#d4501a' },
  { id: 'deep',    label: 'DEEP LEARNING',      color: '#3a3a44' },
]

// icon: arrow | chevron | circle | upright | doc | spark
// href: ganti nanti dengan halaman detail masing-masing proyek
export const projects = [
  { id: 1, slug: 'donasiyuk', category: 'mobile', note: 'HKI',
    title: 'DonasiYUK — Mobile Humanitarian App',
    desc: 'Aplikasi mobile penggalangan dana sosial kemanusiaan dengan arsitektur bersih, sistem verifikasi riwayat penyaluran dana transparan, dan penyimpanan data lokal terintegrasi.',
    tags: ['Flutter', 'Dart', 'SQLite', 'Clean Architecture'],
    type: 'SOCIAL', typeColor: '#2447d9', icon: 'arrow', href: '/projects/donasiyuk', },
  { id: 2, slug: 'eventpro', category: 'website',
    title: 'EventPro',
    desc: 'Solusi manajemen acara berbasis AI yang membantu penyelenggara dalam operasional Platform Operator.',
    tags: ['AI Integration', 'Event Management', 'Web Development'],
    type: 'AGENTAI', typeColor: '#b8400f', icon: 'arrow', href: '/projects/eventpro' },
  { id: 3, slug: 'bizmap', category: 'ai',
    title: 'BizMap',
    desc: 'Temukan arah terbaik untuk membangun bisnismu dengan roadmap interaktif berbasis AI Chatbot yang terintegrasi satu platform website.',
    tags: ['AI Chatbot', 'Web Development', 'Business Roadmap'],
    type: 'AGENTAI', typeColor: '#b8400f', icon: 'chevron', href: '/projects/bizmap' },
  { id: 4, slug: 'parenting1stkey', category: 'website', note: 'HKI',
    title: 'Parenting1stKey',
    desc: 'Konsultasi Parenting dalam 1 platform berisi Konsultasi Online chat dan video call secara realtime, AI Chatbot, Kelas Interaktif, Kalkulator gizi menggunakan SVM, Komunitas.',
    tags: ['Real-Time Consultation', 'Machine Learning', 'Parenting Platform'],
    type: 'BUSINESS PLAN', typeColor: '#14141a', icon: 'circle', href: '/projects/parenting1stkey' },
  { id: 5, slug: 'learningspace', category: 'website',
    title: 'LearningSpace',
    desc: 'Akses kursus online berkualitas yang dirancang untuk membantu kamu mengembangkan skill secara efektif dan fleksibel.',
    tags: ['React.js', 'Tailwind CSS', 'JavaScript'],
    type: 'EDUCATION', typeColor: '#5b2bd6', icon: 'arrow', href: '/projects/learningspace' },
  { id: 6, slug: 'lawnesia', category: 'ai',
    title: 'LawNesia',
    desc: 'BOT AI Whatsapp yang membantu kamu dalam mengatasi masalah terkait Hukum di Indonesia yang berlaku. Mr. Miles akan membantu kamu dalam menjadi Konsultan Hukum berbentuk AI Chatbot.',
    tags: ['Whatsapp Bot', 'NLP', 'AI Integration'],
    type: 'CONSULTANT', typeColor: '#2447d9', icon: 'upright', href: '/projects/lawnesia' },
  { id: 7, slug: 'bem-fasilkom', category: 'website',
    title: 'BEM Fasilkom',
    desc: 'Pengenalan Struktural Website BEM Fasilkom yang berisikan seluruh Kabinet, Program Kerja, dan menggabungkan Advokasi yaitu ruang untuk mahasiswa memberikan aspirasi.',
    tags: ['Web Development', 'Organizational Systems', 'Student Advocacy'],
    type: 'ORGANIZATION', typeColor: '#5b2bd6', icon: 'doc', href: '/projects/bem-fasilkom' },
  { id: 8, slug: 'aegisvision', category: 'deep',
    title: 'AegisVision',
    desc: 'Exploring AI-powered face detection for intelligent surveillance in challenging environmental conditions.',
    tags: ['Deep Learning', 'Computer Vision', 'Adverse Weather Detection'],
    type: 'SMARTCAM', typeColor: '#14141a', icon: 'spark', href: '/projects/aegisvision' },
  { id: 9, slug: 'video-fasilkom', category: 'video',
    title: 'Video Profile Fasilkom',
    desc: 'Dipercayakan membuat Video Profile untuk Fasilkom oleh Dekan pada Semester 1, dan Mengajak mahasiswa untuk berkontribusi.',
    tags: ['Director', 'Producer', 'DoP', 'Editor'],
    type: 'VIDEO PROFILE', typeColor: '#3b3bc3', icon: 'spark', href: 'https://youtu.be/O7DcvuYnPm0?si=sWmg8ADaICg-c3HX' },
  { id: 10, slug: 'it-day', category: 'design',
    title: 'Creative Media IT Day',
    desc: 'Media Kreatif kegiatan IT Day yang diselenggarakan oleh Fasilkom. Design hingga Video untuk promosi kegiatan IT Day.',
    tags: ['Design', 'Content', 'Head of Division', 'Editor'],
    type: 'CREATIVE MEDIA', typeColor: '#aeaeff', icon: 'spark', href: '/projects/it-day' },
  { id: 11, slug: 'content-creator', category: 'video',
    title: 'Manage Sosial Media Verve Watch',
    desc: 'Mengelola konten sosial media Verve Watch, termasuk pembuatan video promosi, strategi konten, dan interaksi dengan audiens untuk meningkatkan brand awareness.',
    tags: ['Talent', 'Content', 'Editing', 'Design'],
    type: 'SocialMedia', typeColor: '#1a1ab7', icon: 'spark', href: '/projects/it-day-2023' },
  { id: 12, slug: 'video-creame', category: 'video',
    title: 'Editor Video Creame Entertaintment',
    desc: 'Bertanggung jawab untuk mengedit video promosi, trailer, dan konten kreatif lainnya untuk Creame Entertainment, memastikan kualitas visual dan audio yang optimal.',
    tags: ['Editor', 'Talent', '3D Animation'],
    type: 'EDITOR', typeColor: '#7a8100', icon: 'spark', href: '/projects/it-day-2023' },
  { id: 13, slug: 'brand', category: 'design',
    title: 'My Brand Arvizie',
    desc: 'Membangun identitas merek pribadi Arvizie, termasuk logo, palet warna, tipografi, dan elemen visual lainnya untuk menciptakan citra yang konsisten dan profesional.',
    tags: ['Design', 'Branding', 'Fashion'],
    type: 'BRAND', typeColor: '#282829', icon: 'spark', href: '/projects/it-day-2023' },

].map((p) => ({ ...p, image: imageFor(p.slug) }))
