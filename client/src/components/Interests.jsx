import './interests.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { interests, interestsIntro } from '../data/interests'
import useReveal from '../hooks/useReveal'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" aria-hidden="true">
    <path d="M6 18 18 6M8 6h10v10" />
  </svg>
)

export default function Interests() {
  const headRef = useReveal(0.25)
  const listRef = useReveal(0.1)
  const pv = useRef(null)
  const pos = useRef({ tx: 0, ty: 0, x: 0, y: 0 })
  const [active, setActive] = useState(-1)
  const [zoom, setZoom] = useState(null) // { it, r:{left,top,width,height}, go }
  const navigate = useNavigate()
  const lastActive = useRef(0) // foto terakhir yang ditampilkan
  if (active >= 0) lastActive.current = active

  const track = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = listRef.current.getBoundingClientRect()
    pos.current.tx = e.clientX - r.left
    pos.current.ty = e.clientY - r.top
  }
  const enter = (i, e) => {
    if (e.pointerType !== 'mouse') return
    track(e)
    if (active === -1) { pos.current.x = pos.current.tx; pos.current.y = pos.current.ty }
    setActive(i)
  }
  const focus = (i, e) => {
    const lr = listRef.current.getBoundingClientRect()
    const rr = e.currentTarget.getBoundingClientRect()
    pos.current.tx = rr.left - lr.left + rr.width * 0.58
    pos.current.ty = rr.top - lr.top + rr.height / 2
    if (active === -1) { pos.current.x = pos.current.tx; pos.current.y = pos.current.ty }
    setActive(i)
  }

  const open = (e, it) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1 || zoom) return
    e.preventDefault()
    const go = () => (/^https?:/.test(it.href) ? window.location.assign(it.href) : navigate(it.href))
    if (reduced()) { go(); return }

    // asal animasi: foto pratinjau (mouse) atau gambar kecil di dalam baris (sentuh)
    const pvEl = pv.current
    const thumb = e.currentTarget.querySelector('.int-thumb')
    const useThumb = thumb && thumb.offsetParent !== null
    const el = useThumb ? thumb : pvEl && active >= 0 ? pvEl : e.currentTarget
    const b = el.getBoundingClientRect()
    const w = el.offsetWidth || b.width, h = el.offsetHeight || b.height // abaikan kemiringan
    const r = { left: b.left + (b.width - w) / 2, top: b.top + (b.height - h) / 2, width: w, height: h }

    setZoom({ it, r, go: false })
    requestAnimationFrame(() => requestAnimationFrame(() => setZoom((z) => z && { ...z, go: true })))
    setTimeout(go, 1000)
    setTimeout(() => setZoom(null), 1500) // jaga-jaga kalau halaman tujuan belum ada
  }

  useEffect(() => { interests.forEach((it) => { if (it.image) new Image().src = it.image }) }, [])

  // pratinjau foto mengikuti kursor dengan sedikit "malas" (lerp) dan miring sesuai kecepatan
  useEffect(() => {
    if (active < 0 || reduced()) return
    const el = pv.current, list = listRef.current
    if (!el || !list) return
    const w = el.offsetWidth, h = el.offsetHeight
    let raf = 0
    const tick = () => {
      const p = pos.current
      const tx = Math.min(Math.max(p.tx + 40, 0), list.clientWidth - w)
      const ty = Math.min(Math.max(p.ty - h / 2, 0), list.clientHeight - h)
      const vx = tx - p.x
      p.x += (tx - p.x) * 0.13
      p.y += (ty - p.y) * 0.13
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${Math.max(-8, Math.min(8, vx * 0.05)).toFixed(2)}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active >= 0])

  return (
    <section id="interests" className="int">
      {/* ===== kepala: blok burgundy ===== */}
      <header ref={headRef} className="int-head">
        <div className="int-grain" aria-hidden="true" />
        <div className="int-head__l">
          <p className="int-eyebrow">{interestsIntro.eyebrow}</p>
          <h2 className="int-title" aria-label={interestsIntro.title}>
            <span className="int-t1" aria-hidden="true"><span>{interestsIntro.lead}</span></span>
            <span className="int-t2" aria-hidden="true"><span>{interestsIntro.serif}</span></span>
          </h2>
        </div>
        <div className="int-head__r">
          <p className="int-lead">{interestsIntro.text}</p>
          <p className="int-hint" aria-hidden="true">
            <span className="int-hint__m">ARAHKAN KURSOR KE TIAP BARIS</span>
            <span className="int-hint__t">SENTUH BARIS UNTUK MEMBUKA</span>
          </p>
        </div>
      </header>

      {/* ===== indeks bidang ===== */}
      <div
        ref={listRef}
        className="int-list"
        data-active={active >= 0 ? 'true' : undefined}
        onPointerMove={track}
        onPointerLeave={() => setActive(-1)}
      >
        <ol className="int-ol">
        {interests.map((it, i) => (
          <li key={it.id} className={`int-row ${active === i ? 'is-active' : ''}`} style={{ '--i': i }}>
            <a
              href={it.href}
              className="int-link"
              aria-label={`${it.title} — lihat detail`}
              onPointerEnter={(e) => enter(i, e)}
              onFocus={(e) => focus(i, e)}
              onBlur={() => setActive(-1)}
              onClick={(e) => open(e, it)}
            >
              <span className="int-no">{it.no}</span>
              <span className="int-ttl"><span>{it.title}</span></span>
              <span className="int-meta">
                <em>{it.label}</em>
                <span>{it.tags.join(' / ')}</span>
              </span>
              <span className="int-go"><Arrow /></span>
              <span className="int-thumb" aria-hidden="true">
                {it.image ? <img src={it.image} alt="" loading="lazy" draggable="false" /> : <b>{it.no}</b>}
              </span>
            </a>
          </li>
        ))}
        </ol>

        <div ref={pv} className={`int-pv ${active >= 0 ? 'is-on' : ''}`} aria-hidden="true">
          <div key={lastActive.current} className="int-pv__f">
            {interests[lastActive.current].image
              ? <img src={interests[lastActive.current].image} alt="" draggable="false" />
              : <b>{interests[lastActive.current].no}</b>}
          </div>
          <span className="int-pv__cta">KLIK UNTUK MEMBUKA ↗</span>
        </div>
      </div>

      {/* transisi: foto membesar memenuhi layar */}
      {zoom && (
        <div
          className={`int-zoom ${zoom.go ? 'is-go' : ''}`}
          style={zoom.go ? undefined : { left: zoom.r.left, top: zoom.r.top, width: zoom.r.width, height: zoom.r.height }}
          aria-hidden="true"
        >
          {zoom.it.image ? <img src={zoom.it.image} alt="" /> : <b>{zoom.it.no}</b>}
          <p className="int-zoom__t"><span>{zoom.it.no} / {zoom.it.label}</span>{zoom.it.title}</p>
        </div>
      )}
    </section>
  )
}
