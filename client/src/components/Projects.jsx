import './projects.css'
import { useRef, useState } from 'react'
import { projects, projectsIntro, categories } from '../data/projects'
import useReveal from '../hooks/useReveal'

const svg = { viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const ICONS = {
  arrow: <svg {...svg}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  chevron: <svg {...svg}><path d="m9 6 6 6-6 6" /></svg>,
  circle: <svg {...svg}><circle cx="12" cy="12" r="9" /><path d="m10 8 5 4-5 4z" /></svg>,
  upright: <svg {...svg}><path d="M7 17 17 7M8 7h9v9" /></svg>,
  doc: <svg {...svg}><path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5" /></svg>,
  spark: <svg {...svg}><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></svg>,
}

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ProjectCard({ p, cat, i }) {
  const card = useRef(null)
  const media = useRef(null)
  const raf = useRef(0)

  // Kartu miring mengikuti kursor + lensa berwarna di area foto
  const track = (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion()) return
    const { clientX, clientY } = e
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const el = card.current
      const c = el.getBoundingClientRect()
      const m = media.current.getBoundingClientRect()
      const px = (clientX - c.left) / c.width
      const py = (clientY - c.top) / c.height
      el.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
      el.style.setProperty('--rx', `${-(py - 0.5) * 7}deg`)
      el.style.setProperty('--mx', `${Math.min(Math.max(clientX - m.left, 0), m.width)}px`)
      el.style.setProperty('--my', `${Math.min(Math.max(clientY - m.top, 0), m.height)}px`)
    })
  }
  const enter = (e) => {
    if (e.pointerType !== 'mouse' || reduceMotion()) return
    card.current.classList.add('is-hover')
    track(e)
  }
  const leave = () => {
    cancelAnimationFrame(raf.current)
    const el = card.current
    el.classList.remove('is-hover')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <a
      ref={card}
      href={p.href}
      className="pcard"
      style={{ '--i': i, '--cat': cat.color }}
      onPointerEnter={enter}
      onPointerMove={track}
      onPointerLeave={leave}
    >
      <div className="pcard__media" ref={media}>
        {p.image ? (
          <>
            <img className="pcard__img pcard__img--base" src={p.image} alt={`Tampilan proyek ${p.title}`} loading="lazy" />
            <img className="pcard__img pcard__img--lens" src={p.image} alt="" aria-hidden="true" loading="lazy" />
          </>
        ) : (
          <div className="pcard__ph" aria-hidden="true">
            <svg viewBox="0 0 200 160" width="40%" fill="currentColor"><circle cx="140" cy="38" r="20" /><path d="M20 150 80 55l30 38 22-24 48 81z" /></svg>
          </div>
        )}
        <span className="pcard__ring" aria-hidden="true" />
        <span className="pcard__cursor" aria-hidden="true">LIHAT</span>
        <span className="pcard__label">{cat.label}</span>
        {p.note && <span className="pcard__note">{p.note}</span>}
      </div>

      <div className="pcard__body">
        <h3 className="pcard__title">{p.title}</h3>
        <p className="pcard__desc">{p.desc}</p>
        <ul className="pcard__tags">
          {p.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="pcard__foot">
          <span className="pcard__type" style={{ color: p.typeColor }}>{p.type}</span>
          <span className="pcard__more">DETAIL PROYEK {ICONS[p.icon]}</span>
        </div>
      </div>
    </a>
  )
}

export default function Projects() {
  const [active, setActive] = useState('all')
  const headRef = useReveal(0.3)
  const gridRef = useReveal(0.1)

  const catById = Object.fromEntries(categories.map((c) => [c.id, c]))
  const visible = active === 'all' ? projects : projects.filter((p) => p.category === active)
  const tabs = [{ id: 'all', label: `SEMUA (${projects.length})` }, ...categories]

  return (
    <section id="projects" className="pj">
      <header ref={headRef} className="pj__head reveal-group reveal-group--scroll">
        <div className="reveal-child" style={{ '--i': 0 }}>
          <p className="pj__eyebrow">{projectsIntro.eyebrow}</p>
          <h2 className="pj__title">{projectsIntro.title}</h2>
        </div>
        <p className="pj__text reveal-child" style={{ '--i': 1 }}>{projectsIntro.text}</p>
      </header>

      <div className="pj__tabs" role="group" aria-label="Filter kategori proyek">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`pj__tab ${active === t.id ? 'is-active' : ''}`}
            aria-pressed={active === t.id}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div ref={gridRef} className="pj__grid" aria-live="polite">
        {visible.map((p, i) => (
          <ProjectCard key={`${active}-${p.id}`} p={p} cat={catById[p.category]} i={i} />
        ))}

        {visible.length === 0 && (
          <p className="pj__empty">
            Belum ada proyek di kategori ini. Tambahkan di <code>src/data/projects.js</code>.
          </p>
        )}
      </div>
    </section>
  )
}
