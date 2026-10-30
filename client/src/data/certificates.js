// ============================================================
// DATA SECTION 8 — GALERI SERTIFIKAT
// - Foto otomatis diambil dari src/assets/certs/cert1.jpg ... cert12.jpg
//   (boleh .jpg / .jpeg / .png / .webp). Kalau file belum ada, bingkai
//   menampilkan sertifikat pixel dummy.
// - url   : link kredensial (boleh kosong '').
// - Item 09–12 masih PLACEHOLDER, tinggal ganti isinya.
// ============================================================
// Ambil semua file di src/assets/certs (yang belum ada otomatis dilewati)
const files = import.meta.glob('../assets/certs/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
const pick = (n) => {
  const key = Object.keys(files).find((p) => new RegExp(`/cert${n}\\.(jpe?g|png|webp)$`).test(p))
  return key ? files[key] : null
}

export const certIntro = {
  eyebrow: '// VERIFIED LICENSES & CERTIFICATES',
  title: 'Galeri Sertifikasi & Penghargaan',
  text: 'Ikuti karakter pixel ini berjalan menyusuri galeri, berhenti di setiap bingkai, lalu zoom ke sertifikatnya. Klik bingkai atau nomor di bawah untuk lompat langsung.',
}

const base = [
  { id: 'ccna', title: 'Introduction to CCNA', badge: 'CISCO', code: 'CISCO-882941', tag: 'VALID // 2025', field: 'CCNA', accent: '#f0622d', image: null, url: '/certs/cert1.png' },
  { id: 'fls2n', title: 'Juara 1 FLS2N Short Movie', badge: 'FLS2N', code: 'FLS2N-14029311', tag: 'NATIONAL', field: 'shortmovie', accent: '#2447d9', image: null, url: '/certs/cert2.png' },
  { id: 'uiux', title: 'Juara 2 UI/UX Competition SYNC', badge: 'SYNC', code: 'SYNC-FL-9921', tag: 'UI/UX', field: 'uiux', accent: '#2447d9', image: null, url: '/certs/cert3.png' },
  { id: 'pkm', title: 'Pekan Kreatifitas Mahasiswa', badge: 'EKSTERNAL', code: 'PKM-481920', tag: 'PKM', field: 'pkm', accent: '#5b2bd6', image: null, url: '/certs/cert4.png' },
  { id: 'silver', title: 'Silver Medal Business Plan', badge: 'SILVER', code: 'BP-55102', tag: 'BUSINESS PLAN', field: 'bp', accent: '#5b2bd6', image: null, url: '/certs/cert5.png' },
  { id: 'innovation', title: 'Juara 1 Digital Innovation', badge: 'EXECUTIVE', code: 'executive-001', tag: 'DIGITAL INNOVATION', field: 'exe', accent: '#2447d9', image: null, url: '/certs/cert6.png' },
  { id: 'bronze', title: 'Bronze Medal Pekan Inovasi', badge: 'PEKAN INOVASI', code: 'inovasi-772019', tag: 'PEKAN INOVASI', field: 'inovasi', accent: '#f0622d', image: null, url: '/certs/cert7.png' },
  { id: 'participant', title: 'Participant IDEONIC International Competition', badge: 'IDEONIC', code: 'ideonic-901', tag: 'INTERNATIONAL', field: 'ideonic', accent: '#2447d9', image: null, url: '/certs/cert8.png' },

  // ---- PLACEHOLDER: ganti dengan sertifikat kamu ----
  { id: 'kreasi', title: 'Lomba Kreasi Konten Foto & Video Destinasi Wisata Jakarta by Gubernus DKI Jakarta', badge: 'GOVERNOR', code: 'governor-000009', tag: 'KREASI KONTEN', field: 'kreasi', accent: '#22c55e', image: null, url: '/certs/cert9.png' },
  { id: 'workshop', title: 'Workshop ESET Campus Security Day', badge: 'eset', code: 'eset-000010', tag: 'ESET', field: 'eset', accent: '#ff5c93', image: null, url: '/certs/cert10.png' },
  { id: 'hki', title: 'HKI Parenting1stKey', badge: 'hki', code: 'hki-001', tag: 'HKI', field: 'hki', accent: '#ffc83d', image: null, url: '/certs/cert11.png' },
  { id: 'hki', title: 'HKI DonasiYuk', badge: 'hki', code: 'hki-002', tag: 'HKI', field: 'hki', accent: '#f0622d', image: null, url: '/certs/cert12.png' },
]

export const certs = base.map((c, i) => ({ ...c, image: pick(i + 1) }))
