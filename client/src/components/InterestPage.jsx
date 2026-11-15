import './interestPage.css'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { pages, shotFor } from '../data/interestPages'
import { Laptop, Phone } from './Devices'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const pad = (n) => String(n).padStart(2, '0')
const ease = (t) => 1 - Math.pow(1 - t, 3)

/* ---------- satu section perangkat: terkunci (sticky) dan berputar mengikuti scroll ---------- */
function DeviceSection({ s }) {
  const sec = useRef(null)
  const pin = useRef(null)
  const model = useRef(null)
  const lid = useRef(null)
  const rot = useRef(null)
  const [pt, setPt] = useState(0)
  const src = shotFor(s.image)

  useEffect(() => {
    const el = sec.current
    const n = s.points.length
    let cur = 0, target = 0, raf = 0, vis = false, lastPt = -1

    const apply = (p) => {
      // 1 putaran penuh sepanjang section; sedikit miring naik-turun agar terasa 3D
      const angle = -24 + p * 360
      const tilt = 9 + Math.sin(p * Math.PI * 2) * 5
      if (model.current) model.current.style.transform = `rotateX(${tilt.toFixed(2)}deg) rotateY(${angle.toFixed(2)}deg)`
      if (lid.current) lid.current.style.setProperty('--lid', `${(-86 + 96 * ease(clamp(p / 0.14, 0, 1))).toFixed(2)}deg`) // laptop membuka di awal
      if (rot.current) rot.current.textContent = `${pad(Math.round(((angle % 360) + 360) % 360)).padStart(3, '0')}°`
      pin.current?.style.setProperty('--p', p.toFixed(4))
      const idx = Math.min(n - 1, Math.floor(p * n))
      if (idx !== lastPt) { lastPt = idx; setPt(idx) }
    }
    const calc = () => {
      const r = el.getBoundingClientRect()
      target = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1)
    }

    if (reduced()) { target = 0.12; apply(target); return }

    const tick = () => {
      raf = 0
      if (!vis) return
      calc()
      cur += (target - cur) * 0.1
      if (Math.abs(target - cur) < 0.0004) cur = target
      apply(cur)
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting
      if (vis && !raf) { calc(); cur = target; raf = requestAnimationFrame(tick) }
    }, { rootMargin: '120px' })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [s])

  const device = s.kind === 'phone'
    ? <Phone src={src} modelRef={model} />
    : <Laptop src={src} modelRef={model} lidRef={lid} />

  return (
    <section id={s.id} ref={sec} className={`ip-dev ip-dev--${s.side} ip-dev--${s.tone}`}>
      <div ref={pin} className="ip-pin">
        <div className="ip-copy">
          <p className="ip-eyebrow">{s.eyebrow}</p>
          <h2 className="ip-h2" aria-label={s.title.join(' ')}>
            {s.title.map((l) => <span key={l} aria-hidden="true">{l}</span>)}
          </h2>
          <p className="ip-text">{s.text}</p>

          <ol className="ip-pts">
            {s.points.map((p, i) => (
              <li key={p.t} className={i === pt ? 'is-on' : ''}>
                <span className="ip-pts__n">{pad(i + 1)}</span>
                <div><b>{p.t}</b><p>{p.d}</p></div>
              </li>
            ))}
          </ol>

          <p className="ip-tags">{s.tags.join(' / ')}</p>
        </div>

        <div className="ip-stage">
          <span className="ip-floor" />
          {device}
          <p className="ip-rot">ROT <b ref={rot}>000°</b></p>
        </div>
      </div>
    </section>
  )
}

function NotYet() {
  return (
    <div className="ip ip-soon">
      <p className="ip-eyebrow">// SEGERA HADIR</p>
      <h1 className="ip-h2"><span>Halaman ini</span><span>belum dibuat.</span></h1>
      <Link className="ip-btn" to={{ pathname: '/', hash: '#interests' }}>← Kembali ke semua bidang</Link>
    </div>
  )
}

export default function InterestPage() {
  const { slug } = useParams()
  const page = pages[slug]
  const barRef = useRef(null)
  const [cur, setCur] = useState(0)

  useEffect(() => {
    if (!page) return
    const prev = document.title
    document.title = `${page.title} — ARVI`
    return () => { document.title = prev }
  }, [page])

  // progres scroll + penanda section aktif
  useEffect(() => {
    if (!page) return
    let raf = 0
    const run = () => {
      raf = 0
      const h = document.documentElement
      barRef.current?.style.setProperty('--p', (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4))
      let idx = 0
      page.sections.forEach((s, i) => {
        const r = document.getElementById(s.id)?.getBoundingClientRect()
        if (r && r.top <= innerHeight * 0.5 && r.bottom > innerHeight * 0.5) idx = i + 1
      })
      setCur(idx)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(run) }
    run()
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf) }
  }, [page])

  if (!page) return <NotYet />

  const total = page.sections.length
  return (
    <div className="ip" key={slug}>
      <div className="ip-prog" aria-hidden="true"><i ref={barRef} /></div>

      <header className="ip-bar">
        <Link className="ip-back" to={{ pathname: '/', hash: '#interests' }}>← Kembali</Link>
        <Link className="ip-logo" to="/" aria-label="ARVI, ke beranda">ARVI<i /></Link>
        <p className="ip-idx" aria-hidden="true">
          {cur === 0 ? 'INTRO' : page.sections[cur - 1].short} <b>{pad(cur)}</b> / {pad(total)}
        </p>
      </header>

      {/* ===== pembuka: melanjutkan foto + judul dari animasi zoom di daftar ===== */}
      <div className="ip-hero">
        <div className="ip-hero__bg" aria-hidden="true">
          {page.cover && <img src={page.cover} alt="" />}
        </div>
        <p className="ip-kicker">{page.no} / {page.label}</p>
        <h1 className="ip-title"><span>{page.title}</span></h1>
        <div className="ip-hero__r">
          <p>{page.intro}</p>
          <span aria-hidden="true">SCROLL ↓</span>
        </div>
      </div>

      {page.sections.map((s) => <DeviceSection key={s.id} s={s} />)}

      <footer className="ip-end">
        <p>Masih ada bidang lain.</p>
        <Link className="ip-btn" to={{ pathname: '/', hash: '#interests' }}>← Semua bidang</Link>
      </footer>
    </div>
  )
}
