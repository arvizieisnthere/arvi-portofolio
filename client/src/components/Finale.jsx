import './finale.css'
import { useEffect, useRef, useState } from 'react'
import PixelStage from './PixelStage'
import { links, note, cta } from '../data/contact'

function useTyped(text, go) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (!go || n >= text.length) return
    const t = setTimeout(() => setN(n + 1), 65)
    return () => clearTimeout(t)
  }, [go, n, text])
  return n
}

export default function Finale() {
  const quoteRef = useRef(null)
  const [go, setGo] = useState(false)
  const n = useTyped(note.quote, go)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect() } }, { threshold: 0.4 })
    if (quoteRef.current) io.observe(quoteRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* ===== CATATAN + GAME ===== */}
      <section id="note" className="fin">
        <div className="cab">
          <p className="fin__badge">{note.badge}</p>

          <h2 ref={quoteRef} className="fin__quote" aria-label={note.quote}>
            <span aria-hidden="true">{note.quote.slice(0, n)}<i className={`caret ${n >= note.quote.length ? 'is-idle' : ''}`} /></span>
          </h2>

          <p className="fin__sub">{note.sub}</p>
          <p className="fin__sign">{note.sign}</p>
          <p className="fin__place">{note.place}</p>

          <PixelStage />
        </div>
      </section>

      {/* ===== AJAKAN KOLABORASI ===== */}
      <section id="contact" className="cta">
        <div className="cta__box">
          <div className="cta__copy">
            <p className="cta__eyebrow">{cta.eyebrow}<i className="caret is-idle" /></p>
            <h2 className="cta__title">{cta.title[0]}<br />{cta.title[1]}</h2>
            <p className="cta__text">{cta.text}</p>
          </div>

          <div className="cta__btns">
            {links.filter((l) => l.id !== 'tiktok').map((l, i) => (
              <a
                key={l.id}
                href={l.href}
                className={`pxb ${l.id === 'email' ? 'pxb--orange' : ''}`}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.id === 'email' ? '▶ ' : ''}{l.label}{l.external ? ' ↗' : ''}
              </a>
            ))}
          </div>
        </div>
        <p className="cta__copy-line">{cta.copy}</p>
      </section>
    </>
  )
}
