import heroImg from '../assets/hero.jpg'
import avatarImg from '../assets/avatar.png'
// Kalau punya foto profil kecil untuk navbar, taruh di src/assets/avatar.png
// lalu ganti: import avatarImg from '../assets/avatar.png'

export const profile = {
  brand: 'ARVI',
  heroImg,
  avatarImg,
  resumeUrl: '/CV.pdf', // taruh file PDF di client/public/resume.pdf
  status: 'AVAILABLE FOR PROJECTS & COLLABORATIONS',
  kicker: 'PORTFOLIO // ARVI 2026',
  tagline: ['Creative Mind', 'Technology Explorer'],
  intro:
    'Kreator visual & pengembang teknologi. Menggabungkan sinema, desain antarmuka, dan kode modern ke dalam karya berdampak.',
  camera: 'SONY A6000',
  badges: { purple: 'STUDENT × CREATOR', white: 'CREATIVE TECHNOLOGIST' },
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Interests', href: '#interests' },
  { label: 'Projects', href: '#projects' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Skills', href: '#skills' },
  { label: 'Awards', href: '#awards' },
  { label: 'Note', href: '#note' },
]

export const facts = [
  { label: 'BACKGROUND', value: 'SMKN 56 Multimedia', tone: 'ink' },
  { label: 'ACADEMIC', value: 'Undergraduate IT @ Mercu Buana', tone: 'blue' },
  { label: 'LEADERSHIP', value: 'President Creatify Community', tone: 'orange' },
  { label: 'BASE LOCATION', value: 'Tangerang City, ID 🇮🇩', tone: 'ink' },
]

export const marqueeItems = [
  'DESIGN GRAPHIC',
  'CONTENT CREATOR',
  'UI/UX DESIGN SYSTEMS',
  'FRONT END DEVELOPER',
  'DATA GEEK',
  'BUSINESS PLAN & INNOVATION',
]
