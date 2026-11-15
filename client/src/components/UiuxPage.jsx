import './uiux.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal'
import { uxIntro, uxTokens, uxAtomic, uxCanvas, uxNext } from '../data/uiuxPage'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, k) => a + (b - a) * k

/* judul section: baris kondensed + baris serif miring, naik dari balik garis saat terlihat */
function Head({ idx, a, b, text }) {
  const ref = useReveal(0.3)
  return (
    <header ref={ref} className="ux-head">
      <p className="ux-idx">{idx}</p>
      <h2 className="ux-h2" aria-label={`${a} ${b}`}>
        <span className="ux-h2a" aria-hidden="true"><span>{a}</span></span>
        <span className="ux-h2b" aria-hidden="true"><span>{b}</span></span>
      </h2>
      {text && <p className="ux-lead">{text}</p>}
    </header>
  )
}

/* =============== INTRO: artboard terpilih ala editor desain =============== */
function Intro() {
  const root = useRef(null)
  const art = useRef(null)
  const cur = useRef(null)
  const [dim, setDim] = useState('')

  // ukuran artboard ditampilkan langsung (angka nyata, bukan hiasan)
  useEffect(() => {
    const el = art.current
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setDim(`${Math.round(r.width)} × ${Math.round(r.height)}`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // kursor "kolaborator" yang membuntuti kursormu dengan sedikit malas
  useEffect(() => {
    if (reduced() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const host = root.current, c = cur.current
    const p = { tx: 0, ty: 0, x: 0, y: 0, on: false }
    let raf = 0
    const tick = () => {
      p.x += (p.tx - p.x) * 0.14
      p.y += (p.ty - p.y) * 0.14
      c.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    const move = (e) => {
      const r = host.getBoundingClientRect()
      p.tx = e.clientX - r.left + 26
      p.ty = e.clientY - r.top + 24
      if (!p.on) { p.on = true; p.x = p.tx; p.y = p.ty; c.style.opacity = 1 }
    }
    const leave = () => { p.on = false; c.style.opacity = 0 }
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <header ref={root} className="ux-intro" data-sec="INTRO">
      <div className="ux-cols" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div>
      <p className="ux-kicker">{uxIntro.kicker}</p>

      <div className="ux-sel">
        <div ref={art} className="ux-art">
          <h1 className="ux-title" aria-label="UI UX dan Design Systems">
            {uxIntro.lines.map((l) => (
              <span key={l} className="ux-tl" aria-hidden="true"><span>{l}</span></span>
            ))}
            <span className="ux-ts" aria-hidden="true"><span>{uxIntro.serif}</span></span>
          </h1>
        </div>
        {Array.from({ length: 8 }, (_, i) => <i key={i} className="ux-hd" aria-hidden="true" />)}
        <span className="ux-chip" aria-hidden="true">{uxIntro.artboard} <b>{dim}</b></span>
      </div>

      <div className="ux-intro__b">
        <p className="ux-lead">{uxIntro.text}</p>
        <p className="ux-cue">{uxIntro.cue} <i aria-hidden="true">↓</i></p>
      </div>

      <div ref={cur} className="ux-cur" aria-hidden="true">
        <svg width="16" height="20" viewBox="0 0 16 20"><path d="M1 1 1 16 5 12.5 8 19 10.5 18 7.5 11.5 13 11.5Z" fill="#fff" stroke="#000" strokeWidth="1" strokeLinejoin="round" /></svg>
        <span>Arvi</span>
      </div>
    </header>
  )
}

/* =============== 01 · TOKEN: playground =============== */
function Playground() {
  const [t, setT] = useState(uxTokens.presets[0])
  const [grid, setGrid] = useState(false)
  const set = (k, v) => setT((s) => ({ ...s, [k]: v, id: 'custom' }))
  const dark = t.theme === 'dark'

  const lines = [
    ['--radius', `${t.r}px`],
    ['--space', `${t.u}px`],
    ['--weight', `${t.fw}`],
    ['--surface', dark ? '#000000' : '#ffffff'],
    ['--accent', dark ? '#ffffff' : '#6D001A'],
  ]

  return (
    <section className="pg" data-sec="01 / TOKEN">
      <Head idx={uxTokens.idx} a={uxTokens.a} b={uxTokens.b} text={uxTokens.text} />

      <div className="pg-wrap">
        {/* kontrol */}
        <div className="pg-ctl">
          <div className="pg-presets" role="group" aria-label="Preset">
            {uxTokens.presets.map((p) => (
              <button key={p.id} type="button" className={t.id === p.id ? 'is-on' : ''} aria-pressed={t.id === p.id}
                onClick={() => setT(p)}>{p.label}</button>
            ))}
          </div>

          <label className="pg-range"><span>Radius <output>{t.r}px</output></span>
            <input type="range" min="0" max="32" step="1" value={t.r} onChange={(e) => set('r', +e.target.value)} /></label>
          <label className="pg-range"><span>Satuan jarak <output>{t.u}px</output></span>
            <input type="range" min="4" max="14" step="1" value={t.u} onChange={(e) => set('u', +e.target.value)} /></label>

          <div className="pg-seg" role="group" aria-label="Ketebalan huruf">
            <span>Ketebalan</span>
            {[400, 600, 800].map((w) => (
              <button key={w} type="button" className={t.fw === w ? 'is-on' : ''} aria-pressed={t.fw === w} onClick={() => set('fw', w)}>{w}</button>
            ))}
          </div>
          <div className="pg-seg" role="group" aria-label="Tema">
            <span>Tema</span>
            {[['dark', 'Gelap'], ['light', 'Terang']].map(([v, l]) => (
              <button key={v} type="button" className={t.theme === v ? 'is-on' : ''} aria-pressed={t.theme === v} onClick={() => set('theme', v)}>{l}</button>
            ))}
          </div>
          <label className="pg-check"><input type="checkbox" checked={grid} onChange={(e) => setGrid(e.target.checked)} /><i aria-hidden="true" /> Tampilkan grid jarak</label>

          <pre className="pg-code" aria-label="Nilai token saat ini"><code>
            <span>{':root {'}</span>
            {lines.map(([k, v]) => <span key={k}>{'  '}{k}: <b>{v}</b>;</span>)}
            <span>{'}'}</span>
          </code></pre>
        </div>

        {/* panggung komponen: semuanya membaca token yang sama */}
        <div className={`pg-stage ${grid ? 'has-grid' : ''}`} data-theme={t.theme}
          style={{ '--r': `${t.r}px`, '--u': `${t.u}px`, '--fw': t.fw }}>
          <div className="pg-card">
            <span className="pg-tag">Sistem</span>
            <h3>Komponen kartu</h3>
            <p>Radius, jarak, dan ketebalan huruf semuanya berasal dari token yang sama.</p>
            <div className="pg-row">
              <button type="button" tabIndex={-1} className="pg-btn">Kirim</button>
              <button type="button" tabIndex={-1} className="pg-btn pg-btn--o">Batal</button>
            </div>
          </div>
          <label className="pg-field"><span>Email</span><input readOnly tabIndex={-1} placeholder="nama@email.com" /></label>
          <div className="pg-misc">
            <span className="pg-sw" aria-hidden="true"><i /></span>
            <span className="pg-chip">Aktif</span>
            <span className="pg-chip pg-chip--o">Draf</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =============== 02 · ATOMIC: perakitan saat scroll =============== */
const OX = 40, OY = 30 // posisi kartu di dalam dunia 560×440
const PIECES = [
  { id: 'img', l: 'IMAGE', w: 432, h: 140, fx: 24, fy: 24, sx: 60, sy: 250, sr: -4 },
  { id: 'ava', l: 'AVATAR', w: 44, h: 44, fx: 24, fy: 184, sx: 480, sy: 110, sr: 12 },
  { id: 'ttl', l: 'HEADING', w: 220, h: 14, fx: 84, fy: 186, sx: 30, sy: 40, sr: -3 },
  { id: 'sub', l: 'TEXT', w: 160, h: 10, fx: 84, fy: 208, sx: 60, sy: 80, sr: 2 },
  { id: 'tag', l: 'TAG', w: 72, h: 26, fx: 24, fy: 246, sx: 300, sy: 130, sr: 9, tx: 'UI' },
  { id: 'tag2', l: 'TAG', w: 88, h: 26, fx: 104, fy: 246, sx: 170, sy: 150, sr: -8, tx: 'SISTEM' },
  { id: 'inp', l: 'INPUT', w: 300, h: 44, fx: 24, fy: 288, sx: 200, sy: 60, sr: 3, tx: 'nama@email.com' },
  { id: 'btn', l: 'BUTTON', w: 120, h: 44, fx: 336, fy: 288, sx: 380, sy: 190, sr: -6, tx: 'Kirim' },
  { id: 'bdg', l: 'BADGE', w: 72, h: 22, fx: 384, fy: 190, sx: 30, sy: 170, sr: 7, tx: 'BARU' },
]
const K = [0, 0.6, 1, 1, 1] // seberapa dekat tiap potongan ke posisi akhir pada tiap tahap

function Atomic() {
  const sec = useRef(null)
  const stageEl = useRef(null)
  const [stage, setStage] = useState(0)
  const n = uxAtomic.stages.length

  useEffect(() => {
    const el = sec.current, st = stageEl.current
    let raf = 0, last = -1
    const calc = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 0.9999)
      el.style.setProperty('--p', p.toFixed(4))
      const s = Math.floor(p * n)
      if (s !== last) { last = s; setStage(s) }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(calc) }
    const fit = () => {
      const b = st.getBoundingClientRect()
      st.style.setProperty('--sc', Math.min(b.width / 560, b.height / 440, 1.15).toFixed(3))
    }
    const ro = new ResizeObserver(fit); ro.observe(st)
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    fit(); calc()
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [n])

  const k = K[stage]
  return (
    <section ref={sec} className="at" data-sec="02 / ATOMIC">
      <div className="at-pin">
        <div className="at-side">
          <Head idx={uxAtomic.idx} a={uxAtomic.a} b={uxAtomic.b} />
          <ol className="at-steps">
            {uxAtomic.stages.map((s, i) => (
              <li key={s.name} className={i === stage ? 'is-on' : i < stage ? 'is-done' : ''}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <div><b>{s.name}</b><p>{s.d}</p></div>
              </li>
            ))}
          </ol>
          <div className="at-prog" aria-hidden="true"><i /></div>
        </div>

        <div ref={stageEl} className="at-stage" data-s={stage} role="img"
          aria-label={`Antarmuka dirakit bertahap. Tahap ${stage + 1}: ${uxAtomic.stages[stage].name}`}>
          <div className="at-world">
            <div className="at-card" style={{ left: OX, top: OY }} />
            <div className="at-grid" style={{ left: OX, top: OY }} />
            {PIECES.map((p, i) => (
              <div key={p.id} className={`at-pc at-pc--${p.id}`} data-l={p.l}
                style={{
                  width: p.w, height: p.h, '--i': i,
                  transform: `translate(${lerp(p.sx, p.fx + OX, k).toFixed(1)}px, ${lerp(p.sy, p.fy + OY, k).toFixed(1)}px) rotate(${lerp(p.sr, 0, k).toFixed(2)}deg)`,
                }}>
                {p.id === 'img' && (uxAtomic.image ? <img className="at-im" src={uxAtomic.image} alt="" draggable="false" /> : <i className="at-im at-im--ph" />)}
                {p.tx && <span className="at-tx">{p.tx}</span>}
              </div>
            ))}
          </div>
          <p className="at-label" aria-hidden="true">TAHAP {stage + 1}/{n} — {uxAtomic.stages[stage].name}</p>
        </div>
      </div>
    </section>
  )
}

/* =============== 03 · CANVAS: peta alur yang bisa digeser & di-zoom =============== */
const FRAMES = [
  { x: 120, y: 110, f: 1, v: 0, t: 'Splash' }, { x: 500, y: 110, f: 1, v: 1, t: 'Registrasi' },
  { x: 880, y: 110, f: 1, v: 2, t: 'Login' }, { x: 1260, y: 110, f: 1, v: 0, t: 'Beranda' },
  { x: 120, y: 390, f: 2, v: 1, t: 'Daftar donasi' }, { x: 500, y: 390, f: 2, v: 2, t: 'Detail' },
  { x: 880, y: 390, f: 2, v: 0, t: 'Bayar' }, { x: 1260, y: 390, f: 2, v: 1, t: 'Struk' },
  { x: 120, y: 670, f: 3, v: 2, t: 'Riwayat' }, { x: 500, y: 670, f: 3, v: 0, t: 'Verifikasi' },
  { x: 880, y: 670, f: 3, v: 1, t: 'Transparansi' },
]
const INNER = [
  <>
    <rect x="20" y="46" width="220" height="64" className="cv-fill" />
    <rect x="20" y="124" width="150" height="8" className="cv-fill" />
    <rect x="20" y="140" width="100" height="8" className="cv-fill" />
  </>,
  <>
    <rect x="20" y="46" width="104" height="60" className="cv-fill" />
    <rect x="136" y="46" width="104" height="60" className="cv-fill" />
    <rect x="20" y="122" width="220" height="28" className="cv-solid" />
  </>,
  <>
    <rect x="20" y="46" width="220" height="20" className="cv-fill" />
    <rect x="20" y="74" width="220" height="20" className="cv-fill" />
    <rect x="20" y="102" width="220" height="20" className="cv-fill" />
    <rect x="150" y="132" width="90" height="22" className="cv-solid" />
  </>,
]

function FlowSvg() {
  const rows = [FRAMES.slice(0, 4), FRAMES.slice(4, 8), FRAMES.slice(8)]
  return (
    <svg className="cv-svg" viewBox="0 0 1600 900" width="1600" height="900" aria-hidden="true">
      {rows.map((row) => row.slice(0, -1).map((a, i) => {
        const b = row[i + 1], y = a.y + 85
        return (
          <g key={`${a.t}-${b.t}`} className="cv-ln">
            <path d={`M${a.x + 260} ${y} H${b.x - 4}`} />
            <path d={`M${b.x - 12} ${y - 5} L${b.x - 3} ${y} L${b.x - 12} ${y + 5}`} />
          </g>
        )
      }))}
      <path className="cv-ln cv-dash" d="M1390 280 C1390 350 250 330 250 390" />
      {[1, 2, 3].map((n) => {
        const f = FRAMES.find((q) => q.f === n)
        return (
          <g key={n} transform={`translate(${f.x} ${f.y - 52})`}>
            <rect width="74" height="22" className="cv-tag" />
            <text x="10" y="15" className="cv-tagt">Flow {n}</text>
          </g>
        )
      })}
      {FRAMES.map((f) => (
        <g key={f.t} transform={`translate(${f.x} ${f.y})`}>
          <text x="0" y="-10" className="cv-ft">{f.t}</text>
          <rect width="260" height="170" className="cv-fr" />
          <rect width="260" height="28" className="cv-hd" />
          <circle cx="14" cy="14" r="3" className="cv-dot" /><circle cx="26" cy="14" r="3" className="cv-dot" /><circle cx="38" cy="14" r="3" className="cv-dot" />
          {INNER[f.v]}
        </g>
      ))}
    </svg>
  )
}

function Canvas() {
  const box = useRef(null)
  const world = useRef(null)
  const view = useRef({ x: 0, y: 0, k: 1 })
  const ptrs = useRef(new Map())
  const pinch = useRef(0)
  const [zoom, setZoom] = useState(100)
  const [pin, setPin] = useState(-1)
  const [grab, setGrab] = useState(false)
  const W = uxCanvas.world

  const apply = () => {
    const { x, y, k } = view.current
    world.current.style.transform = `translate(${x}px, ${y}px) scale(${k})`
    box.current.style.setProperty('--k', k)
    box.current.style.backgroundPosition = `${x}px ${y}px`
    box.current.style.backgroundSize = `${24 * k}px ${24 * k}px`
  }
  const zoomAt = (cx, cy, f) => {
    const v = view.current
    const nk = clamp(v.k * f, 0.25, 3)
    const r = nk / v.k
    v.x = cx - (cx - v.x) * r
    v.y = cy - (cy - v.y) * r
    v.k = nk
    apply(); setZoom(Math.round(nk * 100))
  }
  const fit = () => {
    const r = box.current.getBoundingClientRect()
    const k = Math.min(r.width / W.w, r.height / W.h) * 0.94
    view.current = { k, x: (r.width - W.w * k) / 2, y: (r.height - W.h * k) / 2 }
    apply(); setZoom(Math.round(k * 100))
  }

  useEffect(() => {
    const el = box.current
    fit()
    const ro = new ResizeObserver(fit); ro.observe(el)
    // zoom hanya saat Ctrl/Cmd ditahan, supaya scroll halaman tidak "tersangkut" di kanvas
    const onWheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.01))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => { ro.disconnect(); el.removeEventListener('wheel', onWheel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const down = (e) => {
    box.current.setPointerCapture(e.pointerId)
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; pinch.current = Math.hypot(a.x - b.x, a.y - b.y) }
    setGrab(true)
  }
  const move = (e) => {
    const p = ptrs.current.get(e.pointerId)
    if (!p) return
    const dx = e.clientX - p.x, dy = e.clientY - p.y
    p.x = e.clientX; p.y = e.clientY
    if (ptrs.current.size === 1) { view.current.x += dx; view.current.y += dy; apply() }
    else if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y), r = box.current.getBoundingClientRect()
      if (pinch.current) zoomAt((a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, d / pinch.current)
      pinch.current = d
    }
  }
  const up = (e) => { ptrs.current.delete(e.pointerId); pinch.current = 0; if (!ptrs.current.size) setGrab(false) }

  const step = (f) => { const r = box.current.getBoundingClientRect(); zoomAt(r.width / 2, r.height / 2, f) }
  const key = (e) => {
    const v = view.current
    if (e.key === 'ArrowLeft') { v.x += 40; apply() }
    else if (e.key === 'ArrowRight') { v.x -= 40; apply() }
    else if (e.key === 'ArrowUp') { v.y += 40; apply() }
    else if (e.key === 'ArrowDown') { v.y -= 40; apply() }
    else if (e.key === '+' || e.key === '=') step(1.25)
    else if (e.key === '-') step(0.8)
    else if (e.key === '0') fit()
    else return
    e.preventDefault()
  }

  return (
    <div className="cv-wrap">
      <div ref={box} className={`cv ${grab ? 'is-grab' : ''}`} tabIndex={0} role="application"
        aria-label="Kanvas alur desain. Panah untuk menggeser, plus dan minus untuk zoom, nol untuk menyesuaikan."
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key}>
        <div ref={world} className="cv-world" style={{ width: W.w, height: W.h }}>
          {uxCanvas.image ? <img className="cv-img" src={uxCanvas.image} alt="Alur desain di Figma" draggable="false" /> : <FlowSvg />}
          {uxCanvas.pins.map((p, i) => (
            <button key={p.t} type="button" className={`cv-pin ${pin === i ? 'is-on' : ''}`} style={{ left: p.x, top: p.y }}
              aria-label={`Catatan ${i + 1}: ${p.t}`} aria-expanded={pin === i}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setPin(pin === i ? -1 : i)}>{i + 1}</button>
          ))}
        </div>

        <div className="cv-ui" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => step(0.8)} aria-label="Perkecil">−</button>
          <output>{zoom}%</output>
          <button type="button" onClick={() => step(1.25)} aria-label="Perbesar">+</button>
          <button type="button" onClick={fit} className="cv-fit">FIT</button>
        </div>
        <p className="cv-hint" aria-hidden="true">SERET = GESER · CTRL + SCROLL = ZOOM</p>

        {pin >= 0 && (
          <aside className="cv-note" onPointerDown={(e) => e.stopPropagation()} aria-live="polite">
            <span>{String(pin + 1).padStart(2, '0')} / {String(uxCanvas.pins.length).padStart(2, '0')}</span>
            <b>{uxCanvas.pins[pin].t}</b>
            <p>{uxCanvas.pins[pin].d}</p>
            <button type="button" onClick={() => setPin(-1)} aria-label="Tutup catatan">✕</button>
          </aside>
        )}
      </div>
    </div>
  )
}

/* =============== halaman =============== */
export default function UiuxPage() {
  const [now, setNow] = useState('INTRO')

  useEffect(() => {
    const prev = document.title
    document.title = 'UI/UX & Design Systems — ARVI'
    return () => { document.title = prev }
  }, [])

  // label di bilah atas mengikuti section yang sedang dibaca
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setNow(e.target.dataset.sec) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('[data-sec]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="ux">
      <div className="ux-top">
        <Link to={{ pathname: '/', hash: '#interests' }} className="ux-back"><i aria-hidden="true">←</i> Kembali</Link>
        <p className="ux-now" aria-live="polite">{now}</p>
        <Link to="/" className="ux-logo" aria-label="ARVI, ke beranda">ARVI<i /></Link>
      </div>

      <Intro />
      <Playground />
      <Atomic />

      <section className="cvs" data-sec={uxCanvas.idx}>
        <Head idx={uxCanvas.idx} a={uxCanvas.a} b={uxCanvas.b} text={uxCanvas.text} />
        <Canvas />
      </section>

      <footer className="ux-end">
        <p>MASIH ADA BIDANG LAIN</p>
        <Link to={uxNext.href} className="ux-next"><span>{uxNext.label}</span><b aria-hidden="true">→</b></Link>
        <Link to={{ pathname: '/', hash: '#interests' }} className="ux-end__back">← Kembali ke semua bidang</Link>
      </footer>
    </div>
  )
}
