import './interests.css'
import { interests, interestsIntro } from '../data/interests'
import useReveal from '../hooks/useReveal'
import { ArrowUpRight } from './Icons'

function Placeholder() {
  return (
    <div className="card__ph" aria-hidden="true">
      <svg viewBox="0 0 200 160" width="60%" fill="currentColor">
        <circle cx="140" cy="38" r="20" />
        <path d="M20 150 80 55l30 38 22-24 48 81z" />
      </svg>
    </div>
  )
}

export default function Interests() {
  const headRef = useReveal(0.3)
  const gridRef = useReveal(0.12)

  return (
    <section id="interests" className="interests">
      <header ref={headRef} className="interests__head reveal-group reveal-group--scroll">
        <div className="reveal-child" style={{ '--i': 0 }}>
          <p className="eyebrow">{interestsIntro.eyebrow}</p>
          <h2 className="interests__title">{interestsIntro.title}</h2>
        </div>
        <p className="interests__text reveal-child" style={{ '--i': 1 }}>{interestsIntro.text}</p>
      </header>

      <div ref={gridRef} className="bento reveal-group reveal-group--scroll">
        {interests.map((it, i) => (
          <a
            key={it.id}
            href={it.href}
            className={`card card--${it.size} reveal-child`}
            style={{ '--i': i, '--accent': it.accent }}
            aria-label={`${it.title} — lihat detail`}
          >
            <div className="card__media">
              {it.image ? <img src={it.image} alt="" loading="lazy" /> : <Placeholder />}
            </div>
            <div className="card__shade" />

            <span className="card__go" aria-hidden="true"><ArrowUpRight /></span>

            <div className="card__body">
              <p className="card__meta">{it.no} // {it.label}</p>
              <h3 className="card__title">{it.title}</h3>
              <ul className="card__tags">
                {it.tags.map((t, k) => (
                  <li key={t} style={{ '--k': k }}>{t}</li>
                ))}
              </ul>
            </div>

            {it.badge && <span className="card__badge">{it.badge}</span>}
          </a>
        ))}
      </div>
    </section>
  )
}
