import './navbar.css'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile, navLinks } from '../data/profile'
import { links as socials } from '../data/contact'
import { ArrowUpRight } from './Icons'

const BREAKPOINT = 1000 // di bawah ini: menu layar penuh

/* teks yang "berguling" huruf demi huruf saat disentuh */
function Roll({ text }) {
  return (
    <span className="nv-roll" aria-hidden="true">
      {[...text].map((ch, i) => (
        <span key={i} data-c={ch === ' ' ? '\u00A0' : ch} style={{ '--i': i }}>{ch === ' ' ? '\u00A0' : ch}</span>
      ))}
    </span>
  )
}

/* jam lokal Tangerang (WIB) */
function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 10000)
    return () => clearInterval(id)
  }, [])
  return t.split(':')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState(-1)
  const [items, setItems] = useState(navLinks) // hanya link yang tujuannya ada di halaman
  const [hh, mm] = useClock()

  const barRef = useRef(null)
  const listRef = useRef(null)
  const linkRefs = useRef([])
  const indRef = useRef(null)
  const menuBtn = useRef(null)
  const openRef = useRef(false)
  openRef.current = open

  // buang link yang section-nya belum dibuat (mis. #about) supaya tidak ada link mati
  useLayoutEffect(() => {
    const present = navLinks.filter((l) => l.href.startsWith('#') && document.querySelector(l.href))
    setItems(present.length ? present : navLinks)
  }, [])

  /* scroll: bar muncul/hilang, progres, dan penanda section aktif */
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const run = () => {
      ticking = false
      const y = window.scrollY
      const h = document.documentElement
      setSolid(y > 24)
      barRef.current?.style.setProperty('--p', (y / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4))

      const d = y - last
      if (Math.abs(d) > 6) {
        setHidden(d > 0 && y > 140 && !openRef.current)
        last = y
      }
      if (y < 40) setHidden(false)

      const line = window.innerHeight * 0.42
      let idx = -1
      items.forEach((l, i) => {
        const el = l.href.startsWith('#') ? document.querySelector(l.href) : null
        if (!el) return
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) idx = i
      })
      setActive(idx)
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run) } }
    run()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  /* garis penanda meluncur ke link aktif */
  const placeIndicator = useCallback(() => {
    const ind = indRef.current
    const el = linkRefs.current[active]
    if (!ind) return
    if (!el) { ind.classList.remove('is-on'); return }
    ind.style.setProperty('--x', `${el.offsetLeft}px`)
    ind.style.setProperty('--w', `${el.offsetWidth}px`)
    ind.classList.add('is-on')
  }, [active])
  useLayoutEffect(placeIndicator, [placeIndicator, items])
  useEffect(() => {
    const ro = new ResizeObserver(placeIndicator)
    if (listRef.current) ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [placeIndicator])

  /* menu layar penuh: kunci scroll, Esc, tutup saat layar melebar */
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus() } }
    const onResize = () => { if (window.innerWidth > BREAKPOINT) setOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize) }
  }, [open])
  useEffect(() => () => { document.documentElement.style.overflow = '' }, [])

  const goFromSheet = (e, href) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', href)
    }, 380)
  }

  return (
    <>
      <header ref={barRef} className={`nv ${solid ? 'is-solid' : ''} ${hidden ? 'is-hidden' : ''} ${open ? 'is-open' : ''}`}>
        <a href="#top" className="nv-logo" aria-label={`${profile.brand}, kembali ke atas`} style={{ '--n': 0 }}>
          <Roll text={profile.brand} /><i className="nv-sq" aria-hidden="true" />
        </a>

        <nav ref={listRef} className="nv-links" aria-label="Menu utama">
          {items.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              ref={(el) => { linkRefs.current[i] = el }}
              className={`nv-link ${active === i ? 'is-active' : ''}`}
              style={{ '--n': i + 1 }}
              aria-current={active === i ? 'true' : undefined}
              onFocus={() => setHidden(false)}
            >
              <span className="sr-only">{l.label}</span>
              <Roll text={l.label} />
            </a>
          ))}
          <span ref={indRef} className="nv-ind" aria-hidden="true" />
        </nav>

        <div className="nv-right">
          <p className="nv-time" style={{ '--n': 8 }}>
            <span>TNG</span> <b>{hh}<i>:</i>{mm}</b>
          </p>
          <a href="#contact" className="nv-cta" style={{ '--n': 9 }}>
            <span className="sr-only">Let's connect</span>
            <Roll text="Let's connect" /><ArrowUpRight />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="nv-menu"
            aria-expanded={open}
            aria-controls="nv-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nv-menu__t" aria-hidden="true"><span>Menu</span><span>Tutup</span></span>
            <span className="sr-only">{open ? 'Tutup menu' : 'Buka menu'}</span>
            <span className="nv-menu__ic" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
        <span className="nv-prog" aria-hidden="true" />
      </header>

      {/* menu layar penuh (HP & tablet) */}
      <div id="nv-sheet" className={`nv-sheet ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <span className="nv-sheet__bg" /><span className="nv-sheet__bg nv-sheet__bg--wine" />
        <div className="nv-sheet__in">
          <ul className="nv-s-list">
            {items.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`nv-s-link ${active === i ? 'is-active' : ''}`}
                  onClick={(e) => goFromSheet(e, l.href)}
                >
                  <span style={{ '--i': i }}>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="nv-s-foot">
            <p className="nv-s-time">TANGERANG <b>{hh}:{mm}</b> WIB</p>
            <ul>
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{s.short}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
