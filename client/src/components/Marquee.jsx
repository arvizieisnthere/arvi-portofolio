import { marqueeItems } from '../data/profile'
import { Star } from './Icons'

const STAR_COLORS = ['#2447d9', '#5b2bd6', '#f0622d', '#2447d9']

function Track({ hidden = false }) {
  return (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {marqueeItems.map((text, i) => (
        <li key={text} className="marquee__item">
          <span>{text}</span>
          <span className="marquee__star" style={{ color: STAR_COLORS[i % STAR_COLORS.length] }}>
            <Star />
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function Marquee() {
  // 3 track identik → geser -33.33% lalu reset = loop mulus tanpa putus
  return (
    <div className="marquee" role="region" aria-label="Bidang keahlian">
      <div className="marquee__inner">
        <Track />
        <Track hidden />
        <Track hidden />
      </div>
    </div>
  )
}
