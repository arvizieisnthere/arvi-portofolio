import { useEffect, useState } from 'react'
import { profile, navLinks } from '../data/profile'
import { ArrowUpRight } from './Icons'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#top" className="nav__logo" aria-label="ARVI — kembali ke atas">
        {profile.brand}<span className="dot" />
      </a>

      <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Menu utama">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
      </nav>

      <div className="nav__right">
        <a href="#contact" className="btn btn--orange btn--sm">
          LET'S CONNECT <ArrowUpRight />
        </a>
        <img className="nav__avatar" src={profile.avatarImg} alt="Foto profil ARVI" />
        <button
          className="nav__burger"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  )
}
