import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Interests from './components/Interests'
import Projects from './components/Projects'
import Gallery from './components/Gallery'
import Leadership from './components/Leadership'
import Skills from './components/Skills'
import Certificates from './components/Certificates'
import Finale from './components/Finale'
import Footer from './components/Footer'
import LeadershipDetail from './components/LeadershipDetail'

// Pindah halaman → mulai dari atas. Kalau ada #hash (mis. /#leadership) → scroll ke bagian itu.
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 80)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function Home() {
  return (
    <div className="page">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Interests />
        <Projects />
        <Gallery />
        <Leadership />
        <Certificates />
        <Skills />
        <Finale />  
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leadership/:slug" element={<LeadershipDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  )
}
