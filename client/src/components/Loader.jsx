import './loader.css'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* =============================================================
   OPENING ±3 DETIK — "kamera menyala"
   1. Piringan burgundy (bulan) terbit dari bawah, sementara kata ARVI
      terisi putih dari bawah ke atas (= proses memuat, tanpa bilah progres).
   2. Setelah penuh, kotak autofokus mengunci → lampu kilat putih →
   3. dua daun rana (atas & bawah) membuka, situs di baliknya mulai beranda.
   Saat berjalan, animasi situs di belakangnya DITAHAN (lihat loader.css),
   lalu dilepas tepat ketika rana mulai membuka.
   ============================================================= */
const DUR = 1850        // lamanya "memuat" (ms)
const pad = (n, l = 2) => String(n).padStart(l, '0')
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export default function Loader() {
  const [s, setS] = useState('run') // run → lock → flash → open → done
  const root = useRef(null)
  const num = useRef(null)
  const tc = useRef(null)

  // kunci scroll & tahan animasi situs SEBELUM layar pertama digambar
  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.add('is-loading', 'is-locked')
    return () => html.classList.remove('is-loading', 'is-locked')
  }, [])

  useEffect(() => {
    const html = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const D = reduce ? 600 : DUR
    const t0 = performance.now()
    let raf = 0

    const tick = (now) => {
      const ms = now - t0
      const e = ease(Math.min(1, ms / D))
      if (root.current) root.current.style.setProperty('--p', e.toFixed(4))
      if (num.current) num.current.textContent = pad(Math.round(e * 100), 3)
      if (tc.current) tc.current.textContent = `00:00:${pad(Math.floor(ms / 1000) % 60)}:${pad(Math.floor(ms / 40) % 25)}`
      if (ms < D) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const timers = [
      setTimeout(() => setS('lock'), D),
      setTimeout(() => setS('flash'), D + 220),
      setTimeout(() => { setS('open'); html.classList.remove('is-loading') }, D + 440), // situs mulai bergerak di balik rana
      setTimeout(() => { html.classList.remove('is-locked'); setS('done') }, D + 440 + 900),
    ]
    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout) }
  }, [])

  if (s === 'done') return null

  return createPortal(
    <div ref={root} className="boot" data-s={s} role="status" aria-live="polite">
      <p className="boot__sr">Memuat portofolio Arvi…</p>

      <div className="boot__p boot__p--t" />
      <div className="boot__p boot__p--b" />

      <div className="boot__c" aria-hidden="true">
        <div className="boot__disc" />

        <i className="boot__k boot__k--a" /><i className="boot__k boot__k--b" />
        <i className="boot__k boot__k--c" /><i className="boot__k boot__k--d" />

        <p className="boot__t boot__t--l"><span className="boot__rec" />REC <span ref={tc}>00:00:00:00</span></p>
        <p className="boot__t boot__t--r">PORTFOLIO — ARVI 2026</p>

        <div className="boot__word">
          <span className="boot__w0">Wait...</span>
          <span className="boot__w1">Wait...</span> 
        </div>

        <div className="boot__af">
          <i /><i /><i /><i />
          <span><em>AF-C</em><em>▸ LOCK</em></span>
        </div>

        <p className="boot__n"><span ref={num}>000</span><small>%</small></p>
        <p className="boot__t boot__t--br">TANGERANG, ID</p>
      </div>

      <i className="boot__slit" />
      <div className="boot__flash" />
    </div>,
    document.body,
  )
}
