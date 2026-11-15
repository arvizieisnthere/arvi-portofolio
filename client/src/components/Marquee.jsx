import './marquee.css'
import { useEffect, useRef } from 'react'
import { marqueeItems } from '../data/profile'

function Seq({ hidden = false, seqRef }) {
  return (
    <ul ref={seqRef} className="mq-seq" aria-hidden={hidden || undefined}>
      {marqueeItems.map((t, i) => (
        <li key={t} className={i % 2 ? 'is-out' : ''}>
          <span>{t}</span><i />
        </li>
      ))}
    </ul>
  )
}

/* Pita kata: kecepatannya mengikuti scroll, dan arahnya berbalik saat kamu scroll ke atas. */
export default function Marquee() {
  const root = useRef(null)
  const track = useRef(null)
  const seq = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    let x = 0, cur = 0, dir = -1, boost = 0, hover = false, visible = true
    let w = seq.current.offsetWidth
    let last = window.scrollY, raf = 0

    const ro = new ResizeObserver(() => { w = seq.current.offsetWidth })
    ro.observe(seq.current)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(root.current)

    const onScroll = () => {
      const y = window.scrollY, d = y - last
      last = y
      if (d !== 0) { dir = d > 0 ? -1 : 1; boost = Math.min(Math.abs(d), 70) * 0.28 }
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      boost *= 0.92
      const target = dir * (1.1 + boost) * (hover ? 0.25 : 1)
      cur += (target - cur) * 0.07
      x += cur
      if (x <= -w) x += w
      if (x > 0) x -= w
      track.current.style.transform = `translate3d(${x}px,0,0)`
    }
    const over = () => { hover = true }
    const out = () => { hover = false }
    const el = root.current
    el.addEventListener('pointerenter', over)
    el.addEventListener('pointerleave', out)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerenter', over); el.removeEventListener('pointerleave', out)
    }
  }, [])

  return (
    <div ref={root} className="mq" role="region" aria-label="Bidang keahlian">
      <div ref={track} className="mq-track">
        <Seq seqRef={seq} />
        <Seq hidden />
      </div>
    </div>
  )
}
