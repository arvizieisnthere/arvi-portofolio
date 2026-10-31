// Foto otomatis diambil dari src/assets/leadership/ berdasarkan NAMA FILE (tanpa ekstensi), sesuai `slug`:
//   creatify.jpg | oase.jpg | bem-fasilkom.jpg   (jpg / jpeg / png / webp)
const files = import.meta.glob('../assets/leadership/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const imageFor = (slug) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === slug)
  return key ? files[key] : null
}

export const leadershipIntro = {
  eyebrow: '// JEJAK KEPEMIMPINAN',
  title: 'ORGANISASI & TANGGUNG JAWAB',
  text: 'Membina ekosistem tempat para talenta kreatif saling bertumbuh dan menghasilkan dampak nyata.',
}

// href: ganti nanti dengan halaman detail jejak masing-masing
export const leadership = [
  {
    slug: 'creatify', title: 'CREATIFY Community',
    role: 'ROLE: PRESIDENT', roleColor: '#f0622d', tag: 'Creative Fasilkom',
    desc: 'Wadah dalam mengembangkan minat mahasiswa dalam Visual dan Media Enthusiast, dan mengembangkan Inovasi Digital seperti Website/App/AI dan lainnya.',
    type: 'KOMUNITAS KREATIF', typeColor: '#ff9a6b', href: 'https://drive.google.com/drive/folders/1PJYaxHdIBelJQZs0OPI_O9jpYGxxYS15?usp=share_link', hue: 18,
  },
  {
    slug: 'oase', title: 'UKK OASE',
    role: 'ROLE: KEPALA DEPARTEMEN SOSIAL', roleColor: '#2447d9', tag: 'Kemanusiaan',
    desc: 'Organisasi Mahasiswa Sosial Peduli Lingkungan, bergerak untuk menjadi jembatan masyarakat dalam bentuk kemanusiaan.',
    type: 'UNIT KEGIATAN KHUSUS', typeColor: '#a9b8ff', href: '/leadership/oase', hue: 225,
  },
  {
    slug: 'bem-fasilkom', title: 'BEM Fasilkom',
    role: 'ROLE: STAFF RISET DAN TEKNOLOGI', roleColor: '#5b2bd6', tag: 'Kabinet Nawasena',
    desc: 'Staff dalam Riset teknologi, pembelajaran hingga pembuatan Website Profile BEM Fasilkom hingga Aspirasi Mahasiswa yang terintegrasi.',
    type: 'ORGANISASI KAMPUS', typeColor: '#ff9a6b', href: '/leadership/bem-fasilkom', hue: 265,
  },
].map((l) => ({ ...l, image: imageFor(l.slug) }))
