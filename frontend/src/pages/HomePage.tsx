import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { homepageDemos, LOCAL_TEMPLATES } from '../data/demos'
import { asset } from '../lib/asset'
import { LINE_URL, SHOW_LINE } from '../lib/line'
import type { TemplateInfo } from '../types'

export function HomePage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>(LOCAL_TEMPLATES)

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) return
    api.getTemplates().then(setTemplates).catch(() => setTemplates(LOCAL_TEMPLATES))
  }, [])

  const demos = useMemo(() => homepageDemos(templates), [templates])

  return (
    <div className="c-home">
      <section className="c-hero">
        <div className="c-hero-stage" aria-hidden>
          <img
            className="c-hero-banner"
            src={asset('brand/gift-hero-banner.jpg')}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <img
            className="c-float c-float-a"
            src={asset('brand/gift-box-a.webp')}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <img
            className="c-float c-float-b"
            src={asset('brand/gift-box-b.webp')}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="c-hero-copy">
          <p className="c-brand">Digital Gift</p>
          <h1>ของขวัญดิจิทัล<br />ที่รู้สึกพิเศษจริง ๆ</h1>
          <p className="c-lead">
            เว็บไซต์เฉพาะบุคคล ส่งผ่านลิงก์เดียว — เราสร้างให้ครบ คุณแค่เล่าเรื่อง
          </p>
          <div className="c-cta">
            {SHOW_LINE ? (
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
                สั่งทำผ่าน LINE
              </a>
            ) : null}
            <a href="#demos" className={`c-btn ${SHOW_LINE ? 'c-btn-ghost' : 'c-btn-primary'}`}>ดูตัวอย่าง</a>
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

          <div className="c-grid c-grid--demos">
            {demos.map((t) => (
              <Link
                key={t.key}
                to={`/demo/${t.demo_slug}`}
                className={`c-card${t.key === 'crocodile_blessing' ? ' c-card--gator' : ''}`}
              >
                <span className="c-card-tag">{t.key === 'crocodile_blessing' ? 'ใหม่' : 'ครบ'}</span>
                <h3>{t.name_th}</h3>
                <p>{t.description}</p>
                <span className="c-card-link">เปิด demo →</span>
              </Link>
            ))}
          </div>
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
                <strong>{SHOW_LINE ? 'คุยใน LINE' : 'เลือกแบบ'}</strong>
                <p>{SHOW_LINE ? 'บอกโอกาส ชื่อ ข้อความ และรูป' : 'เปิดตัวอย่างบนเว็บ เล่นได้ทันที'}</p>
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
          {SHOW_LINE ? (
            <div className="c-how-cta">
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="c-btn c-btn-primary">
                เริ่มคุยใน LINE
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
