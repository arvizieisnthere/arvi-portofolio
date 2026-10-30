export const skillsIntro = {
  eyebrow: '// TEKNOLOGI & ARSENAL',
  title: 'KEAHLIAN & TOOLKIT',
  text: 'Bukan sekadar persentase abstrak—ini adalah alat kerja nyata yang digunakan secara harian dalam siklus produksi.',
}

// Warna titik per skill (biru / oranye / ungu / cokelat / abu / gelap)
const B = '#2447d9', O = '#f0622d', P = '#5b2bd6', R = '#b8400f', G = '#6b6b78', D = '#2a2a33'

// icon: palette | code | mind  — accent = warna kartu & warna skill saat "terkumpul"
export const groups = [
  {
    id: 'creative', icon: 'palette', accent: '#c2491a', title: 'Creative Suite',
    desc: 'Perangkat lunak standar industri untuk pascaproduksi video naratif, editing grafis, dan sinematografi.',
    skills: [
      { name: 'Adobe Premiere Pro', color: O },
      { name: 'Adobe After Effects', color: P },
      { name: 'Adobe Photoshop', color: B },
      { name: 'DaVinci Resolve (Color)', color: R },
      { name: 'Figma (UI/UX)', color: B },
      { name: 'Studio Lighting Rigging', color: G },
      { name: 'Sinematografi & Framing', color: G },
      { name: 'Canva', color: G },
    ],
  },
  {
    id: 'tech', icon: 'code', accent: '#2447d9', title: 'Tech & Development',
    desc: 'Bahasa pemrograman, kerangka kerja aplikasi, dan infrastruktur sistem jaringan handal.',
    skills: [
      { name: 'Flutter Mobile', color: B },
      { name: 'Dart', color: B },
      { name: 'Python', color: O },
      { name: 'HTML5 / Modern CSS', color: G },
      { name: 'JavaScript (ES6+)', color: R },
      { name: 'SQL & SQLite Engine', color: G },
      { name: 'Git & GitHub', color: D },
      { name: 'RESTful Architecture', color: P },
      { name: 'Cisco Packet Tracer', color: B },
      { name: 'Tailwind CSS', color: B },
      { name: 'PostgreSQL / Supabase', color: P },
      { name: 'Docker Container', color: O },
      { name: 'Next.js / React', color: B },
      { name: 'Linux / Server Admin', color: G },
    ],
  },
  {
    id: 'soft', icon: 'mind', accent: '#5b2bd6', title: 'Soft Skills & Leadership',
    desc: 'Kemampuan interpersonal yang menerjemahkan visi konseptual menjadi eksekusi lapangan teratur.',
    skills: [
      { name: 'Kepemimpinan Tim (Leadership)', color: O },
      { name: 'Manajemen Proyek Kreatif', color: B },
      { name: 'Storytelling Visual', color: P },
      { name: 'Problem Solving Lapangan', color: G },
      { name: 'Komunikasi Publik & Presentasi', color: G },
      { name: 'Resolusi Konflik', color: G },
    ],
  },
]

// Level naik sesuai persentase skill yang sudah dikumpulkan
export const LEVELS = [
  { at: 0, name: 'NEWBIE' },
  { at: 0.2, name: 'APPRENTICE' },
  { at: 0.45, name: 'BUILDER' },
  { at: 0.7, name: 'SPECIALIST' },
  { at: 1, name: 'CREATIVE TECHNOLOGIST' },
]
