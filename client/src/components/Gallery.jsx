import './gallery.css'
import { useEffect, useRef, useState } from 'react'
import { gallery, galleryIntro } from '../data/gallery'
import useReveal from '../hooks/useReveal'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const pad = (n) => String(n).padStart(2, '0')

/* satu lapisan foto (atau penanda kosong kalau fotonya belum ada) */
const pic = (photo, cls, alt, key) =>
  photo.src
    ? <img key={key} className={cls} src={photo.src} alt={alt} draggable="false" />
    : <div key={key} className={`${cls} gl-ph`} role="img" aria-label={alt || photo.label}><span>{photo.label}</span></div>

/* =============================================================
   SATU CETAKAN. Klik = "jepret": layar berkedip putih seperti lampu kilat,
   lalu foto berikutnya masuk menyapu dari kanan. Setelah foto terakhir,
   film "digulung balik" ke foto pertama (menyapu dari kiri).
   ============================================================= */
function Tile({ item, i }) {
  const N = item.photos.length
  const [idx, setIdx] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [snap, setSnap] = useState(0)
  const [rew, setRew] = useState(false)

  // muat semua foto kartu ini lebih awal supaya jepretan tidak tersendat
  useEffect(() => { item.photos.forEach((p) => { if (p.src) new Image().src = p.src }) }, [item])

  const shoot = () => {
    if (N < 2) return
    const next = (idx + 1) % N
    setPrev(idx)
    setRew(next === 0)
    setIdx(next)
    setSnap((s) => s + 1)
  }

  return (
    <li className="gl-li" style={{ '--i': i }}>
      <button type="button" className="gl-btn" onClick={shoot}
        aria-label={`${item.alt}. Foto ${idx + 1} dari ${N}. Tekan untuk melihat foto berikutnya.`}>
        <span className="gl-fr">
          {prev >= 0 && pic(item.photos[prev], 'gl-pic gl-pic--prev', '', `p-${snap}`)}
          {pic(item.photos[idx], `gl-pic gl-pic--cur ${snap > 0 ? 'is-adv' : ''} ${rew ? 'is-rew' : ''}`, `${item.alt} (foto ${idx + 1})`, `c-${snap}`)}
          {snap > 0 && <i key={snap} className="gl-flash" aria-hidden="true" />}
          <i className="gl-br gl-br--a" aria-hidden="true" /><i className="gl-br gl-br--b" aria-hidden="true" />
          <i className="gl-br gl-br--c" aria-hidden="true" /><i className="gl-br gl-br--d" aria-hidden="true" />
          <span className="gl-hint" aria-hidden="true">KLIK = JEPRET</span>
        </span>

        <span className="gl-cap">
          <b className="gl-no">{pad(i + 1)}</b>
          <span className="gl-alt">{item.alt}</span>
          <span className="gl-pips" aria-hidden="true">
            {item.photos.map((_, k) => <i key={k} className={k === idx ? 'on' : ''} />)}
          </span>
        </span>
      </button>
    </li>
  )
}

export default function Gallery() {
  const headRef = useReveal(0.25)
  const gridRef = useReveal(0.06)

  // tiap cetakan melayang dengan kecepatan berbeda saat discroll (satu variabel saja, murah)
  useEffect(() => {
    const el = gridRef.current
    if (!el || reduced()) return
    let raf = 0
    const on = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const v = clamp((r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight * 0.9 + r.height / 2), -1, 1)
      el.style.setProperty('--sy', v.toFixed(3))
    }
    const h = () => { if (!raf) raf = requestAnimationFrame(on) }
    on()
    window.addEventListener('scroll', h, { passive: true })
    window.addEventListener('resize', h)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', h); window.removeEventListener('resize', h) }
  }, [gridRef])

  // judul: dua kata pertama kondensed, sisanya serif miring
  const words = galleryIntro.title.split(' ')
  const lead = words.slice(0, 2).join(' ')
  const serif = `${words.slice(2).join(' ').toLowerCase()}.`
  const frames = gallery.reduce((n, g) => n + g.photos.length, 0)

  return (
    <section id="snap" className="gl">
      <header ref={headRef} className="gl-head">
        <div>
          <p className="gl-eyebrow">{galleryIntro.eyebrow}</p>
          <h2 className="gl-title" aria-label={galleryIntro.title}>
            <span className="gl-t1" aria-hidden="true"><span>{lead}</span></span>
            <span className="gl-t2" aria-hidden="true"><span>{serif}</span></span>
          </h2>
        </div>
        <p className="gl-lead">{galleryIntro.text}</p>
      </header>

      <ul ref={gridRef} className="gl-grid">
        {gallery.map((item, i) => <Tile key={item.id} item={item} i={i} />)}
      </ul>

      <p className="gl-foot" aria-hidden="true">
        <span>{pad(gallery.length)} SERI</span><i /><span>{pad(frames)} FRAME</span><i /><span>KLIK UNTUK MENJEPRET</span>
      </p>
    </section>
  )
}
