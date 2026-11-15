/* ============================================================
   PERANGKAT 3D — murni CSS 3D (tanpa three.js, tanpa paket tambahan)
   Pasangan file: devpage.css (kelas dv-*). Ukuran (px) harus sama dengan angka di CSS:
   Laptop: lebar 560, kedalaman 370, tebal alas 16, tinggi layar 370, tebal layar 12
   HP    : 190 × 390, tebal 18
   ============================================================ */
const LW = 560, LD = 370, LT = 16, LH = 370, LL = 12

/* balok: 6 sisi yang disusun dengan transform 3D */
function Cuboid({ w, h, d, faces = {}, className = '', style }) {
  return (
    <div className={`dv-box ${className}`} style={{ left: -w / 2, top: -h / 2, width: w, height: h, ...style }}>
      <div className="dv-f dv-f--front" style={{ width: w, height: h, transform: `translateZ(${d / 2}px)` }}>{faces.front}</div>
      <div className="dv-f dv-f--back" style={{ width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)` }}>{faces.back}</div>
      <div className="dv-f dv-f--right" style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)` }} />
      <div className="dv-f dv-f--left" style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)` }} />
      <div className="dv-f dv-f--top" style={{ width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)` }}>{faces.top}</div>
      <div className="dv-f dv-f--bottom" style={{ width: w, height: d, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)` }}>{faces.bottom}</div>
    </div>
  )
}

const Empty = ({ file }) => (
  <div className="dv-empty">
    <b>TARUH FOTO</b>
    <span>src/assets/dev/{file}</span>
  </div>
)

export function Laptop({ src }) {
  return (
    <div className="dv-lap">
      {/* alas + keyboard */}
      <Cuboid
        className="dv-base" w={LW} h={LT} d={LD}
        faces={{ top: <div className="dv-deck"><i className="dv-kb" /><i className="dv-tp" /></div> }}
      />
      {/* engsel: sudut layar dikendalikan --open (0 = tertutup) saat scroll */}
      <div className="dv-hinge">
        <Cuboid
          className="dv-lid" w={LW} h={LH} d={LL}
          style={{ left: -LW / 2, top: -LH, transform: `translateZ(${-LL / 2}px)` }}
          faces={{
            front: (
              <div className="dv-scr">
                <div className="dv-scr__img">
                  {src ? <img src={src} alt="" draggable="false" /> : <Empty file="laptop.jpg / .png" />}
                </div>
                <i className="dv-cam" />
                <span className="dv-glare" />
              </div>
            ),
            back: <div className="dv-lidback"><b>TIARA<i /></b></div>,
          }}
        />
      </div>
    </div>
  )
}

export function Phone({ src }) {
  const N = 14, D = 18
  return (
    <div className="dv-ph">
      {/* rangka: tumpukan lapisan persegi membulat = ketebalan dengan sudut melengkung */}
      {Array.from({ length: N }, (_, i) => (
        <i key={i} className="dv-ph__l" style={{ transform: `translateZ(${(-D / 2 + (i * D) / (N - 1)).toFixed(2)}px)` }} />
      ))}
      <div className="dv-ph__front" style={{ transform: `translateZ(${D / 2 + 0.5}px)` }}>
        <div className="dv-ph__scr">
          {src ? <img src={src} alt="" draggable="false" /> : <Empty file="phone.jpg / .png" />}
        </div>
        <i className="dv-ph__isl" />
      </div>
      <div className="dv-ph__back" style={{ transform: `rotateY(180deg) translateZ(${D / 2 + 0.5}px)` }}>
        <div className="dv-ph__cam"><i /><i /><i /></div>
        <b className="dv-ph__mark">ARVI<i /></b>
      </div>
    </div>
  )
}
