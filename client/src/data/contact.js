// ============================================================
//  GANTI semua href di bawah ini dengan link aslimu.
//  Satu sumber data: dipakai oleh blok "?" di game, tombol CTA, dan footer.
// ============================================================
export const links = [
  { id: 'email',     label: 'EMAIL LANGSUNG',    short: 'EMAIL',     handle: 'arviandradeska@gmail.com',  href: 'mailto:arviandradeska@gmail.com',                              color: '#f0622d' },
  { id: 'instagram', label: 'INSTAGRAM (@ARVI)', short: 'INSTAGRAM', handle: '@arviandrr',                href: 'https://instagram.com/arviandrr',                              color: '#d6249f' },
  { id: 'linkedin',  label: 'LINKEDIN',          short: 'LINKEDIN',  handle: 'Arviandra Deska',           href: 'https://www.linkedin.com/in/arviandra-deska-657070319/',       color: '#2f6bff' },
  { id: 'github',    label: 'GITHUB',            short: 'GITHUB',    handle: 'arvizieisnthere',           href: 'https://github.com/arvizieisnthere',                           color: '#7c5cff' },
  { id: 'tiktok',    label: 'TIKTOK',            short: 'TIKTOK',    handle: '@vieither',                 href: 'https://www.tiktok.com/@vieither',                             color: '#19c3d6' },
].map((l) => ({ ...l, external: !l.href.startsWith('mailto:') }))

export const byId = Object.fromEntries(links.map((l) => [l.id, l]))

export const note = {
  badge: '✦ CATATAN PERSONAL & REFLEKSI ✦',
  quote: '“TERIMA KASIH TELAH BERKUNJUNG.”',
  sub: '“Eksplorasi visual tanpa henti, rekayasa teknologi dengan presisi. Terima kasih telah meluangkan waktu.”',
  sign: '— ARVI, 2026.',
  place: 'JAKARTA, INDONESIA • CREATIVE TECHNOLOGIST',
}

export const cta = {
  eyebrow: '// INGIN BERKOLABORASI?',
  title: ['Punya ide atau ingin berkolaborasi?', 'Mari bicara!'],
  text: 'Terbuka untuk tawaran proyek video sinematik, desain aplikasi, UI/UX, atau diskusi riset teknologi.',
  copy: '© 2026 ARVI. DIRANCANG DENGAN SENTUHAN KREATIF & FONDASI TEKNOLOGI. ALL RIGHTS RESERVED.',
}

export const footer = {
  brand: 'ARVI PORTFOLIO',
  copy: '© 2026 ARVI. ALL RIGHTS RESERVED.',
  place: 'TANGERANG, ID',
  ids: ['linkedin', 'github', 'instagram', 'tiktok'], // urutan link di footer
}
