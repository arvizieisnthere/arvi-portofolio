import './devpage.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { devIntro, devSections, devNext } from '../data/devPage'
import { Laptop, Phone } from './Devices'

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* progres scroll (0–1) → sudut putar & bukaan layar */
const MOTION = {
  laptop: (p, calm) => ({ open: 0.5 + 0.5 * (1 - Math.pow(1 - clamp01(p / 0.2), 3)), rot: -26 + (calm ? 30 : 360) * ease(clamp01((p - 0.18) / 0.74)) }),
  phone: (p, calm) => ({ open: 1, rot: -22 + (calm ? 30 : 360) * ease(clamp01((p - 0.04) / 0.9)) }),
}
const AREA = { laptop: { w: 700, h: 560 }, phone: { w: 330, h: 470 } } // ruang yang dibutuhkan perangkat (px)

function DevSection({ s, flip }) {
  const sec = useRef(null)
  const stage = useRef(null)
  const deg = useRef(null)
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = sec.current, st = stage.current
    const calm = reduced()
    const n = s.features.length
    let target = 0, cur = 0, raf = 0, near = true, lastStep = -1

    const calc = () => {
      const r = el.getBoundingClientRect()
      target = clamp01(-r.top / Math.max(1, r.height - window.innerHeight))
    }
    const fit = () => {
      const b = st.getBoundingClientRect(), a = AREA[s.device]
      st.style.setProperty('--sc', Math.min(b.width / a.w, b.height / a.h, 1.3).toFixed(3))
      setReady(true)
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!near) return
      cur += (target - cur) * (calm ? 1 : 0.1)   // sedikit "inersia" supaya putarannya halus
      if (Math.abs(target - cur) < 0.0003) cur = target
      const m = MOTION[s.device](cur, calm)
      el.style.setProperty('--rot', m.rot.toFixed(2))
      el.style.setProperty('--open', m.open.toFixed(3))
      el.style.setProperty('--p', cur.toFixed(4))
      if (deg.current) deg.current.textContent = `${String(Math.round(((m.rot % 360) + 360) % 360)).padStart(3, '0')}°`
      const k = Math.min(n - 1, Math.floor(cur * n))
      if (k !== lastStep) { lastStep = k; setStep(k) }
    }

    const ro = new ResizeObserver(fit); ro.observe(st)
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting }, { rootMargin: '300px 0px' }); io.observe(el)
    window.addEventListener('scroll', calc, { passive: true })
    window.addEventListener('resize', calc)
    calc(); fit(); raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('scroll', calc); window.removeEventListener('resize', calc)
    }
  }, [s.device, s.features.length])

  return (
    <section ref={sec} id={s.id} data-sec={`${s.index} / ${s.label}`} className={`dp-sec dp-sec--${s.tone} ${flip ? 'is-flip' : ''}`}>
      {s.tone === 'wine' && <div className="dp-grain" aria-hidden="true" />}
      <div className="dp-pin">
        {/* perangkat 3D */}
        <div ref={stage} className={`dv-stage ${ready ? 'is-ready' : ''}`} role="img" aria-label={s.alt}>
          <div className="dv-floor" aria-hidden="true" />
          <div className="dv-fit">
            <div className="dv-tilt">
              <div className="dv-spin">
                {s.device === 'laptop' ? <Laptop src={s.src} /> : <Phone src={s.src} />}
              </div>
            </div>
          </div>
          <p className="dv-read" aria-hidden="true"><span>ROT</span> <b ref={deg}>000°</b></p>
        </div>

        {/* deskripsi */}
        <div className="dp-copy">
          <p className="dp-idx">{s.index} / {s.label}</p>
          <h2 className="dp-h"><span>{s.title}</span><em>{s.serif}</em></h2>
          <p className="dp-lead">{s.lead}</p>

          <ol className="dp-feats">
            {s.features.map((f, i) => (
              <li key={f.t} className={`dp-feat ${step === i ? 'is-on' : ''}`}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><b>{f.t}</b><p>{f.d}</p></div>
              </li>
            ))}
          </ol>

          <ul className="dp-stack">{s.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          <Link to={s.cta.to} className="dp-cta"><span>{s.cta.label}</span><i aria-hidden="true">→</i></Link>
        </div>
      </div>
    </section>
  )
}

export default function DevPage() {
  const [now, setNow] = useState('INTRO')

  useEffect(() => {
    const prev = document.title
    document.title = 'Web & Mobile Apps — ARVI'
    return () => { document.title = prev }
  }, [])

  // label di bilah atas mengikuti section yang sedang dibaca
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-sec]')]
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setNow(e.target.dataset.sec) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    els.forEach((e) => io.observe(e))
    const top = document.querySelector('.dp-intro')
    const io2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNow('INTRO') }, { rootMargin: '-45% 0px -50% 0px' })
    if (top) io2.observe(top)
    return () => { io.disconnect(); io2.disconnect() }
  }, [])

  return (
    <div className="dp">
      <div className="dp-top">
        <Link to={{ pathname: '/', hash: '#interests' }} className="dp-back"><i aria-hidden="true">←</i> Kembali</Link>
        <p className="dp-now" aria-live="polite">{now}</p>
        <Link to="/" className="dp-logo" aria-label="ARVI, ke beranda">ARVI<i /></Link>
      </div>

      {/* ===== intro ===== */}
      <header className="dp-intro">
        <div className="dp-intro__panel" aria-hidden="true" />
        <div className="dp-grain" aria-hidden="true" />
        <p className="dp-kicker">{devIntro.kicker}</p>
        <h1 className="dp-title" aria-label="Web dan Mobile apps">
          <span className="dp-l1" aria-hidden="true"><span>{devIntro.lead[0]}</span></span>
          <span className="dp-l1" aria-hidden="true"><span>{devIntro.lead[1]}</span></span>
          <span className="dp-l2" aria-hidden="true"><span>{devIntro.serif}</span></span>
        </h1>
        <div className="dp-intro__r">
          <p>{devIntro.text}</p>
          <p className="dp-cue">{devIntro.cue} <i aria-hidden="true">↓</i></p>
        </div>
      </header>

      {/* ===== perangkat (tambah section baru di data/devPage.js) ===== */}
      {devSections.map((s, i) => <DevSection key={s.id} s={s} flip={i % 2 === 1} />)}

      {/* ===== penutup ===== */}
      <footer className="dp-end">
        <p>MASIH ADA BIDANG LAIN</p>
        <Link to={devNext.href} className="dp-next"><span>{devNext.label}</span><b aria-hidden="true">→</b></Link>
        <Link to={{ pathname: '/', hash: '#interests' }} className="dp-end__back">← Kembali ke semua bidang</Link>
      </footer>
    </div>
  )
}
