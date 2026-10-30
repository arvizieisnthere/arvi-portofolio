import './awards.css'
import { useEffect, useRef, useState } from 'react'
import { awardsIntro, awards } from '../data/awards'

const N = awards.length
const AUTO_MS = 6500
const COLORS = ['#ffc83d', '#f0622d', '#2447d9', '#5b2bd6', '#22c55e', '#ff5c93']

const stats = [
  { label: 'PENGHARGAAN', value: N },
  { label: 'JUARA 1', value: awards.filter((a) => a.rank === 1).length },
  { label: 'PODIUM', value: awards.filter((a) => a.rank && a.rank <= 3).length },
  { label: 'BIDANG', value: new Set(awards.map((a) => a.field)).size },
]

const Trophy = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </svg>
)

function useCountUp(target, run, dur = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf, t0
    const step = (t) => {
      if (!t0) t0 = t
      const p = Math.min((t - t0) / dur, 1)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, run, dur])
  return v
}

function Stat({ value, label, run, i }) {
  const v = useCountUp(value, run)
  return (
    <div className="aw-stat aw-r" style={{ '--i': i + 2 }}>
      <b>{String(v).padStart(2, '0')}</b>
      <span>{label}</span>
    </div>
  )
}

function Placeholder({ a }) {
  return (
    <div className="aw-ph" style={{ '--accent': a.accent }}>
      <span className="aw-ph__glyph"><Trophy size={64} /></span>
      <span className="aw-ph__label">FOTO DUMMY · assets/awards/{a.id}.jpg</span>
    </div>
  )
}

export default function Awards() {
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [hover, setHover] = useState(false)
  const [auto, setAuto] = useState(true)
  const [fx, setFx] = useState([])

  const secRef = useRef(null)
  const cardRef = useRef(null)
  const fxId = useRef(0)

  const a = awards[active]

  // masuk layar → aktifkan animasi (ada jaring pengaman supaya konten tidak pernah tersembunyi)
  useEffect(() => {
    const el = secRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setEntered(true); setOnScreen(true); return }
    const io = new IntersectionObserver(([e]) => {
      setOnScreen(e.isIntersecting)
      if (e.isIntersecting) setEntered(true)
    }, { threshold: 0.05 })
    io.observe(el)
    const t = setTimeout(() => setEntered(true), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  // efek partikel
  const spawn = (el, text, color, n = 20) => {
    if (!el || !secRef.current) return
    const s = secRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const id = ++fxId.current
    const parts = Array.from({ length: n }, (_, i) => {
      const ang = (i / n) * Math.PI * 2 + Math.random() * 0.6
      const d = 70 + Math.random() * 110
      return { dx: Math.cos(ang) * d, dy: Math.sin(ang) * d, c: COLORS[(i + id) % COLORS.length], s: 6 + Math.random() * 7 }
    })
    setFx((l) => [...l, { id, x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top, text, color, parts }])
    setTimeout(() => setFx((l) => l.filter((f) => f.id !== id)), 1300)
  }

  const select = (i) => {
    if (i === active) return
    setActive(i)
    spawn(cardRef.current, awards[i].badge, awards[i].accent, 24)
  }
  const go = (d) => select((active + d + N) % N)

  // tilt 3D mengikuti kursor
  const onMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * 9).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * 11).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
    el.style.setProperty('--tx', `${((0.5 - x) * 18).toFixed(1)}px`)
    el.style.setProperty('--ty', `${((0.5 - y) * 12).toFixed(1)}px`)
  }
  const onLeave = () => {
    const el = cardRef.current
    if (el) ['--rx', '--ry', '--tx', '--ty'].forEach((k) => el.style.setProperty(k, '0'))
    setHover(false)
  }

  // spotlight di baris daftar
  const onItemMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }

  const ticker = awards.map((x) => `${x.badge} · ${x.event}`)

  return (
    <section id="awards" className={`aw ${entered ? 'is-in' : ''}`} ref={secRef}>
      <header className="aw__head">
        <div className="aw-r" style={{ '--i': 0 }}>
          <p className="aw__eyebrow">{awardsIntro.eyebrow}</p>
          <h2 className="aw__title">{awardsIntro.title}</h2>
        </div>
        <p className="aw__text aw-r" style={{ '--i': 1 }}>{awardsIntro.text}</p>
      </header>

      {/* marquee emas */}
      <div className="aw-marq aw-r" style={{ '--i': 1 }} aria-hidden="true">
        <div className="aw-marq__track">
          {[...ticker, ...ticker].map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      {/* statistik */}
      <div className="aw-stats">
        {stats.map((s, i) => <Stat key={s.label} {...s} i={i} run={entered} />)}
      </div>

      <div className="aw-main">
        {/* ===== panggung ===== */}
        <div className="aw-stage aw-r" style={{ '--i': 3 }} onMouseEnter={() => setHover(true)} onMouseMove={onMove} onMouseLeave={onLeave}>
          <div className="aw-stage__card" ref={cardRef} style={{ '--accent': a.accent }} role="tabpanel">
            <div className="aw-stage__media" key={`m-${a.id}`}>
              {a.image ? <img src={a.image} alt={a.title} /> : <Placeholder a={a} />}
            </div>
            <span className="aw-stage__sweep" key={`s-${a.id}`} />
            <span className="aw-stage__glare" />

            <span className="aw-badge" key={`b-${a.id}`}><Trophy />{a.badge}</span>
            <span className="aw-stage__field" key={`f-${a.id}`}>{a.field}</span>
            <div className="aw-stage__big" key={`n-${a.id}`} aria-hidden="true">{String(active + 1).padStart(2, '0')}</div>

            <div className="aw-stage__info" key={`i-${a.id}`}>
              <p className="aw-stage__event" style={{ '--d': 0 }}>{a.event}</p>
              <h3 style={{ '--d': 1 }}>{a.title}</h3>
              <p className="aw-stage__desc" style={{ '--d': 2 }}>{a.desc}</p>
              <ul className="aw-stage__tags" style={{ '--d': 3 }}>
                {a.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>

          {/* kontrol */}
          <div className="aw-ctrl">
            <button type="button" onClick={() => go(-1)} aria-label="Sebelumnya">←</button>
            <button type="button" onClick={() => go(1)} aria-label="Berikutnya">→</button>
            <button type="button" className={`aw-ctrl__auto ${auto ? 'on' : ''}`} onClick={() => setAuto((v) => !v)} aria-pressed={auto}>
              {auto ? '❚❚ AUTO' : '▶ AUTO'}
            </button>
            <span className="aw-ctrl__bar" aria-hidden="true">
              <i
                key={`p-${active}-${auto}`}
                style={auto
                  ? { animationDuration: `${AUTO_MS}ms`, animationPlayState: hover || !onScreen ? 'paused' : 'running' }
                  : { animation: 'none', transform: 'scaleX(0)' }}
                onAnimationEnd={() => setActive((x) => (x + 1) % N)}
              />
            </span>
            <span className="aw-ctrl__count">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ===== daftar ===== */}
        <div className="aw-list" role="tablist" aria-label="Daftar penghargaan" onKeyDown={onKey}>
          {awards.map((x, i) => {
            const on = i === active
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on}
                className={`aw-item aw-r ${on ? 'is-on' : ''}`}
                style={{ '--accent': x.accent, '--i': i + 3 }}
                onClick={() => select(i)}
                onMouseMove={onItemMove}
              >
                <span className="aw-item__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="aw-item__body">
                  <small>{x.event}</small>
                  <b>{x.title}</b>
                </span>
                <span className="aw-item__badge">{x.badge}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* lapisan efek */}
      <div className="aw-fx" aria-hidden="true">
        {fx.map((f) => (
          <div key={f.id} className="aw-fx__group" style={{ left: f.x, top: f.y }}>
            {f.text && <span className="aw-fx__text" style={{ color: f.color }}>{f.text}</span>}
            {f.parts.map((p, i) => (
              <i key={i} className="aw-fx__p" style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, background: p.c, width: p.s, height: p.s }} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
