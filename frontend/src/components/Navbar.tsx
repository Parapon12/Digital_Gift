import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getAdminToken } from '../api/admin'
import { api } from '../api/client'

const homeHash = (hash: string) => `${import.meta.env.BASE_URL || '/'}#${hash.replace(/^#/, '')}`

export function Navbar() {
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@giftlove')
  const [scrolled, setScrolled] = useState(false)
  const isAdmin = Boolean(getAdminToken())

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
        {isAdmin ? (
          <NavLink to="/admin" className="c-nav-admin">
            ← รายการของขวัญ
          </NavLink>
        ) : null}
        <a href={homeHash('demos')}>ตัวอย่าง</a>
        <a href={homeHash('how')}>ขั้นตอน</a>
        <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="c-nav-line">LINE</a>
      </div>
    </nav>
  )
}
