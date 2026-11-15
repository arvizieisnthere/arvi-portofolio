import './hero.css'
import { useEffect, useRef, useState } from 'react'
import { profile, facts } from '../data/profile'
import { heroPhotos } from '../data/heroPhotos'
import useReveal from '../hooks/useReveal'
import { ArrowUpRight, ArrowDown, Download } from './Icons'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const pad = (n) => String(n).padStart(2, '0')

const Letters = ({ text, base = 0 }) =>
  [...text].map((ch, i) => <i key={i} style={{ '--i': base + i }}>{ch === ' ' ? '\u00A0' : ch}</i>)

/* timecode kamera yang berjalan (25 fps) */
function Timecode() {
  const ref = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const t0 = performance.now()
    const id = setInterval(() => {
      const ms = performance.now() - t0
      if (ref.current) ref.current.textContent =
        `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}:${pad(Math.floor(ms / 40) % 25)}`
    }, 40)
    return () => clearInterval(id)
  }, [])
  return <span ref={ref}>00:00:00:00</span>
}

/* ---------- foto: hover = "CUT" ke pose kedua dengan glitch ---------- */
function Portrait() {
  const [alt, setAlt] = useState(false)
  const [touched, setTouched] = useState(false)
  const stack = useRef(null)
  const moonRef = useRef(null)
  const target = useRef(false)
  const timer = useRef(0)
  const ptype = useRef('mouse')

  const { one, two, cutout, moonOne, moonTwo } = heroPhotos
  const maskVars = { '--src': `url("${one}"), url("${two}")` }

  const fire = () => {
    const el = stack.current
    if (!el || reduced()) return
    el.classList.remove('is-glitch'); void el.offsetWidth; el.classList.add('is-glitch')
    const m = moonRef.current
    if (m) { m.classList.remove('is-glitch'); void m.offsetWidth; m.classList.add('is-glitch') }
  }

  const go = (v) => {
    if (target.current === v) return
    target.current = v
    setTouched(true)
    if (reduced()) { setAlt(v); return }
    fire()
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAlt(v), 150)
  }

  useEffect(() => {
    const t = setTimeout(fire, 2600) // satu kedipan pembuka
    return () => { clearTimeout(t); clearTimeout(timer.current) }
  }, [])

  return (
    <button
      type="button"
      className={`hx-photo ${alt ? 'is-alt' : ''} ${cutout ? '' : 'is-boxed'} ${touched ? 'is-touched' : ''}`}
      aria-label="Foto Arvi. Arahkan kursor atau tekan untuk mengganti pose."
      aria-pressed={alt}
      onPointerDown={(e) => { ptype.current = e.pointerType }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && go(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && go(false)}
      onClick={() => { if (ptype.current !== 'mouse') go(!target.current); ptype.current = 'key' }}
      onFocus={() => go(true)}
      onBlur={() => go(false)}
    >
      {/* bulan: PNG milikmu, atau cakram hitam-putih kalau belum ada */}
      {moonOne ? (
        <span className="hx-moon" aria-hidden="true">
          <span
            ref={moonRef}
            className="hx-moon__in"
            onAnimationEnd={(e) => { if (e.target === moonRef.current) moonRef.current.classList.remove('is-glitch') }}
          >
            <img className={!alt ? 'is-on' : ''} src={moonOne} alt="" draggable="false" />
            <img className={alt ? 'is-on' : ''} src={moonTwo} alt="" draggable="false" />
          </span>
        </span>
      ) : (
        <span className="hx-disc" aria-hidden="true" />
      )}

      <span className="hx-in">
        <span
          ref={stack}
          className="hx-imgs"
          style={maskVars}
          onAnimationEnd={(e) => { if (e.target === stack.current) stack.current.classList.remove('is-glitch') }}
        >
          <img className={`hx-img ${!alt ? 'is-on' : ''}`} src={one} alt="Arvi berdiri, menghadap kamera" draggable="false" />
          <img className={`hx-img ${alt ? 'is-on' : ''}`} src={two} alt="" aria-hidden="true" draggable="false" />
          <span className="hx-ghost hx-ghost--a" aria-hidden="true" />
          <span className="hx-ghost hx-ghost--b" aria-hidden="true" />
        </span>
      </span>

      {/* kotak autofocus: mengunci saat pose berganti */}
      <span className="hx-af" aria-hidden="true">
        <i /><i /><i /><i />
        <b><span>AF-C</span><span>LOCK</span></b>
      </span>

      <span className="hx-hint" aria-hidden="true">
        <span className="hx-hint__m">HOVER = CUT</span>
        <span className="hx-hint__t">TAP = CUT</span>
      </span>
    </button>
  )
}

/* ---------- section ---------- */
export default function Hero() {
  const specRef = useReveal(0.3)
  const root = useRef(null)
  const raf = useRef(0)

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced()) return
    const { clientX, clientY } = e
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const el = root.current
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', (((clientX - r.left) / r.width - 0.5) * 2).toFixed(3))
      el.style.setProperty('--my', (((clientY - r.top) / r.height - 0.5) * 2).toFixed(3))
    })
  }

  return (
    <section id="top" className="hx" ref={root} onPointerMove={onMove}>
      <h1 className="sr-only">Halo, saya Arvi. {profile.tagline.join(' × ')}</h1>

      <div className="hx-panel" aria-hidden="true" />
      <div className="hx-vig" aria-hidden="true" />
      <div className="hx-grain" aria-hidden="true" />
      <div className="hx-frame" aria-hidden="true"><i /><i /><i /><i /></div>
      <p className="hx-vert" aria-hidden="true">{profile.badges.purple} — {profile.badges.white}</p>

      {/* baris atas: seperti overlay monitor kamera */}
      <div className="hx-bar">
        <p className="hx-bar__l"><span className="hx-rec" />REC <Timecode /> <em>/ {profile.camera}</em></p>
        <p className="hx-bar__c">{profile.kicker}</p>
        <p className="hx-bar__r">{profile.status}</p>
      </div>

      <div className="hx-stage">
        <div className="hx-head" aria-hidden="true">
          <p className="hx-hello"><span>Halo, saya</span></p>
          <p className="hx-title">
            <span className="hx-line"><span><Letters text="ARVI" /><b className="hx-dot" /></span></span>
          </p>
        </div>

        <div className="hx-mid"><Portrait /></div>

        <div className="hx-copy">
          <p className="hx-tag">{profile.tagline[0]} <em>×</em> {profile.tagline[1]}</p>
          <p className="hx-intro">{profile.intro}</p>
          <div className="hx-cta">
            <a href="#projects" className="hx-btn hx-btn--solid"><span>Lihat karya saya</span><ArrowDown /></a>
            <a href="#contact" className="hx-btn hx-btn--line"><span>Hubungi saya</span><ArrowUpRight /></a>
            <a href={profile.resumeUrl} download className="hx-btn hx-btn--text"><Download /><span>Unduh resume (PDF)</span></a>
          </div>
        </div>
      </div>

      {/* data diri sebagai "metadata" */}
      <dl ref={specRef} className="hx-spec" aria-label="Info singkat tentang Arvi">
        {facts.map((f, i) => (
          <div key={f.label} className="hx-spec__i" style={{ '--i': i }}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
        <div className="hx-spec__scroll" aria-hidden="true"><span>SCROLL</span><i /></div>
      </dl>
    </section>
  )
}
