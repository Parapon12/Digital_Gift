import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { asset } from '../lib/asset'
import type { TemplateInfo } from '../types'

export function HomePage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [lineUrl, setLineUrl] = useState('https://line.me/ti/p/@giftlove')

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => setTemplates([]))
    api.getSite().then((s) => setLineUrl(s.line_url)).catch(() => {})
  }, [])

  const { featured, occasions } = useMemo(() => ({
    featured: templates.filter((t) => t.status === 'complete'),
    occasions: templates.filter((t) => t.status === 'skeleton'),
  }), [templates])

  return (
    <div className="c-home">
      <section className="c-hero">
        <div className="c-hero-stage" aria-hidden>
          <img className="c-hero-banner" src={asset('brand/gift-hero-banner.png')} alt="" />
          <img className="c-float c-float-a" src={asset('brand/gift-box-a.png')} alt="" />
          <img className="c-float c-float-b" src={asset('brand/gift-box-b.png')} alt="" />
        </div>

        <div className="c-hero-copy">
          <p className="c-brand">GiftLove</p>
          <h1>ของขวัญดิจิทัล<br />ที่รู้สึกพิเศษจริง ๆ</h1>
          <p className="c-lead">
            เว็บไซต์เฉพาะบุคคล ส่งผ่านลิงก์เดียว — เราสร้างให้ครบ คุณแค่เล่าเรื่อง
          </p>
          <div className="c-cta">
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
              สั่งทำผ่าน LINE
            </a>
            <a href="#demos" className="c-btn c-btn-ghost">ดูตัวอย่าง</a>
          </div>
        </div>
      </section>

      <section className="c-section" id="demos">
        <div className="container">
          <header className="c-head">
            <p className="c-eyebrow">ตัวอย่าง</p>
            <h2>เลือกสไตล์ที่อยากลอง</h2>
            <p>เปิดเล่นได้ทันที ของจริงเราใส่ชื่อ รูป และข้อความให้</p>
          </header>

          <div className="c-grid">
            {featured.map((t) => (
              <Link key={t.key} to={`/demo/${t.demo_slug}`} className="c-card">
                <span className="c-card-tag">ครบ</span>
                <h3>{t.name_th}</h3>
                <p>{t.description}</p>
                <span className="c-card-link">เปิด demo →</span>
              </Link>
            ))}
          </div>

          {occasions.length > 0 && (
            <div className="c-occasions">
              <p className="c-eyebrow">โอกาสพิเศษ</p>
              <div className="c-pill-row">
                {occasions.map((t) => (
                  <Link key={t.key} to={`/demo/${t.demo_slug}`} className="c-pill">
                    {t.name_th}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="c-section c-how" id="how">
        <div className="container">
          <header className="c-head">
            <p className="c-eyebrow">ขั้นตอน</p>
            <h2>เรียบง่าย สามขั้น</h2>
            <p>ไม่ต้องทำเว็บเอง แค่ส่งรายละเอียดมา</p>
          </header>
          <ol className="c-steps">
            <li>
              <span>1</span>
              <div>
                <strong>คุยใน LINE</strong>
                <p>บอกโอกาส ชื่อ ข้อความ และรูป</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>เราสร้างให้</strong>
                <p>เลือกเทมเพลต ใส่เนื้อหา แล้วเผยแพร่</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>ส่งลิงก์</strong>
                <p>ได้ลิงก์พร้อม QR ให้มอบผู้รับ</p>
              </div>
            </li>
          </ol>
          <div className="c-how-cta">
            <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
              เริ่มคุยใน LINE
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
