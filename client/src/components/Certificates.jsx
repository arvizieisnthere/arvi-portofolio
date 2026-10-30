import './certificates.css'
import { useEffect, useRef, useState } from 'react'
import { certIntro, certs } from '../data/certificates'

/* ============================================================
   SECTION 8 — GALERI SERTIFIKAT (pixel art, kamera sinematik)
   Satu <canvas> menggambar galeri, karakter, dan 12 bingkai.
   Alur otomatis per bingkai:
   jalan (tracking) → close-up karakter → zoom ke bingkai → zoom out
   Di awal: kamera jauh (establishing), di akhir: kamera jauh lagi.
   ============================================================ */

const N = certs.length
const WORLD_W = 240 + (N - 1) * 96
const WORLD_H = 200
const FEET = 164            // garis kaki karakter
const FT = 70               // y atas bingkai
const FW = 48               // lebar bingkai luar
const FH = 36               // tinggi bingkai luar
const FRAME_CY = FT + FH / 2
const VIEW_S = 5.2          // lama tampil per sertifikat (detik)
const fx = (i) => 120 + i * 96

const LABEL = {
  intro: 'ESTABLISHING SHOT',
  walk: 'TRACKING SHOT',
  turn: 'CLOSE-UP',
  zoomin: 'PUSH IN',
  view: 'DETAIL',
  zoomout: 'PULL OUT',
  outro: 'WIDE SHOT',
}
const VIEWING = ['turn', 'zoomin', 'view']
const pad = (n) => String(n).padStart(2, '0')

/* ---------- sprite karakter (12 x 22) ---------- */
const PAL = { k: '#14141a', c: '#f0622d', h: '#4a2f1d', s: '#f2b98c', b: '#2447d9', B: '#1a339e', y: '#ffc83d', p: '#2b2f4a', o: '#ececf2' }

const SIDE_TOP = [
  '...kkkkkk...', '..kccccccck.', '.kccccccccck', '.khhsssssssk', '.khhssskssk.', '..khssssssk.', '...kssssskk.', '....kkkkk...',
  '..kbbbbbbk..', '.kybbbbbbbk.', '.kyybbbbbbk.', '.kyybbbbbsk.', '.kyyBBBBBbk.', '..kBBBBBBk..', '..kppppppk..',
]
const BACK_TOP = [
  '...kkkkkk...', '..kcccccck..', '.kcccccccck.', '.khhhhhhhhk.', '.khhhhhhhhk.', '..khhhhhhk..', '...kssssk...', '....kkkk....',
  '..kbbbbbbk..', '.kbbbbbbbbk.', '.kyyyyyyyyk.', '.ksyyyyyysk.', '.kyyyyyyyyk.', '..kBBBBBBk..', '..kppppppk..',
]
const LEGS_STAND = ['..kppkkppk..', '..kppk.kppk.', '..kppk.kppk.', '..kppk.kppk.', '..kook.kook.', '..kooo.kooo.', '...kkk.kkk..']
const LEGS_STRIDE = ['..kpppppppk.', '.kppk..kppk.', '.kppk...kppk', 'kppk.....kpk', 'kook.....kok', 'kooo.....ooo', '.kkk......kk']
const flipRows = (rows) => rows.map((r) => r.split('').reverse().join(''))

function bake(rows) {
  const c = document.createElement('canvas')
  c.width = 12
  c.height = 22
  const g = c.getContext('2d')
  rows.forEach((r, y) => {
    r.padEnd(12, '.').slice(0, 12).split('').forEach((ch, x) => {
      if (PAL[ch]) { g.fillStyle = PAL[ch]; g.fillRect(x, y, 1, 1) }
    })
  })
  return c
}
const buildSprites = () => ({
  walk: [
    bake([...SIDE_TOP, ...LEGS_STAND]),
    bake([...SIDE_TOP, ...LEGS_STRIDE]),
    bake([...SIDE_TOP, ...LEGS_STAND]),
    bake([...SIDE_TOP, ...flipRows(LEGS_STRIDE)]),
  ],
  back: bake([...BACK_TOP, ...LEGS_STAND]),
})

/* ---------- font angka 3x5 ---------- */
const DIG = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001001001001', '111101111101111', '111101111001111']
function digit(g, d, x, y, col) {
  g.fillStyle = col
  DIG[d].split('').forEach((v, k) => { if (v === '1') g.fillRect(x + (k % 3), y + ((k / 3) | 0), 1, 1) })
}

/* ---------- latar galeri (digambar sekali) ---------- */
function buildBg() {
  const c = document.createElement('canvas')
  c.width = WORLD_W
  c.height = WORLD_H
  const g = c.getContext('2d')
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h) }

  R(0, 0, WORLD_W, WORLD_H, '#0b0b10')
  // langit-langit
  R(0, 0, WORLD_W, 12, '#15152a'); R(0, 12, WORLD_W, 2, '#3a3e7c'); R(0, 14, WORLD_W, 1, '#0e0e1e')
  for (let x = 0; x < WORLD_W; x += 96) R(x, 0, 3, 12, '#1d1d38')
  // dinding bergaris + titik
  R(0, 15, WORLD_W, 109, '#23245a')
  for (let x = 0; x < WORLD_W; x += 16) { R(x, 15, 8, 109, '#282a66'); R(x + 8, 15, 1, 109, '#1b1c48') }
  for (let y = 24, row = 0; y < 118; y += 18, row++) {
    const off = row % 2 ? 12 : 4
    for (let x = off; x < WORLD_W; x += 16) R(x, y, 2, 2, '#34377f')
  }
  R(0, 119, WORLD_W, 2, '#4a50a8'); R(0, 121, WORLD_W, 3, '#14143a')
  R(0, 124, WORLD_W, 8, '#10101c'); R(0, 124, WORLD_W, 1, '#c98a1e')
  // lantai kayu
  for (let y = 132, r = 0; y < WORLD_H; y += 8, r++) {
    R(0, y, WORLD_W, 8, r % 2 ? '#a8703a' : '#9d6733')
    R(0, y, WORLD_W, 1, '#7d4f27')
    for (let x = (r % 2) * 16; x < WORLD_W; x += 32) R(x, y, 1, 8, '#7d4f27')
  }
  R(0, 132, WORLD_W, 4, 'rgba(0,0,0,0.28)')
  // karpet merah
  R(0, 144, WORLD_W, 32, '#ffc83d'); R(0, 146, WORLD_W, 28, '#a31d33'); R(0, 148, WORLD_W, 1, '#7e1527'); R(0, 171, WORLD_W, 1, '#7e1527')
  for (let x = 0; x < WORLD_W; x += 16) { R(x + 7, 155, 2, 10, '#c9364c'); R(x + 4, 159, 8, 2, '#c9364c') }
  // pintu masuk
  R(32, 76, 16, 6, '#14141a'); R(33, 77, 14, 4, '#22c55e')
  R(24, 84, 32, 2, '#c98a1e'); R(26, 86, 28, 46, '#14141a'); R(28, 88, 24, 44, '#5a3414')
  R(31, 92, 18, 16, '#6b3f1d'); R(31, 112, 18, 16, '#6b3f1d'); R(46, 110, 2, 2, '#ffc83d')
  // bangku
  const bench = (bx) => {
    R(bx - 16, 108, 32, 4, '#f0622d'); R(bx - 16, 112, 32, 6, '#8b5a2b'); R(bx - 16, 112, 32, 1, '#a97238')
    R(bx - 14, 118, 3, 14, '#3a210e'); R(bx + 11, 118, 3, 14, '#3a210e')
  }
  ;[3, 7].forEach((i) => { if (i < N - 1) bench(fx(i) + 48) })
  // tanaman
  const px = WORLD_W - 48
  R(px - 8, 118, 16, 3, '#c94a1c'); R(px - 7, 121, 14, 11, '#f0622d')
  ;[[-4, 104, 8, 14], [-10, 98, 6, 10], [4, 96, 6, 12], [-2, 88, 5, 14], [-12, 108, 6, 6], [6, 106, 6, 8]].forEach(([dx, dy, w, h]) => {
    R(px + dx, dy, w, h, '#2f9e44'); R(px + dx, dy, 2, h, '#40c057')
  })
  // bingkai dunia
  R(0, 0, 3, WORLD_H, '#14141a'); R(WORLD_W - 3, 0, 3, WORLD_H, '#14141a'); R(0, WORLD_H - 2, WORLD_W, 2, '#14141a')
  return c
}

export default function Certificates() {
  const [entered, setEntered] = useState(false)
  const [auto, setAuto] = useState(true)
  const [ui, setUi] = useState({ phase: 'intro', active: 0 })

  const secRef = useRef(null)
  const wrapRef = useRef(null)
  const cvRef = useRef(null)
  const autoRef = useRef(true)
  const S = useRef({ phase: 'intro', t: 0, clock: 0, x: 40, dir: 1, target: 0, wt: 0, sp: 22, moving: false, finishing: false }).current

  const go = (phase) => { S.phase = phase; S.t = 0; setUi({ phase, active: S.target }) }

  const jump = (i) => {
    const n = (i + N) % N
    if (n === S.target && VIEWING.includes(S.phase)) return
    S.target = n
    S.finishing = false
    go('walk')
  }
  const replay = () => {
    S.x = 40; S.dir = 1; S.target = 0; S.finishing = false; S.sp = 22
    autoRef.current = true
    setAuto(true)
    go('intro')
  }
  const toggleAuto = () => setAuto((v) => !v)
  useEffect(() => { autoRef.current = auto }, [auto])

  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); jump(S.target + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); jump(S.target - 1) }
  }

  /* masuk layar → tampilkan section (ada jaring pengaman timeout) */
  useEffect(() => {
    const el = secRef.current
    if (!el || !('IntersectionObserver' in window)) { setEntered(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setEntered(true) }, { threshold: 0.05 })
    io.observe(el)
    const t = setTimeout(() => setEntered(true), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])

  /* ===== mesin adegan: state, kamera, gambar ===== */
  useEffect(() => {
    const cv = cvRef.current
    const wrap = wrapRef.current
    if (!cv || !wrap) return
    const ctx = cv.getContext('2d')
    const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

    const bg = buildBg()
    const spr = buildSprites()
    const imgs = certs.map((c) => { if (!c.image) return null; const im = new Image(); im.src = c.image; return im })

    const size = { w: 800, h: 450, dpr: 1 }
    const cam = { cx: 260, cy: 100, lz: 0, ready: false }
    let visible = false
    let raf = 0
    let last = performance.now()

    const fit = () => {
      const w = wrap.clientWidth || 800
      const h = Math.round(w < 640 ? w * 0.95 : (w * 9) / 16)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.w = w; size.h = h; size.dpr = dpr
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      cv.style.height = `${h}px`
    }

    const zFrame = () => Math.min((size.w * 0.62) / FW, (size.h * 0.8) / FH)
    const zFollow = () => size.w / 220

    const camTarget = () => {
      const W = size.w
      switch (S.phase) {
        case 'intro':
          return S.t < 1.8 ? { cx: 260, cy: 100, z: W / 520 } : { cx: S.x + 8, cy: 152, z: W / 90 }
        case 'walk':
          return { cx: S.x + S.dir * 16, cy: 118, z: zFollow() }
        case 'turn':
          return { cx: S.x, cy: 152, z: W / 90 }
        case 'zoomin':
        case 'view':
          return { cx: fx(S.target), cy: FRAME_CY, z: zFrame() }
        case 'zoomout':
          return { cx: S.x, cy: 118, z: zFollow() }
        default: // outro
          return { cx: WORLD_W / 2, cy: 100, z: W / (WORLD_W + 60) }
      }
    }
    const K = { intro: 1.5, walk: 3.2, turn: 2.4, zoomin: 2.2, view: 3, zoomout: 2.2, outro: 1.3 }

    /* ---- logika adegan ---- */
    const step = (dt) => {
      S.t += dt
      S.clock += dt
      let moving = false
      switch (S.phase) {
        case 'intro': {
          const sx = fx(0)
          S.dir = 1; S.sp = 22
          if (S.x < sx) { S.x = Math.min(sx, S.x + 22 * dt); moving = true }
          if (S.t > 3.8) go('walk')
          break
        }
        case 'walk': {
          const d = fx(S.target) - S.x
          if (Math.abs(d) < 0.6) { S.x = fx(S.target); go('turn'); break }
          const sp = Math.max(46, Math.min(300, Math.abs(d) / 2.6))
          S.sp = sp
          S.dir = Math.sign(d)
          S.x += S.dir * Math.min(Math.abs(d), sp * dt)
          moving = true
          break
        }
        case 'turn':
          if (S.t > 1.1) go('zoomin')
          break
        case 'zoomin':
          if (S.t > 0.6 && (Math.abs(cam.lz - Math.log(zFrame())) < 0.08 || S.t > 2.2)) go('view')
          break
        case 'view':
          if (autoRef.current && S.t > VIEW_S) { S.finishing = S.target === N - 1; go('zoomout') }
          break
        case 'zoomout':
          if (S.t > 0.5 && (Math.abs(cam.lz - Math.log(zFollow())) < 0.12 || S.t > 1.8)) {
            if (S.finishing) go('outro')
            else { S.target = Math.min(S.target + 1, N - 1); go('walk') }
          }
          break
        case 'outro':
          if (autoRef.current && S.t > 5) { S.x = 40; S.dir = 1; S.target = 0; S.finishing = false; go('intro') }
          break
        default:
      }
      S.moving = moving
      if (moving) S.wt += dt * Math.pow(S.sp / 46, 0.6)

      // kamera mengejar target (zoom dihaluskan di skala log supaya terasa sinematik)
      const t = camTarget()
      const snap = reduce || !cam.ready
      const a = snap ? 1 : 1 - Math.exp(-dt * K[S.phase])
      cam.cx += (t.cx - cam.cx) * a
      cam.cy += (t.cy - cam.cy) * a
      cam.lz += (Math.log(t.z) - cam.lz) * a
      cam.ready = true
    }

    /* ---- gambar ---- */
    const R = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h) }

    const pixelCert = (ax, ay, aw, ah, accent, i) => {
      R(ax, ay, aw, ah, '#fffdf6')
      R(ax, ay, aw, 4, accent)
      R(ax + 3, ay + 7, aw - 6 - (i % 3) * 3, 2, '#2a2a3a')
      R(ax + 6, ay + 11, aw - 12, 1, '#a4a4b2')
      R(ax + 8, ay + 13, aw - 16 - (i % 2) * 4, 1, '#a4a4b2')
      R(ax + 4, ay + 20, 9, 1, '#2a2a3a'); R(ax + 6 + (i % 3), ay + 18, 2, 2, '#2a2a3a')
      const sx = ax + aw - 12
      R(sx, ay + 16, 7, 7, accent); R(sx + 1, ay + 17, 5, 5, '#ffc83d'); R(sx + 3, ay + 19, 1, 1, accent)
      R(sx + 1, ay + 23, 2, 3, accent); R(sx + 4, ay + 23, 2, 3, accent)
    }

    const drawFrame = (i, active) => {
      const c = certs[i]
      const cx = fx(i)
      const x = cx - FW / 2
      // lampu bingkai
      R(cx - 1, FT - 12, 2, 4, '#14141a'); R(cx - 10, FT - 8, 20, 2, '#14141a')
      R(cx - 7, FT - 6, 14, 1, active ? '#fff6c8' : '#b89a3c')
      // bingkai emas
      R(x + 2, FT + 2, FW, FH, 'rgba(0,0,0,0.28)')
      R(x, FT, FW, FH, '#b8791a')
      R(x, FT, FW, 1, '#ffc83d'); R(x, FT, 1, FH, '#ffc83d')
      R(x, FT + FH - 1, FW, 1, '#7a4d0c'); R(x + FW - 1, FT, 1, FH, '#7a4d0c')
      R(x + 3, FT + 3, FW - 6, FH - 6, '#5a3a0a')
      R(x + 4, FT + 4, FW - 8, FH - 8, '#f4efe4')
      const ax = x + 5, ay = FT + 5, aw = 38, ah = 26
      const im = imgs[i]
      if (im && im.complete && im.naturalWidth) {
        const r = aw / ah, ir = im.naturalWidth / im.naturalHeight
        let sx = 0, sy = 0, cw = im.naturalWidth, ch = im.naturalHeight
        if (ir > r) { cw = ch * r; sx = (im.naturalWidth - cw) / 2 } else { ch = cw / r; sy = (im.naturalHeight - ch) / 2 }
        ctx.imageSmoothingEnabled = true
        ctx.drawImage(im, sx, sy, cw, ch, ax, ay, aw, ah)
        ctx.imageSmoothingEnabled = false
      } else {
        pixelCert(ax, ay, aw, ah, c.accent, i)
      }
      R(ax + 4, ay, 2, ah, 'rgba(255,255,255,0.13)'); R(ax + 8, ay, 1, ah, 'rgba(255,255,255,0.09)')
      // plakat nomor
      R(cx - 9, FT + 39, 18, 7, '#14141a'); R(cx - 9, FT + 39, 18, 1, c.accent)
      digit(ctx, Math.floor((i + 1) / 10), cx - 4, FT + 41, '#fff')
      digit(ctx, (i + 1) % 10, cx, FT + 41, '#fff')
      // garis sorot bingkai aktif
      if (active) {
        const col = Math.floor(S.clock * 4) % 2 ? c.accent : '#ffc83d'
        R(x - 3, FT - 3, FW + 6, 2, col); R(x - 3, FT + FH + 1, FW + 6, 2, col)
        R(x - 3, FT - 3, 2, FH + 6, col); R(x + FW + 1, FT - 3, 2, FH + 6, col)
      }
    }

    const draw = () => {
      const z = Math.exp(cam.lz)
      const s = z * size.dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.fillStyle = '#0b0b10'
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.setTransform(s, 0, 0, s, Math.round(cv.width / 2 - cam.cx * s), Math.round(cv.height / 2 - cam.cy * s))
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(bg, 0, 0)

      const viewing = VIEWING.includes(S.phase)
      const half = size.w / z / 2 + 60

      // kerucut cahaya di bingkai yang ditonton
      if (viewing) {
        const cx = fx(S.target)
        for (let y = 62; y < 132; y += 2) {
          const ww = 34 + (y - 62) * 0.6
          R(Math.round(cx - ww / 2), y, Math.round(ww), 2, 'rgba(255,226,140,0.09)')
        }
      }
      for (let i = 0; i < N; i++) {
        if (Math.abs(fx(i) - cam.cx) > half) continue
        drawFrame(i, viewing && i === S.target)
      }

      // karakter
      const x0 = Math.round(S.x) - 6
      const y0 = FEET - 22
      R(x0 + 1, FEET - 1, 10, 2, 'rgba(0,0,0,0.35)')
      if (viewing) {
        ctx.drawImage(spr.back, x0, y0)
        if (Math.floor(S.clock * 3) % 2) { R(x0 + 9, y0 - 6, 1, 3, '#ffc83d'); R(x0 + 8, y0 - 5, 3, 1, '#ffc83d') }
      } else {
        const sp = spr.walk[S.moving ? Math.floor(S.wt / 0.16) % 4 : 0]
        if (S.dir < 0) { ctx.save(); ctx.translate(x0 + 12, y0); ctx.scale(-1, 1); ctx.drawImage(sp, 0, 0); ctx.restore() }
        else ctx.drawImage(sp, x0, y0)
      }
    }

    /* ---- interaksi kanvas ---- */
    const toWorld = (e) => {
      const r = cv.getBoundingClientRect()
      const z = Math.exp(cam.lz)
      return { x: cam.cx + (e.clientX - r.left - r.width / 2) / z, y: cam.cy + (e.clientY - r.top - r.height / 2) / z }
    }
    const hit = (p) => {
      for (let i = 0; i < N; i++) {
        if (Math.abs(p.x - fx(i)) <= FW / 2 + 2 && p.y >= FT - 2 && p.y <= FT + FH + 12) return i
      }
      return -1
    }
    const onClick = (e) => { const i = hit(toWorld(e)); if (i >= 0) jump(i) }
    const onMove = (e) => { cv.style.cursor = hit(toWorld(e)) >= 0 ? 'pointer' : 'default' }
    cv.addEventListener('click', onClick)
    cv.addEventListener('pointermove', onMove)

    /* ---- loop ---- */
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!visible) return
      step(dt)
      draw()
    }

    fit()
    if (reduce) {
      // tanpa animasi: langsung tampilkan sertifikat pertama
      S.x = fx(0); S.target = 0
      autoRef.current = false
      setAuto(false)
      go('view')
    }
    const ro = 'ResizeObserver' in window ? new ResizeObserver(fit) : null
    ro && ro.observe(wrap)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.15 })
    io.observe(wrap)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      cv.removeEventListener('click', onClick)
      cv.removeEventListener('pointermove', onMove)
      ro && ro.disconnect()
      io.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cur = certs[ui.active]
  const showCard = ui.phase === 'view'

  return (
    <section id="certificates" className={`ce ${entered ? 'is-in' : ''}`} ref={secRef}>
      <header className="ce__head">
        <div className="ce-r" style={{ '--i': 0 }}>
          <p className="ce__eyebrow">{certIntro.eyebrow}</p>
          <h2 className="ce__title">{certIntro.title}</h2>
        </div>
        <p className="ce__text ce-r" style={{ '--i': 1 }}>{certIntro.text}</p>
      </header>

      {/* layar "video" */}
      <div className="ce-screen ce-r" style={{ '--i': 2 }} ref={wrapRef}>
        <canvas
          ref={cvRef}
          role="img"
          aria-label="Animasi karakter pixel berjalan di galeri dan melihat 12 bingkai sertifikat"
        />
        <div className="ce-fx" aria-hidden="true" />

        <div className="ce-hud" aria-hidden="true">
          <span className="ce-hud__rec"><i />REC</span>
          <span className="ce-hud__cam">{LABEL[ui.phase]}</span>
          <span className="ce-hud__n">{pad(ui.active + 1)}/{pad(N)}</span>
        </div>

        {showCard && (
          <article className="ce-card" key={cur.id} style={{ '--accent': cur.accent }} aria-live="polite">
            <span className="ce-card__badge">{cur.badge}</span>
            <h3>{cur.title}</h3>
            <p className="ce-card__id">ID: {cur.code}</p>
            <div className="ce-card__row">
              <span>{cur.tag}</span>
              {cur.url && <a href={cur.url} target="_blank" rel="noopener noreferrer">Lihat kredensial ↗</a>}
            </div>
          </article>
        )}
      </div>

      {/* kontrol */}
      <div className="ce-ctrl ce-r" style={{ '--i': 3 }} onKeyDown={onKey}>
        <button type="button" onClick={() => jump(S.target - 1)} aria-label="Sertifikat sebelumnya">← Sebelumnya</button>
        <button type="button" onClick={() => jump(S.target + 1)} aria-label="Sertifikat berikutnya">Berikutnya →</button>
        <button type="button" onClick={toggleAuto} aria-pressed={auto}>{auto ? '❚❚ Auto' : '▶ Auto'}</button>
        <button type="button" onClick={replay}>↻ Putar ulang</button>
        <span className="ce-ctrl__hint">Klik bingkai di layar atau nomor di bawah.</span>
      </div>

      <ol className="ce-strip ce-r" style={{ '--i': 4 }}>
        {certs.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              className={i === ui.active ? 'is-on' : ''}
              style={{ '--accent': c.accent }}
              title={c.title}
              aria-label={`${i + 1}. ${c.title}`}
              aria-current={i === ui.active}
              onClick={() => jump(i)}
            >
              {pad(i + 1)}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
