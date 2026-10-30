import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Interests from './components/Interests'
import Projects from './components/Projects'
import Gallery from './components/Gallery'
import Leadership from './components/Leadership'
import Skills from './components/Skills'
import Awards from './components/Awards'
import Certificates from './components/Certificates'
import Finale from './components/Finale'
import Footer from './components/Footer'

export default function App() {
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
        <Skills />
        <Awards />
        <Certificates />
        <Finale />
        <Footer />
        {/* Section berikutnya (Awards, Note, Contact) ditaruh di sini */}
      </main>
    </div>
  )
}
