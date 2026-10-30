import './gallery.css'
import { useEffect, useState } from 'react'
import { gallery, galleryIntro } from '../data/gallery'
import useReveal from '../hooks/useReveal'

const FLIP_MS = 850 // samakan dengan durasi transform .gcard__flip di gallery.css

function Face({ photo, alt }) {
  return photo.src ? (
    <img src={photo.src} alt={alt} draggable="false" />
  ) : (
    <div className="gcard__ph" style={{ '--h': photo.hue }} aria-hidden="true"><span>{photo.label}</span></div>
  )
}

function GalleryCard({ item, i }) {
  const N = item.photos.length
  const [flips, setFlips] = useState(0)   // total flip → menentukan sudut putar
  const [front, setFront] = useState(0)   // indeks foto di sisi depan
  const [back, setBack] = useState(1 % N) // indeks foto di sisi belakang
  const [busy, setBusy] = useState(false)

  // sisi yang sedang menghadap pengguna
  const current = flips % 2 === 0 ? front : back

  // preload semua foto kartu ini supaya tidak ada kedip saat flip
  useEffect(() => {
    item.photos.forEach((p) => { if (p.src) new Image().src = p.src })
  }, [item])

  const flip = () => {
    if (busy || N < 2) return
    setBusy(true)
    const next = flips + 1
    setFlips(next)
    // setelah flip selesai, sisi yang tersembunyi diisi foto berikutnya (loop ke foto 1 setelah foto 4)
    setTimeout(() => {
      if (next % 2 === 1) setFront((back + 1) % N)
      else setBack((front + 1) % N)
      setBusy(false)
    }, FLIP_MS)
  }

  const ghostA = item.photos[(current + 1) % N]
  const ghostB = item.photos[(current + 2) % N]
  const ghostStyle = (p) => ({
    '--h': p.hue,
    backgroundImage: p.src ? `url(${p.src})` : undefined,
  })

  return (
    <button
      type="button"
      className={`gcard ${busy ? 'is-busy' : ''}`}
      style={{ '--i': i, '--flips': flips }}
      onClick={flip}
      aria-label={`${item.alt}. Foto ${current + 1} dari ${N}. Klik untuk melihat foto berikutnya.`}
    >
      <span className="gcard__ghost gcard__ghost--a" style={ghostStyle(ghostA)} aria-hidden="true" />
      <span className="gcard__ghost gcard__ghost--b" style={ghostStyle(ghostB)} aria-hidden="true" />

      <span className="gcard__lift">
        <span className="gcard__flip">
          <span className="gcard__face gcard__face--front">
            <Face photo={item.photos[front]} alt={`${item.alt} (foto ${front + 1})`} />
          </span>
          <span className="gcard__face gcard__face--back">
            <Face photo={item.photos[back]} alt={`${item.alt} (foto ${back + 1})`} />
          </span>
        </span>
        <span className="gcard__gloss" aria-hidden="true" />
        <span className="gcard__pill" aria-hidden="true">
          <span className="gcard__dots">
            {item.photos.map((_, k) => <i key={k} className={k === current ? 'on' : ''} />)}
          </span>
          <b>KLIK</b>
        </span>
      </span>
    </button>
  )
}

export default function Gallery() {
  const headRef = useReveal(0.3)
  const gridRef = useReveal(0.08)

  return (
    <section id="snap" className="sg">
      <header ref={headRef} className="sg__head reveal-group reveal-group--scroll">
        <div className="reveal-child" style={{ '--i': 0 }}>
          <p className="sg__eyebrow">{galleryIntro.eyebrow}</p>
          <h2 className="sg__title">{galleryIntro.title}</h2>
        </div>
        <p className="sg__text reveal-child" style={{ '--i': 1 }}>{galleryIntro.text}</p>
      </header>

      <div ref={gridRef} className="sg__grid">
        {gallery.map((item, i) => <GalleryCard key={item.id} item={item} i={i} />)}
      </div>
    </section>
  )
}
