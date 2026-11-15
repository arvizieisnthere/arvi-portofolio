import './projects.css'
import { useEffect, useRef, useState } from 'react'
import { projects, projectsIntro, categories } from '../data/projects'
import useReveal from '../hooks/useReveal'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const pad = (n) => String(n).padStart(2, '0')

/* =============================================================
   KATALOG = ROLL FILM. Scroll menggeser gulungan film ke samping
   (section menempel di layar), tiap proyek satu frame.
   Data: data/projects.js — tidak ada yang perlu diubah di sana.
   ============================================================= */
export default function Projects() {
  const [active, setActive] = useState('all')
  const [frame, setFrame] = useState(0)
  const [pinned, setPinned] = useState(() => window.matchMedia('(min-width: 901px)').matches)

  const sec = useRef(null)
  const vp = useRef(null)
  const strip = useRef(null)
  const headRef = useReveal(0.25)

  const catLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]))
  const shown = active === 'all' ? projects : projects.filter((p) => p.category === active)
  const total = shown.length
  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.category === id).length)

  // judul: semua kata kecuali yang terakhir = kondensed; kata terakhir = serif miring
  const words = projectsIntro.title.split(' ')
  const lead = words.slice(0, -1).join(' ')
  const serif = `${words[words.length - 1].toLowerCase()}.`

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)')
    const f = () => setPinned(mq.matches)
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [])

  // desktop: scroll vertikal → gulungan film bergeser horizontal
  useEffect(() => {
    const s = sec.current, st = strip.current, v = vp.current
    if (!pinned) { if (s) s.style.height = ''; if (st) st.style.transform = ''; return }
    const calm = reduced()
    let max = 0, target = 0, cur = 0, raf = 0, near = true, last = -1

    const calc = () => {
      const r = s.getBoundingClientRect()
      target = clamp01(-r.top / Math.max(1, r.height - window.innerHeight))
    }
    const measure = () => {
      max = Math.max(0, st.scrollWidth - v.clientWidth)
      s.style.height = `${window.innerHeight + max}px`   // makin banyak frame, makin panjang scroll-nya
      calc()
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!near) return
      cur += (target - cur) * (calm ? 1 : 0.12)
      if (Math.abs(target - cur) < 0.0004) cur = target
      st.style.transform = `translate3d(${(-cur * max).toFixed(1)}px,0,0)`
      s.style.setProperty('--p', cur.toFixed(4))
      const li = st.querySelector('li')
      if (li) {
        const idx = Math.min(total - 1, Math.max(0, Math.floor((cur * max + v.clientWidth / 2) / li.offsetWidth)))
        if (idx !== last) { last = idx; setFrame(idx) }
      }
    }

    const ro = new ResizeObserver(measure); ro.observe(st); ro.observe(v)
    const io = new IntersectionObserver(([e]) => { near = e.isIntersecting }, { rootMargin: '400px 0px' }); io.observe(s)
    window.addEventListener('scroll', calc, { passive: true })
    window.addEventListener('resize', measure)
    measure(); raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect()
      window.removeEventListener('scroll', calc); window.removeEventListener('resize', measure)
    }
  }, [pinned, total, active])

  const pick = (id) => {
    setActive(id)
    setFrame(0)
    // kembali ke awal gulungan supaya frame pertama langsung terlihat
    if (pinned && sec.current) {
      const r = sec.current.getBoundingClientRect()
      if (r.top < 0) window.scrollTo({ top: window.scrollY + r.top, behavior: reduced() ? 'auto' : 'smooth' })
    }
  }

  const tabs = [{ id: 'all', label: 'SEMUA' }, ...categories]

  return (
    <section id="projects" ref={sec} className="pj" data-pinned={pinned}>
      <div className="pj-pin">
        <div className="pj-grain" aria-hidden="true" />

        <header ref={headRef} className="pj-head">
          <div className="pj-head__l">
            <p className="pj-eyebrow">{projectsIntro.eyebrow}</p>
            <h2 className="pj-title" aria-label={projectsIntro.title}>
              <span className="pj-t1" aria-hidden="true"><span>{lead}</span></span>
              <span className="pj-t2" aria-hidden="true"><span>{serif}</span></span>
            </h2>
          </div>
          <div className="pj-head__r">
            <p className="pj-lead">{projectsIntro.text}</p>
            <p className="pj-count" aria-live="polite">
              <span className="pj-count__n"><b key={`${active}-${frame}`}>{pad(total ? frame + 1 : 0)}</b></span>
              <i>/</i><span>{pad(total)}</span><em>FRAME</em>
            </p>
          </div>
        </header>

        <div className="pj-fl" role="group" aria-label="Filter kategori proyek">
          {tabs.map((t) => (
            <button key={t.id} type="button" className={active === t.id ? 'is-on' : ''} aria-pressed={active === t.id} onClick={() => pick(t.id)}>
              {t.label} <i>({pad(count(t.id))})</i>
            </button>
          ))}
        </div>

        {/* gulungan film */}
        <div ref={vp} className="pj-vp">
          <ul ref={strip} className="pj-strip" key={active}>
            {shown.map((p, i) => (
              <li key={p.id} className="pj-fr" style={{ '--i': Math.min(i, 8) }}>
                <a href={p.href} className="pj-a" aria-label={`${p.title} — lihat detail proyek`}>
                  <span className="pj-edge" aria-hidden="true">
                    <span>▶ {pad(i + 1)}</span><span>ARVI 400</span><span>{pad(i + 1)}A</span>
                  </span>

                  <span className="pj-img">
                    {p.image
                      ? <img src={p.image} alt={`Tampilan proyek ${p.title}`} loading="lazy" draggable="false" />
                      : <b className="pj-ph" aria-hidden="true">{pad(i + 1)}</b>}
                    {p.note && <span className="pj-note">{p.note}</span>}

                    <span className="pj-over">
                      <span className="pj-over__d">{p.desc}</span>
                      <span className="pj-over__t">{(p.tags || []).join(' / ')}</span>
                      <span className="pj-over__c">BUKA PROYEK <i aria-hidden="true">↗</i></span>
                    </span>
                  </span>

                  <span className="pj-cap">
                    <span className="pj-cap__t">{p.title}</span>
                    <span className="pj-cap__c">{catLabel[p.category] || p.type}</span>
                  </span>
                </a>
              </li>
            ))}

            {total === 0 && (
              <li className="pj-empty">
                <p>Belum ada proyek di kategori ini.<br />Tambahkan di <code>src/data/projects.js</code>.</p>
              </li>
            )}
          </ul>
        </div>

        <div className="pj-foot" aria-hidden="true">
          <span className="pj-foot__h">SCROLL — GESER GULUNGANNYA</span>
          <span className="pj-bar"><i /></span>
        </div>
      </div>
    </section>
  )
}
