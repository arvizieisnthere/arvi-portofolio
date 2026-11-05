import './hero.css'
import { useEffect, useRef, useState } from 'react'
import { profile, facts } from '../data/profile'
import { heroPhotos } from '../data/heroPhotos'
import useReveal from '../hooks/useReveal'
import { ArrowUpRight, ArrowDown, Download, Camera } from './Icons'

const TONE = { ink: '#14141a', blue: 'var(--blue)', orange: 'var(--orange)' }

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Letters = ({ text, base = 0 }) =>
  [...text].map((ch, i) => <i key={i} style={{ '--i': base + i }}>{ch === ' ' ? '\u00A0' : ch}</i>)

/* ---------- foto di tengah: ganti pose dengan glitch ---------- */
function Portrait() {
  const [alt, setAlt] = useState(false)
  const [touched, setTouched] = useState(false)
  const stack = useRef(null)
  const target = useRef(false)
  const timer = useRef(0)
  const ptype = useRef('mouse')

  const { one, two, cutout } = heroPhotos
  const maskVars = { '--src': `url("${one}"), url("${two}")` }

  // putar ulang animasi glitch
  const fire = () => {
    const el = stack.current
    if (!el || reduced()) return
    el.classList.remove('is-glitch')
    void el.offsetWidth
    el.classList.add('is-glitch')
  }

  const go = (v) => {
    if (target.current === v) return
    target.current = v
    setTouched(true)
    if (reduced()) { setAlt(v); return }
    fire()
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAlt(v), 150) // ganti foto di tengah glitch
  }

  // satu kali "kedip" pembuka sebagai petunjuk bahwa foto ini bisa berubah
  useEffect(() => {
    const t = setTimeout(fire, 2400)
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
      <span className="hx-ring" aria-hidden="true" />
      <span className="hx-blob" aria-hidden="true" />
      <span className="hx-spark hx-spark--a" aria-hidden="true">✦</span>
      <span className="hx-spark hx-spark--b" aria-hidden="true">✦</span>

      <span className="hx-in">
        <span
          ref={stack}
          className="hx-imgs"
          style={maskVars}
          onAnimationEnd={(e) => { if (e.target === stack.current) stack.current.classList.remove('is-glitch') }}
        >
          <img className={`hx-img ${!alt ? 'is-on' : ''}`} src={one} alt="Arvi berdiri, menghadap kamera" draggable="false" />
          <img className={`hx-img ${alt ? 'is-on' : ''}`} src={two} alt="" aria-hidden="true" draggable="false" />
          <span className="hx-ghost hx-ghost--r" aria-hidden="true" />
          <span className="hx-ghost hx-ghost--c" aria-hidden="true" />
        </span>
      </span>

      <span className="hx-cam"><Camera /> {profile.camera}</span>
      <span className="hx-tag hx-tag--purple">{profile.badges.purple}</span>
      <span className="hx-tag hx-tag--white">{profile.badges.white}</span>
      <span className="hx-hint" aria-hidden="true">COBA HOVER FOTO INI ↓</span>
    </button>
  )
}

/* ---------- section ---------- */
export default function Hero() {
  const factsRef = useReveal(0.3)
  const root = useRef(null)
  const raf = useRef(0)

  // parallax halus: judul, foto, dan lingkaran bergerak berlawanan arah
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
      <div className="hx-bg" aria-hidden="true" />
      <h1 className="sr-only">Halo, saya Arvi. {profile.tagline.join(' × ')}</h1>

      <div className="hx-grid">
        {/* kiri */}
        <div className="hx-left">
          <p className="status hx-o1 anim" style={{ '--d': '0ms' }}>
            <span className="status__dot" />
            {profile.status}
          </p>
          <p className="kicker hx-o2 anim" style={{ '--d': '100ms' }}>{profile.kicker}</p>
          <p className="hx-title hx-title--l hx-o3" aria-hidden="true">
            <span className="hx-line"><span><Letters text="HALO," /></span></span>
            <span className="hx-line"><span><Letters text="SAYA" base={5} /></span></span>
          </p>
        </div>

        {/* tengah */}
        <div className="hx-mid"><Portrait /></div>

        {/* kanan */}
        <div className="hx-right">
          <p className="hx-title hx-title--r hx-o4" aria-hidden="true">
            <span className="hx-line"><span><Letters text="ARVI" base={9} /><b className="hx-dot" /></span></span>
          </p>
          <p className="tagline hx-o6 anim" style={{ '--d': '700ms' }}>
            {profile.tagline[0]} <b>×</b> {profile.tagline[1]}
          </p>
          <p className="intro hx-o7 anim" style={{ '--d': '800ms' }}>{profile.intro}</p>
          <div className="actions hx-o8 anim" style={{ '--d': '950ms' }}>
            <a href="#projects" className="btn btn--blue">LIHAT KARYA SAYA <ArrowDown /></a>
            <a href="#contact" className="btn btn--orange">HUBUNGI SAYA <ArrowUpRight /></a>
            <a href={profile.resumeUrl} download className="btn btn--ghost"><Download /> UNDUH RESUME (PDF)</a>
          </div>
        </div>
      </div>

      {/* tiket info: "boarding pass" Arvi */}
      <div ref={factsRef} className="tk-wrap">
        <dl className="tk" aria-label="Info singkat tentang Arvi">
          {facts.map((f, i) => (
            <div key={f.label} className="tk__f" style={{ '--i': i, '--tone': TONE[f.tone] || TONE.ink }}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div className="tk__stub" aria-hidden="true">
            <span className="tk__code" />
            <b>ARVI</b>
            <small>ADMIT ONE · 2026</small>
          </div>
        </dl>
      </div>
    </section>
  )
}
