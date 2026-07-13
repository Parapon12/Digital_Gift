import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { api } from '../api/client'

export function Navbar() {
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@giftlove')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    api.getSite().then((s) => setLineUrl(s.line_url)).catch(() => {})
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`c-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <NavLink to="/" className="c-nav-logo">GiftLove</NavLink>
      <div className="c-nav-links">
        <a href="/#demos">ตัวอย่าง</a>
        <a href="/#how">ขั้นตอน</a>
        <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="c-nav-line">LINE</a>
      </div>
    </nav>
  )
}
