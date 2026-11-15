// ============================================================
//  FOTO HERO (cutout transparan, hanya orangnya)
//  Taruh di:  src/assets/hero/
//     me-1.png   → pose utama (tampil di awal)
//     me-2.png   → pose kedua (muncul dengan efek glitch saat kursor masuk)
//  Format boleh png / webp (yang punya transparansi). jpg juga bisa, tapi akan tampil sebagai kotak.
//  Tips: ukuran kanvas kedua foto SAMA & posisi badan mirip, supaya saat berganti tidak "loncat".
//  Kalau me-1 belum ada → otomatis pakai foto lama (hero.*) dalam bingkai kotak.
//
//  BULAN di belakang foto (PNG transparan), taruh di folder yang sama:
//     moon-1.png → bulan untuk pose 1
//     moon-2.png → bulan untuk pose 2 (berganti bersamaan dengan glitch)
//  Kalau moon-1 belum ada → tampil cakram hitam (jadi putih saat pose berganti).
//  Kalau moon-2 belum ada → bulan pertama dipakai untuk kedua pose.
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
const moonOne = find('moon-1')
const moonTwo = find('moon-2')

export const heroPhotos = {
  cutout: Boolean(one),            // true = pakai foto transparan
  one: one || profile.heroImg,     // pose utama
  two: two || one || profile.heroImg, // pose kedua (kalau belum ada, pakai pose utama)
  hasSecond: Boolean(two),
  moonOne,                          // null = pakai cakram hitam
  moonTwo: moonTwo || moonOne,
}
