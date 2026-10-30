import { useEffect, useRef } from 'react'

// Pakai di section lain:
//   const ref = useReveal()
//   <div ref={ref} className="reveal-group">
//     <div className="reveal-child" style={{ '--i': 0 }} />
//   </div>
export default function useReveal(threshold = 0.2) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}
