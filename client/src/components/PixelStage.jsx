import { useEffect, useRef, useState } from 'react'
import { links } from '../data/contact'

/* ============================================================
   PIXEL STAGE — mini game "ARVI WORLD 1-1"
   Canvas 320x180 diperbesar dengan image-rendering: pixelated.
   - Tidak ada yang main  → karakter jalan sendiri (mode demo)
   - Klik / fokus          → kamu yang pegang kendali
   - Lompat & tanduk blok "?" dari bawah → link terbuka
   ============================================================ */
const W = 320, H = 180, GROUND = 148
const GRAV = 0.36, SPEED = 1.45, JUMP = -6.4
const PW = 12, PH = 16, BS = 16, BY = 94
const SPAN = 480

/* ---------- sprite karakter (12x16) ---------- */
const PAL = { c: '#f0622d', d: '#b8400f', s: '#f2b98a', k: '#14141a', m: '#c4684a', b: '#2447d9', g: '#3a3a46', l: '#9ad7ff', n: '#c9a46a', w: '#f4f4f8' }
const TOP = [
  '...cccccc...',
  '..cccccccc..',
  '..dddddddd..',
  '..ssssssss..',
  '..skssssks..',
  '..sssmmsss..',
  '...ssssss...',
  '..bbbbbbbb..',
  '.sbbbggbbbs.',
  '.sbbgllgbbs.',
  '.sbbggggbbs.',
  '..bbbbbbbb..',
]
const LEGS = {
  stand: ['..nnn..nnn..', '..nnn..nnn..', '..nnn..nnn..', '..www..www..'],
  step:  ['.nnn....nnn.', '.nnn....nnn.', 'nnn......nnn', 'www......www'],
  jump:  ['..nnnnnnnn..', '..nnnnnnnn..', '...nnnnnn...', '...wwwwww...'],
}

/* ---------- glyph blok ---------- */
const Q = ['.XXX.', 'X...X', '....X', '...X.', '..X..', '.....', '..X..']
const CHECK = ['......X', '.....X.', 'X...X..', '.X.X...', '..X....']

/* ---------- util ---------- */
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c }
const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16)
  const f = (c) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`
}
const overlap = (p, b) => p.x < b.x + BS && p.x + PW > b.x && p.y < b.y + BS && p.y + PH > b.y
const glyph = (ctx, rows, x, y, color) => { ctx.fillStyle = color; rows.forEach((r, j) => [...r].forEach((ch, i) => ch === 'X' && ctx.fillRect(x + i, y + j, 1, 1))) }

/* ---------- aset (dibuat sekali lewat kode) ---------- */
function buildBackground() {
  const c = mk(W, H), x = c.getContext('2d')
  const bands = ['#0a0a1f', '#0e0e2c', '#131338', '#1a1646', '#241a52', '#321f5a', '#44245e', '#5a2a5e', '#74315a', '#8f3a54']
  const bh = Math.ceil(GROUND / bands.length)
  bands.forEach((col, i) => { x.fillStyle = col; x.fillRect(0, i * bh, W, bh) })
  bands.forEach((col, i) => { // dither tipis di batas antar pita warna
    if (!i) return
    x.fillStyle = col
    for (let px = i % 2; px < W; px += 2) x.fillRect(px, i * bh - 1, 1, 1)
  })
  // bulan
  const mx = 262, my = 34, r = 13
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
    const d = xx * xx + yy * yy
    if (d <= r * r) { x.fillStyle = d > (r - 2) * (r - 2) ? '#e8d49a' : '#ffeebc'; x.fillRect(mx + xx, my + yy, 1, 1) }
  }
  x.fillStyle = '#e6cf94'
  ;[[-4, -3, 3], [4, 3, 2], [-2, 7, 2]].forEach(([cx, cy, cr]) => {
    for (let yy = -cr; yy <= cr; yy++) for (let xx = -cr; xx <= cr; xx++) if (xx * xx + yy * yy <= cr * cr) x.fillRect(mx + cx + xx, my + cy + yy, 1, 1)
  })
  return c
}

function buildLayer(seed, color, minH, maxH, minW, maxW, windows, monas) {
  const c = mk(SPAN, GROUND), x = c.getContext('2d'), rnd = mulberry(seed)
  let px = 0
  while (px < SPAN) {
    const w = Math.floor(minW + rnd() * (maxW - minW)), h = Math.floor(minH + rnd() * (maxH - minH))
    const bw = Math.min(w, SPAN - px)
    x.fillStyle = color; x.fillRect(px, GROUND - h, bw, h)
    if (windows) {
      for (let wy = GROUND - h + 4; wy < GROUND - 4; wy += 5) for (let wx = px + 3; wx < px + bw - 3; wx += 5) {
        const r = rnd()
        if (r < 0.33) { x.fillStyle = r < 0.08 ? '#ff9a6b' : '#ffd86b'; x.fillRect(wx, wy, 2, 2) }
      }
    }
    if (rnd() < 0.25) { x.fillStyle = color; x.fillRect(px + Math.floor(bw / 2), GROUND - h - 6, 1, 6) }
    px += bw
  }
  if (monas) { // siluet Monas (Jakarta)
    const cx = 300
    x.fillStyle = '#3a2a78'
    x.fillRect(cx - 16, GROUND - 12, 32, 12); x.fillRect(cx - 9, GROUND - 19, 18, 7)
    x.fillRect(cx - 6, GROUND - 24, 12, 5); x.fillRect(cx - 2, GROUND - 78, 4, 54)
    x.fillStyle = '#ffb347'; x.fillRect(cx - 2, GROUND - 84, 4, 6)
    x.fillStyle = '#ffd86b'; x.fillRect(cx - 1, GROUND - 88, 2, 4)
  }
  return c
}

function buildBlock(color, found) {
  const c = mk(BS, BS), x = c.getContext('2d')
  const base = found ? shade(color, -0.35) : color
  x.fillStyle = base; x.fillRect(0, 0, BS, BS)
  x.fillStyle = shade(color, found ? -0.1 : 0.4); x.fillRect(0, 0, BS, 2); x.fillRect(0, 0, 2, BS)
  x.fillStyle = shade(color, -0.55); x.fillRect(0, BS - 2, BS, 2); x.fillRect(BS - 2, 0, 2, BS)
  x.fillStyle = '#14141a'
  ;[[2, 2], [BS - 3, 2], [2, BS - 3], [BS - 3, BS - 3]].forEach(([a, b]) => x.fillRect(a, b, 1, 1))
  if (found) glyph(x, CHECK, 5, 5, '#ffffff')
  else { glyph(x, Q, 6, 4, '#14141a'); glyph(x, Q, 5, 3, '#ffffff') }
  return c
}

function createWorld(reduce) {
  const rnd = mulberry(7)
  const stars = Array.from({ length: 46 }, () => ({ x: Math.floor(rnd() * W), y: Math.floor(rnd() * 96), s: rnd() < 0.15 ? 2 : 1, ph: rnd() * 6.28 }))
  const blocks = links.map((link, i) => ({
    link, x: 24 + i * 60, y: BY, bump: 0, found: false,
    img: buildBlock(link.color, false), imgFound: buildBlock(link.color, true),
  }))
  return {
    bg: buildBackground(),
    far: buildLayer(11, '#2a1d52', 30, 72, 18, 34, false, true),
    near: buildLayer(23, '#150f30', 20, 54, 22, 40, true, false),
    stars, blocks, reduce,
    p: { x: 8, y: GROUND - PH, vx: 0, vy: 0, on: true, face: 1, walk: 0 },
    fx: [], t: 0, jumpReq: 0, paused: false,
    input: { l: false, r: false }, focused: false, lastInput: -1e9, controlled: false, lastPlaying: false,
    demo: { idx: 0, cool: 40 }, foundCount: 0, celebrated: false,
  }
}

/* ---------- simulasi ---------- */
function demoStep(S) {
  const d = S.demo, p = S.p
  if (d.cool > 0) { d.cool--; return { l: false, r: false } }
  if (p.on && p.y + PH < GROUND - 1) return { l: false, r: true } // turun dari atas blok
  const b = S.blocks[d.idx]
  const dx = b.x + BS / 2 - PW / 2 - p.x
  if (Math.abs(dx) > 2) return { l: dx < 0, r: dx > 0 }
  if (p.on && S.jumpReq === 0) S.jumpReq = 2
  return { l: false, r: false }
}

function update(S, api) {
  const p = S.p, now = performance.now()
  if (S.input.l || S.input.r) S.lastInput = now
  S.controlled = S.focused || now - S.lastInput < 5000
  if (S.paused) return
  S.t++

  let l = S.input.l, r = S.input.r
  if (!S.controlled) {
    if (S.reduce) { l = r = false } else { const d = demoStep(S); l = d.l; r = d.r }
  }
  const dir = (r ? 1 : 0) - (l ? 1 : 0)
  p.vx = dir * SPEED
  if (dir) { p.face = dir; if (p.on) p.walk++ }

  // gerak horizontal + tabrakan blok
  p.x = Math.min(Math.max(p.x + p.vx, 0), W - PW)
  for (const b of S.blocks) if (overlap(p, b)) { if (p.vx > 0) p.x = b.x - PW; else if (p.vx < 0) p.x = b.x + BS }

  // lompat
  if (S.jumpReq > 0) { S.jumpReq--; if (p.on) { p.vy = JUMP; p.on = false; S.jumpReq = 0 } }

  // gerak vertikal
  p.vy = Math.min(p.vy + GRAV, 8)
  p.y += p.vy
  p.on = false
  for (const b of S.blocks) {
    if (!overlap(p, b)) continue
    if (p.vy > 0) { p.y = b.y - PH; p.vy = 0; p.on = true }
    else if (p.vy < 0) {
      p.y = b.y + BS; p.vy = 0
      b.bump = 8
      S.fx.push({ x: b.x + BS / 2, y: b.y - 4, vy: -3.2, life: 30, max: 30 })
      if (S.controlled) api.onHit(b)
      else { S.demo.idx = (S.demo.idx + 1) % S.blocks.length; S.demo.cool = 45 }
    }
  }
  if (p.y + PH >= GROUND) { p.y = GROUND - PH; p.vy = 0; p.on = true }

  for (const b of S.blocks) if (b.bump > 0) b.bump--
  S.fx = S.fx.filter((f) => { f.y += f.vy; f.vy += 0.22; f.life--; return f.life > 0 && f.y < H })
}

/* ---------- gambar ---------- */
const paint = (ctx, rows, x, y, flip, solid) => {
  rows.forEach((row, ry) => {
    for (let cx = 0; cx < PW; cx++) {
      const ch = row[flip ? PW - 1 - cx : cx]
      if (ch === '.') continue
      ctx.fillStyle = solid || PAL[ch]
      ctx.fillRect(x + cx, y + ry, 1, 1)
    }
  })
}
const wrapLayer = (ctx, img, off) => { const o = ((off % SPAN) + SPAN) % SPAN; ctx.drawImage(img, -o, 0); ctx.drawImage(img, SPAN - o, 0) }

function draw(ctx, S) {
  const p = S.p, t = S.t
  ctx.drawImage(S.bg, 0, 0)

  // bintang berkedip
  S.stars.forEach((s) => {
    const tw = S.reduce ? 0.7 : (Math.sin(t * 0.05 + s.ph) + 1) / 2
    ctx.fillStyle = tw > 0.6 ? '#ffffff' : tw > 0.25 ? '#9aa4d8' : '#4a4f86'
    ctx.fillRect(s.x, s.y, s.s, s.s)
  })

  wrapLayer(ctx, S.far, p.x * 0.12)
  ctx.fillStyle = 'rgba(240,98,45,0.14)'; ctx.fillRect(0, GROUND - 16, W, 16) // kabut senja
  wrapLayer(ctx, S.near, p.x * 0.3)

  // tanah
  ctx.fillStyle = '#4a2c2a'; ctx.fillRect(0, GROUND, W, H - GROUND)
  ctx.fillStyle = '#34201f'
  for (let row = 0; row < 2; row++) {
    const y = GROUND + 5 + row * 12
    ctx.fillRect(0, y + 11 > H ? H - 1 : y + 11, W, 1)
    for (let x = row % 2 ? 8 : 0; x < W; x += 16) ctx.fillRect(x, y, 1, 11)
  }
  ctx.fillStyle = '#35c46a'; ctx.fillRect(0, GROUND, W, 4)
  ctx.fillStyle = '#6ee89a'; ctx.fillRect(0, GROUND, W, 1)
  ctx.fillStyle = '#23944d'; for (let x = 2; x < W; x += 6) ctx.fillRect(x, GROUND + 3, 2, 1)

  // blok
  S.blocks.forEach((b) => {
    const off = b.bump > 0 ? -Math.round(Math.sin(((8 - b.bump) / 8) * Math.PI) * 5) : 0
    ctx.drawImage(b.found ? b.imgFound : b.img, b.x, b.y + off)
  })

  // koin
  S.fx.forEach((f) => {
    const w = Math.max(1, Math.round(Math.abs(Math.cos(f.life * 0.5)) * 6))
    ctx.fillStyle = '#ffb000'; ctx.fillRect(Math.round(f.x - w / 2), Math.round(f.y), w, 8)
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(Math.round(f.x - w / 2), Math.round(f.y), Math.max(1, w - 1), 7)
  })

  // bayangan + karakter
  const air = Math.max(0, GROUND - (p.y + PH))
  ctx.fillStyle = `rgba(0,0,0,${Math.max(0.12, 0.4 - air / 160)})`
  ctx.fillRect(Math.round(p.x) + 1, GROUND - 1, 10, 2)
  const legs = !p.on ? LEGS.jump : p.vx !== 0 && Math.floor(p.walk / 6) % 2 === 1 ? LEGS.step : LEGS.stand
  const rows = [...TOP, ...legs]
  const x = Math.round(p.x), y = Math.round(p.y), flip = p.face < 0
  ;[[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([ox, oy]) => paint(ctx, rows, x + ox, y + oy, flip, '#0a0a1f'))
  paint(ctx, rows, x, y, flip)
}

/* ============================================================ */
export default function PixelStage() {
  const wrap = useRef(null)
  const canvas = useRef(null)
  const SRef = useRef(null)
  const visible = useRef(true)
  const api = useRef({})

  const [playing, setPlaying] = useState(false)
  const [coins, setCoins] = useState(0)
  const [found, setFound] = useState(() => new Set())
  const [dialog, setDialog] = useState(null)
  const [banner, setBanner] = useState(false)

  const total = links.length

  api.current.onHit = (b) => {
    const S = SRef.current
    if (!b.found) { b.found = true; S.foundCount++ }
    setCoins((c) => c + 1)
    setFound((f) => new Set(f).add(b.link.id))
    S.paused = true
    S.input.l = S.input.r = false
    setDialog(b.link)
  }

  const closeDialog = () => {
    const S = SRef.current
    setDialog(null)
    S.paused = false
    wrap.current?.focus({ preventScroll: true })
    if (S.foundCount === total && !S.celebrated) {
      S.celebrated = true
      for (let i = 0; i < 36; i++) S.fx.push({ x: 8 + Math.random() * (W - 16), y: -Math.random() * 90, vy: Math.random() * 1.5, life: 140, max: 140 })
      setBanner(true)
      setTimeout(() => setBanner(false), 6000)
    }
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const S = (SRef.current = createWorld(reduce))
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.05 })
    io.observe(cv)

    let raf = 0, last = performance.now(), acc = 0
    const STEP = 1000 / 60
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!visible.current) { last = now; return }
      acc += Math.min(now - last, 100); last = now
      while (acc >= STEP) { update(S, api.current); acc -= STEP }
      draw(ctx, S)
      if (S.controlled !== S.lastPlaying) { S.lastPlaying = S.controlled; setPlaying(S.controlled) }
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  /* ----- input ----- */
  const KEYS = { ArrowLeft: 'l', a: 'l', A: 'l', ArrowRight: 'r', d: 'r', D: 'r' }
  const onKeyDown = (e) => {
    const S = SRef.current
    if (dialog) { if (e.key === 'Escape') closeDialog(); return }
    if (e.key === 'Escape') { wrap.current.blur(); return }
    const k = KEYS[e.key]
    if (k) { S.input[k] = true; e.preventDefault() }
    else if ([' ', 'ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); if (!e.repeat) { S.jumpReq = 10; S.lastInput = performance.now() } }
  }
  const onKeyUp = (e) => { const k = KEYS[e.key]; if (k) SRef.current.input[k] = false }

  const press = (key) => (e) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const S = SRef.current
    S.lastInput = performance.now()
    if (key === 'j') S.jumpReq = 10; else S.input[key] = true
  }
  const release = (key) => () => { if (key !== 'j') SRef.current.input[key] = false }

  return (
    <div className="stagewrap">
      <div
        ref={wrap}
        className={`stage ${playing ? 'is-playing' : ''}`}
        tabIndex={0}
        role="group"
        aria-label="Mini game pixel: gunakan tombol panah untuk berjalan dan spasi untuk melompat. Tanduk blok tanda tanya dari bawah untuk membuka link. Tekan Escape untuk keluar."
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onFocus={() => { SRef.current.focused = true }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { const S = SRef.current; S.focused = false; S.input.l = S.input.r = false } }}
        onPointerDown={() => wrap.current.focus({ preventScroll: true })}
      >
        <canvas ref={canvas} width={W} height={H} aria-hidden="true" />

        {/* label di atas blok */}
        {links.map((l, i) => (
          <span key={l.id} className={`stage__lbl ${found.has(l.id) ? 'is-found' : ''}`} style={{ left: `${((24 + i * 60 + 8) / W) * 100}%`, top: `${((BY - 12) / H) * 100}%` }}>
            {found.has(l.id) ? '✓ ' : ''}{l.short}
          </span>
        ))}

        {/* HUD */}
        <div className="stage__hud" aria-hidden="true">
          <span>COIN ×{String(coins).padStart(2, '0')}</span>
          <span>WORLD 1-1</span>
          <span>LINK {found.size}/{total}</span>
        </div>

        <p className={`stage__prompt ${playing ? 'is-hint' : ''}`} aria-hidden="true">
          {playing
            ? (found.size === 0 ? 'LOMPAT & TANDUK BLOK ?' : '◀ ▶ JALAN · SPASI LOMPAT · ESC KELUAR')
            : '▶ KLIK UNTUK MAIN'}
        </p>

        {banner && <div className="stage__banner" role="status">★ SEMUA LINK TERBUKA — TERIMA KASIH! ★</div>}

        {dialog && (
          <div className="stage__dialog" role="dialog" aria-label={`Link ${dialog.label}`} style={{ '--c': dialog.color }}>
            <p className="dlg__tag">LINK DITEMUKAN!</p>
            <h3>{dialog.label}</h3>
            <p className="dlg__handle">{dialog.handle}</p>
            <div className="dlg__actions">
              <a className="pxb pxb--orange" href={dialog.href} {...(dialog.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} autoFocus>
                BUKA {dialog.external ? '↗' : '▶'}
              </a>
              <button type="button" className="pxb" onClick={closeDialog}>TUTUP ✕</button>
            </div>
          </div>
        )}
      </div>

      {/* kontrol layar sentuh */}
      <div className="pad" aria-hidden="true">
        <button type="button" tabIndex={-1} onPointerDown={press('l')} onPointerUp={release('l')} onPointerCancel={release('l')} onPointerLeave={release('l')}>◀</button>
        <button type="button" tabIndex={-1} onPointerDown={press('r')} onPointerUp={release('r')} onPointerCancel={release('r')} onPointerLeave={release('r')}>▶</button>
        <button type="button" tabIndex={-1} className="pad__a" onPointerDown={press('j')} onPointerUp={release('j')}>A</button>
      </div>
    </div>
  )
}
