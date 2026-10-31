import './leadershipDetail.css'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { leadership } from '../data/leadership'
import { details, photoFor } from '../data/leadershipDetail'
import useReveal from '../hooks/useReveal'
import Footer from './Footer'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* foto atau placeholder dummy */
function Pic({ src, label = 'FOTO DUMMY', hue = 220, alt = '' }) {
  return src
    ? <img className="jd-pic" src={src} alt={alt} loading="lazy" draggable="false" />
    : <div className="jd-ph" style={{ '--h': hue }} role="img" aria-label={alt || label}><span>{label}</span></div>
}

/* muncul saat discroll (dipakai hemat: hanya di timeline) */
function Rv({ className = '', children, delay = 0 }) {
  const ref = useReveal(0.2)
  return <div ref={ref} className={`rv ${className}`} style={{ '--d': `${delay}ms` }}>{children}</div>
}

/* angka yang naik pelan */
function CountUp({ to, suffix = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced()) { setV(to); return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t) => {
        const k = Math.min((t - t0) / 1300, 1)
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))))
        if (k < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{v}{suffix}</span>
}

/* pita berjalan */
function Tape({ items, reverse, className }) {
  const track = (hidden) => (
    <ul className="jd-tape__track" aria-hidden={hidden || undefined}>
      {[0, 1, 2].flatMap((r) => items.map((t) => (
        <li key={`${r}-${t}`}>{t}<b>✦</b></li>
      )))}
    </ul>
  )
  return (
    <div className={`jd-tape ${className}`} aria-hidden="true">
      <div className={`jd-tape__inner ${reverse ? 'is-rev' : ''}`}>{track(false)}{track(true)}</div>
    </div>
  )
}

export default function LeadershipDetail() {
  const { slug } = useParams()
  const idx = leadership.findIndex((l) => l.slug === slug)
  const base = leadership[idx]
  const d = details[slug]

  const barRef = useRef(null)
  const reelRef = useRef(null)
  const drag = useRef({ on: false, x: 0, l: 0 })
  const lessonsRef = useReveal(0.25)

  useEffect(() => {
    if (!base) return
    const prev = document.title
    document.title = `${base.title} — ARVI`
    return () => { document.title = prev }
  }, [base])

  // garis progres scroll di atas halaman
  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
      barRef.current?.style.setProperty('--p', p.toFixed(4))
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [slug])

  if (!base || !d) {
    return (
      <div className="jd jd-404">
        <h1>Halaman ini nggak ketemu.</h1>
        <p>Alamatnya mungkin salah ketik atau jejaknya belum dibuat.</p>
        <Link className="jd-back" to={{ pathname: '/', hash: '#leadership' }}>← Balik ke daftar jejak</Link>
      </div>
    )
  }

  const next = leadership[(idx + 1) % leadership.length]
  const hero = photoFor(slug, 0)

  const nudge = (dir) => reelRef.current?.scrollBy({ left: dir * 340, behavior: reduced() ? 'auto' : 'smooth' })
  const dragStart = (e) => {
    if (e.pointerType !== 'mouse') return
    drag.current = { on: true, x: e.clientX, l: reelRef.current.scrollLeft }
    reelRef.current.classList.add('is-drag')
  }
  const dragMove = (e) => { if (drag.current.on) reelRef.current.scrollLeft = drag.current.l - (e.clientX - drag.current.x) }
  const dragEnd = () => { drag.current.on = false; reelRef.current?.classList.remove('is-drag') }

  return (
    <div className="jd" key={slug} style={{ '--acc': base.roleColor, '--next': next.roleColor, '--h': base.hue }}>
      <div className="jd-progress" aria-hidden="true"><i ref={barRef} /></div>

      {/* ================= HERO ================= */}
      <header className="jd-hero">
        <div className="jd-hero__bg" aria-hidden="true">
          <Pic src={hero} label="FOTO UTAMA (DUMMY)" hue={base.hue} />
          <span className="jd-hero__tint" />
        </div>

        <div className="jd-top">
          <Link className="jd-back" to={{ pathname: '/', hash: '#leadership' }}>← Kembali</Link>
          <Link className="jd-logo" to="/" aria-label="ARVI, ke beranda">ARVI<i /></Link>
        </div>

        <div className="jd-hero__body">
          <p className="jd-kicker">Jejak ke-{idx + 1} dari {leadership.length}</p>
          <h1 className="jd-title" aria-label={d.big.join(' ')}>
            {d.big.map((w, li) => (
              <span key={w} className={`jd-line ${li === 1 ? 'is-outline' : ''}`} aria-hidden="true">
                <span>{[...w].map((ch, i) => <i key={i} style={{ '--i': i + li * 6 }}>{ch}</i>)}</span>
              </span>
            ))}
          </h1>
        </div>

        <span className="jd-sticker jd-sticker--role">{base.role}</span>
        <span className="jd-sticker jd-sticker--time">{base.tag}</span>

        <Tape items={d.keywords} className="jd-tape--a" />
        <Tape items={[...d.keywords].reverse()} reverse className="jd-tape--b" />
      </header>

      {/* ================= INTRO + ANGKA ================= */}
      <section className="jd-intro">
        <h2 className="jd-tagline">
          {d.tagline[0]}<br /><span>{d.tagline[1]}</span>
        </h2>
        <div className="jd-intro__side">
          <p className="jd-lead">{d.intro}</p>
          <p className="jd-type"><b>{base.type}</b></p>
        </div>

        <ul className="jd-stats">
          {d.stats.map((s, i) => (
            <li key={s.l} className="jd-stat" style={{ '--r': i % 2 ? '1.6deg' : '-1.6deg' }}>
              <strong><CountUp to={s.n} suffix={s.s} /></strong>
              <span>{s.l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= CERITANYA ================= */}
      <section className="jd-story">
        <h2 className="jd-h2">Ceritanya gini.</h2>
        {d.chapters.map((c, i) => (
          <Rv key={c.no} className={`chap ${i % 2 ? 'is-flip' : ''}`}>
            <span className="chap__no" aria-hidden="true">{c.no}</span>
            <div className="chap__txt">
              <p className="chap__when">{c.when}</p>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
            <figure className="polaroid" style={{ '--tilt': i % 2 ? '3deg' : '-3deg' }}>
              <Pic src={photoFor(slug, i + 1)} label={`MOMEN ${c.no} (DUMMY)`} hue={base.hue + i * 40} alt={c.cap} />
              <figcaption>{c.cap}</figcaption>
            </figure>
          </Rv>
        ))}
      </section>

      {/* ================= HIGHLIGHT (geser) ================= */}
      <section className="jd-reel">
        <div className="jd-reel__head">
          <h2 className="jd-h2">Yang paling nempel di ingatan.</h2>
          <div className="jd-reel__btns">
            <button type="button" onClick={() => nudge(-1)} aria-label="Geser ke kiri">←</button>
            <button type="button" onClick={() => nudge(1)} aria-label="Geser ke kanan">→</button>
          </div>
        </div>

        <ul
          ref={reelRef}
          className="jd-reel__row"
          onPointerDown={dragStart}
          onPointerMove={dragMove}
          onPointerUp={dragEnd}
          onPointerLeave={dragEnd}
          tabIndex={0}
          aria-label="Daftar highlight, geser untuk melihat semua"
        >
          {d.highlights.map((h, i) => (
            <li key={h.title} className="hl" style={{ '--r': `${[-1.5, 1, -0.8, 1.4][i % 4]}deg` }}>
              <div className="hl__pic"><Pic src={photoFor(slug, (i % 4) + 1)} label="FOTO DUMMY" hue={base.hue + i * 55} alt={h.title} /></div>
              <span className="hl__tag">{h.tag}</span>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= PELAJARAN ================= */}
      <section className="jd-lessons">
        <h2 className="jd-h2 jd-h2--inv">Yang aku bawa pulang.</h2>
        <ol ref={lessonsRef} className="les">
          {d.lessons.map((l, i) => (
            <li key={l.hl} style={{ '--i': i }}>
              {l.a} <mark>{l.hl}</mark>{l.b}
            </li>
          ))}
        </ol>
      </section>

      {/* ================= LANJUT ================= */}
      <section className="jd-next">
        <p>Masih ada cerita lain.</p>
        <Link to={next.href} className="jd-next__link">
          <span>{next.title}</span>
          <b aria-hidden="true">→</b>
        </Link>
        <Link className="jd-back jd-back--ink" to={{ pathname: '/', hash: '#leadership' }}>← Balik ke semua jejak</Link>
      </section>

      <Footer />
    </div>
  )
}
