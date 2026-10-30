import './finale.css'
import { byId, footer } from '../data/contact'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__l">
        <b>{footer.brand}</b>
        <i aria-hidden="true" />
        <span>{footer.copy}</span>
      </div>
      <span className="foot__pill"><i aria-hidden="true" />{footer.place}</span>
      <nav className="foot__r" aria-label="Sosial media">
        {footer.ids.map((id) => {
          const l = byId[id]
          return (
            <a key={id} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{l.short}</a>
          )
        })}
      </nav>
    </footer>
  )
}
