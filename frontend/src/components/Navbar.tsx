import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LINE_URL, SHOW_LINE, homeHash } from '../lib/line'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`c-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <NavLink to="/" className="c-nav-logo">Digital Gift</NavLink>
      <div className="c-nav-links">
        <a href={homeHash('demos')}>ตัวอย่าง</a>
        <a href={homeHash('how')}>ขั้นตอน</a>
        {SHOW_LINE ? (
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="c-nav-line">LINE</a>
        ) : null}
      </div>
    </nav>
  )
}
