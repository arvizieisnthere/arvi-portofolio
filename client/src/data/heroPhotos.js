// ============================================================
//  FOTO HERO (cutout transparan, hanya orangnya)
//  Taruh di:  src/assets/hero/
//     me-1.png   → pose utama (tampil di awal)
//     me-2.png   → pose kedua (muncul dengan efek glitch saat kursor masuk)
//  Format boleh png / webp (yang punya transparansi). jpg juga bisa, tapi akan tampil sebagai kotak.
//  Tips: ukuran kanvas kedua foto SAMA & posisi badan mirip, supaya saat berganti tidak "loncat".
//  Kalau me-1 belum ada → otomatis pakai foto lama (hero.*) dalam bingkai kotak.
// ============================================================
import { profile } from './profile'

const files = import.meta.glob('../assets/hero/*.{png,webp,jpg,jpeg}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const find = (name) => {
  const key = Object.keys(files).find((p) => p.split('/').pop().split('.')[0] === name)
  return key ? files[key] : null
}

const one = find('me-1')
const two = find('me-2')

export const heroPhotos = {
  cutout: Boolean(one),            // true = pakai foto transparan
  one: one || profile.heroImg,     // pose utama
  two: two || one || profile.heroImg, // pose kedua (kalau belum ada, pakai pose utama)
  hasSecond: Boolean(two),
}
