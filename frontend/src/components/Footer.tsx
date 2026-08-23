import { LINE_URL, SHOW_LINE, homeHash } from '../lib/line'

export function Footer() {
  return (
    <footer className="c-footer">
      <div className="c-footer-inner container">
        <div>
          <p className="c-footer-brand">GiftLove</p>
          <p className="c-footer-desc">ของขวัญดิจิทัลเฉพาะบุคคล ส่งผ่านลิงก์เดียว</p>
        </div>
        <div className="c-footer-links">
          <a href={homeHash('demos')}>ตัวอย่าง</a>
          <a href={homeHash('how')}>ขั้นตอน</a>
          {SHOW_LINE ? (
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer">LINE</a>
          ) : null}
        </div>
      </div>
      <p className="c-footer-copy">© 2026 GiftLove Studio</p>
    </footer>
  )
}
