import './leadership.css'
import { useState } from 'react'
import { leadership, leadershipIntro } from '../data/leadership'
import useReveal from '../hooks/useReveal'

const noHover = () => window.matchMedia('(hover: none)').matches

export default function Leadership() {
  const [active, setActive] = useState(0) // panel yang sedang terbuka
  const headRef = useReveal(0.3)
  const rowRef = useReveal(0.15)

  return (
    <section id="leadership" className="ld">
      <header ref={headRef} className="ld__head reveal-group reveal-group--scroll">
        <div className="reveal-child" style={{ '--i': 0 }}>
          <p className="ld__eyebrow">{leadershipIntro.eyebrow}</p>
          <h2 className="ld__title">{leadershipIntro.title}</h2>
        </div>
        <p className="ld__text reveal-child" style={{ '--i': 1 }}>{leadershipIntro.text}</p>
      </header>

      <div ref={rowRef} className="ld__row">
        {leadership.map((it, i) => (
          <a
            key={it.slug}
            href={it.href}
            className={`lp ${active === i ? 'is-active' : ''}`}
            style={{ '--i': i, '--role': it.roleColor, '--type': it.typeColor, '--h': it.hue }}
            aria-label={`${it.title}, ${it.role.replace('ROLE: ', '')}. Buka detail jejak.`}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
            onFocus={() => setActive(i)}
            onClick={(e) => {
              // layar sentuh: ketukan pertama membuka panel, ketukan kedua masuk ke halaman
              if (active !== i && noHover()) { e.preventDefault(); setActive(i) }
            }}
          >
            <span className="lp__bg">
              {it.image ? <img src={it.image} alt="" loading="lazy" /> : <span className="lp__ph" />}
            </span>
            <span className="lp__shade" />

            <span className="lp__no">0{i + 1}</span>
            <span className="lp__vert" aria-hidden="true">{it.title}</span>

            <span className="lp__content">
              <span className="lp__chips">
                <span className="lp__role">{it.role}</span>
                <span className="lp__tag">{it.tag}</span>
              </span>
              <h3 className="lp__name">{it.title}</h3>
              <p className="lp__desc">{it.desc}</p>
              <span className="lp__foot">
                <span className="lp__type">{it.type}</span>
                <span className="lp__more">BUKA DETAIL JEJAK <i aria-hidden="true">↗</i></span>
              </span>
            </span>

            <span className="lp__bar" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  )
}
