import { useEffect, useState } from 'react'
import { api } from '../api/client'

export function Footer() {
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@giftlove')

  useEffect(() => {
    api.getSite().then((s) => setLineUrl(s.line_url)).catch(() => {})
  }, [])

  return (
    <footer className="c-footer">
      <div className="c-footer-inner container">
        <div>
          <p className="c-footer-brand">GiftLove</p>
          <p className="c-footer-desc">ของขวัญดิจิทัลเฉพาะบุคคล ส่งผ่านลิงก์เดียว</p>
        </div>
        <div className="c-footer-links">
          <a href="/#demos">ตัวอย่าง</a>
          <a href="/#how">ขั้นตอน</a>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer">LINE</a>
        </div>
      </div>
      <p className="c-footer-copy">© 2026 GiftLove Studio</p>
    </footer>
  )
}
