import './skills.css'
import { useEffect, useRef, useState } from 'react'
import { skillsIntro, groups, LEVELS } from '../data/skills'
import useReveal from '../hooks/useReveal'

const STORAGE = 'arvi-skill-arcade-v2'
const BASE_XP = 10
const COMBO_MS = 1800
const COLORS = ['#f0622d', '#2447d9', '#5b2bd6', '#ffc83d', '#22c55e', '#ff5c93']

const allIds = groups.flatMap((g) => g.skills.map((_, i) => `${g.id}-${i}`))
const TOTAL = allIds.length

const load = () => {
  try {
    const r = JSON.parse(localStorage.getItem(STORAGE))
    if (r && Array.isArray(r.ids)) return { ids: r.ids.filter((id) => allIds.includes(id)), xp: Number(r.xp) || 0 }
  } catch { /* abaikan */ }
  return { ids: [], xp: 0 }
}

const si = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
const ICONS = {
  palette: <svg {...si}><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2.1-.4-1.1.3-2.1 1.5-2.1H17a4 4 0 0 0 4-4c0-5-4-9.8-9-9.8z" /><circle cx="7.5" cy="11" r="1" /><circle cx="10.5" cy="7" r="1" /><circle cx="15.5" cy="7.5" r="1" /></svg>,
  code: <svg {...si}><path d="m8 8-4 4 4 4M16 8l4 4-4 4" /></svg>,
  mind: <svg {...si}><path d="M9 21v-3a6 6 0 1 1 6-6h2l-2 3v2a2 2 0 0 1-2 2z" /><circle cx="11" cy="10" r="1.5" /></svg>,
}

const levelOf = (n) => LEVELS.reduce((acc, l, i) => (n / TOTAL >= l.at ? i : acc), 0)

export default function Skills() {
  const [collected, setCollected] = useState(() => new Set(load().ids))
  const [xp, setXp] = useState(() => load().xp)
  const [combo, setCombo] = useState(0)
  const [comboKey, setComboKey] = useState(0)
  const [fx, setFx] = useState([])
  const [levelFlash, setLevelFlash] = useState('')

  const secRef = useRef(null)
  const hudRef = useRef(null)
  const cardRefs = useRef({})
  const comboRef = useRef(0)
  const lastRef = useRef(0)
  const comboTimer = useRef(0)
  const fxId = useRef(0)
  const prevLevel = useRef(levelOf(collected.size))

  const headRef = useReveal(0.3)
  const hudReveal = useReveal(0.3)

  const count = collected.size
  const level = levelOf(count)
  const allDone = count === TOTAL

  // simpan progres
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify({ ids: [...collected], xp })) } catch { /* abaikan */ }
  }, [collected, xp])

  // notifikasi naik level
  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelFlash(LEVELS[level].name)
      const t = setTimeout(() => setLevelFlash(''), 2400)
      prevLevel.current = level
      return () => clearTimeout(t)
    }
    prevLevel.current = level
  }, [level])

  useEffect(() => () => clearTimeout(comboTimer.current), [])

  // efek: teks melayang + partikel
  const spawn = (el, text, color, n = 10) => {
    if (!el || !secRef.current) return
    const s = secRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const id = ++fxId.current
    const parts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.6
      const d = 46 + Math.random() * 56
      return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, c: COLORS[(i + id) % COLORS.length], s: 5 + Math.random() * 6 }
    })
    setFx((l) => [...l, { id, x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top, text, color, parts }])
    setTimeout(() => setFx((l) => l.filter((f) => f.id !== id)), 1200)
  }

  const collect = (e, id, group) => {
    if (collected.has(id)) return
    const el = e.currentTarget

    const now = Date.now()
    const nextCombo = now - lastRef.current < COMBO_MS ? comboRef.current + 1 : 1
    lastRef.current = now
    comboRef.current = nextCombo
    setCombo(nextCombo)
    setComboKey((k) => k + 1)
    clearTimeout(comboTimer.current)
    comboTimer.current = setTimeout(() => { comboRef.current = 0; setCombo(0) }, COMBO_MS)

    const gain = BASE_XP + (Math.min(nextCombo, 6) - 1) * 5
    setXp((x) => x + gain)

    const next = new Set(collected)
    next.add(id)
    setCollected(next)
    spawn(el, `+${gain} XP`, group.accent, nextCombo >= 3 ? 18 : 10)

    if (group.skills.every((_, i) => next.has(`${group.id}-${i}`))) {
      setTimeout(() => spawn(cardRefs.current[group.id]?.querySelector('.sk-card__icon'), 'SET COMPLETE!', group.accent, 28), 260)
    }
    if (next.size === TOTAL) {
      [0, 1, 2, 3, 4].forEach((k) => setTimeout(() => {
        const h = hudRef.current
        if (!h) return
        const r = h.getBoundingClientRect()
        const fake = { getBoundingClientRect: () => ({ left: r.left + r.width * (0.12 + k * 0.19), top: r.top + 6, width: 0, height: 0 }) }
        spawn(fake, k === 2 ? 'ALL UNLOCKED!' : '', COLORS[k], 30)
      }, 400 + k * 220))
    }
  }

  const reset = () => {
    setCollected(new Set())
    setXp(0)
    setCombo(0)
    comboRef.current = 0
    prevLevel.current = 0
  }

  return (
    <section id="skills" className="sk" ref={secRef}>
      <header ref={headRef} className="sk__head reveal-group reveal-group--scroll">
        <div className="reveal-child" style={{ '--i': 0 }}>
          <p className="sk__eyebrow">{skillsIntro.eyebrow}</p>
          <h2 className="sk__title">{skillsIntro.title}</h2>
        </div>
        <p className="sk__text reveal-child" style={{ '--i': 1 }}>{skillsIntro.text}</p>
      </header>

      {/* HUD ala game */}
      <div ref={hudReveal} className="reveal-group reveal-group--scroll">
        <div ref={hudRef} className={`sk-hud reveal-child ${allDone ? 'is-complete' : ''}`} style={{ '--i': 0 }}>
          <div className="sk-hud__title">
            <b>▶ SKILL ARCADE</b>
            <span>{allDone ? 'Semua skill terbuka. Kamu hebat!' : count === 0 ? 'Klik skill untuk mengumpulkannya!' : 'Klik beruntun untuk combo XP.'}</span>
          </div>

          <div className="sk-hud__level">
            <span className="sk-hud__lv">LV.{level + 1} <em key={level}>{LEVELS[level].name}</em></span>
            <div className="sk-hud__ticks" aria-label={`${count} dari ${TOTAL} skill terkumpul`}>
              {Array.from({ length: TOTAL }, (_, i) => <i key={i} className={i < count ? 'on' : ''} />)}
            </div>
          </div>

          <div className="sk-hud__right">
            <div className="sk-hud__xp"><small>XP</small><b>{String(xp).padStart(4, '0')}</b></div>
            <div className="sk-hud__combo" aria-live="polite">
              {combo >= 2 && (
                <span key={comboKey} className="sk-combo">
                  COMBO x{Math.min(combo, 6)}<i style={{ animationDuration: `${COMBO_MS}ms` }} />
                </span>
              )}
            </div>
            <button type="button" className="sk-hud__reset" onClick={reset} disabled={count === 0}>RESET</button>
          </div>

          {levelFlash && <div className="sk-hud__flash" role="status">LEVEL UP! → {levelFlash}</div>}
        </div>
      </div>

      {/* Grid kartu: TIDAK bergantung pada useReveal / animasi tersembunyi */}
      <div className="sk__grid">
        {groups.map((g) => {
          const n = g.skills.filter((_, i) => collected.has(`${g.id}-${i}`)).length
          const done = n === g.skills.length
          return (
            <article
              key={g.id}
              ref={(el) => { cardRefs.current[g.id] = el }}
              className={`sk-card ${done ? 'is-done' : ''}`}
              style={{ '--accent': g.accent }}
            >
              <div className="sk-card__head">
                <span className="sk-card__icon">{ICONS[g.icon]}</span>
                <h3>{g.title}</h3>
              </div>
              <p className="sk-card__desc">{g.desc}</p>

              <div className="sk-card__chips">
                {g.skills.map((s, i) => {
                  const id = `${g.id}-${i}`
                  const on = collected.has(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`sk-chip ${on ? 'is-on' : ''}`}
                      style={{ '--c': s.color, '--tilt': i % 2 ? '2deg' : '-2deg' }}
                      aria-pressed={on}
                      onClick={(e) => collect(e, id, g)}
                    >
                      <span className="sk-chip__dot" aria-hidden="true">{on ? '✓' : ''}</span>
                      {s.name}
                    </button>
                  )
                })}
              </div>

              <div className="sk-card__prog">
                <span>{n}/{g.skills.length}</span>
                <span className="sk-card__bar"><i style={{ width: `${(n / g.skills.length) * 100}%` }} /></span>
                <b className="sk-card__done">SET COMPLETE ✓</b>
              </div>
            </article>
          )
        })}
      </div>

      {/* lapisan efek */}
      <div className="sk-fx" aria-hidden="true">
        {fx.map((f) => (
          <div key={f.id} className="sk-fx__group" style={{ left: f.x, top: f.y }}>
            {f.text && <span className="sk-fx__text" style={{ color: f.color }}>{f.text}</span>}
            {f.parts.map((p, i) => (
              <i key={i} className="sk-fx__p" style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, background: p.c, width: p.s, height: p.s }} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
