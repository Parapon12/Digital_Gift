import { LINE_URL, SHOW_LINE, TIKTOK_URL, homeHash } from '../lib/line'

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.6 5.82A6.48 6.48 0 0 1 19.5 5.5v3.1a9.5 9.5 0 0 1-4.08-.9v7.55A6.25 6.25 0 1 1 9.4 9.1v3.18a3.12 3.12 0 1 0 2.22 3V2.5h3.12c.2 1.22.86 2.33 1.86 3.32Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="c-footer">
      <div className="c-footer-inner container">
        <div>
          <p className="c-footer-brand">Digital Gift</p>
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
      <div className="c-footer-social">
        <a
          href={TIKTOK_URL}
          className="c-btn c-btn-tiktok"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TikTokIcon />
          ไปที่ TikTok
        </a>
      </div>
      <p className="c-footer-copy">© 2026 Digital Gift</p>
    </footer>
  )
}
