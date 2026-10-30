import { profile, facts } from '../data/profile'
import useReveal from '../hooks/useReveal'
import { ArrowUpRight, ArrowDown, Download, Camera } from './Icons'

export default function Hero() {
  const factsRef = useReveal(0.3)

  return (
    <section id="top" className="hero">
      <div className="hero__text">
        <p className="status anim" style={{ '--d': '0ms' }}>
          <span className="status__dot" />
          {profile.status}
        </p>

        <p className="kicker anim" style={{ '--d': '100ms' }}>{profile.kicker}</p>

        <h1 className="title">
          <span className="title__line"><span style={{ '--d': '180ms' }}>HALO, SAYA</span></span>
          <span className="title__line title__line--blue">
            <span style={{ '--d': '300ms' }}>ARVI<i className="title__dot" /></span>
          </span>
        </h1>

        <p className="tagline anim" style={{ '--d': '450ms' }}>
          {profile.tagline[0]} <b>×</b> {profile.tagline[1]}
        </p>

        <p className="intro anim" style={{ '--d': '550ms' }}>{profile.intro}</p>

        <div ref={factsRef} className="facts reveal-group">
          {facts.map((f, i) => (
            <div key={f.label} className="fact reveal-child" style={{ '--i': i }}>
              <span className="fact__label">{f.label}</span>
              <span className={`fact__value fact__value--${f.tone}`}>{f.value}</span>
            </div>
          ))}
        </div>

        <div className="actions anim" style={{ '--d': '900ms' }}>
          <a href="#projects" className="btn btn--blue">LIHAT KARYA SAYA <ArrowDown /></a>
          <a href="#contact" className="btn btn--orange">HUBUNGI SAYA <ArrowUpRight /></a>
          <a href={profile.resumeUrl} download className="btn btn--ghost">
            <Download /> UNDUH CV (PDF)
          </a>
        </div>
      </div>

      <figure className="portrait">
        <div className="portrait__frame">
          <img src={profile.heroImg} alt="Arvi duduk di studio kreatif sambil membawa kamera" />
          <span className="chip"><Camera /> {profile.camera}</span>
        </div>
        <span className="tag tag--purple">{profile.badges.purple}</span>
        <span className="tag tag--white">{profile.badges.white}</span>
      </figure>
    </section>
  )
}
