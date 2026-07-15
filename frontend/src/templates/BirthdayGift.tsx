import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { asset } from '../lib/asset'
import type { BirthdayContent, Gift } from '../types'

type Panel = 'message' | 'memories' | 'game' | 'gift' | null

function ModalShell({
  title,
  onClose,
  children,
  wide,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="bd-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`bd-modal ${wide ? 'is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="bd-modal-close" onClick={onClose} aria-label="ปิด">
          ×
        </button>
        <h3 className="bd-modal-title">{title}</h3>
        <div className="bd-modal-body">{children}</div>
      </div>
    </div>
  )
}

function MemoryCarousel({ photos }: { photos: string[] }) {
  const [index, setIndex] = useState(0)
  const total = photos.length

  useEffect(() => {
    setIndex(0)
  }, [photos])

  if (!total) {
    return <p className="bd-empty">ยังไม่มีรูปความทรงจำ</p>
  }

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + total) % total)
  }

  return (
    <div className="bd-carousel">
      <div className="bd-carousel-frame">
        <img src={asset(photos[index])} alt="" />
        <p className="bd-carousel-count">
          {index + 1} / {total}
        </p>
      </div>
      {total > 1 ? (
        <div className="bd-carousel-nav">
          <button type="button" onClick={() => go(-1)} aria-label="รูปก่อนหน้า">
            ‹
          </button>
          <button type="button" onClick={() => go(1)} aria-label="รูปถัดไป">
            ›
          </button>
        </div>
      ) : null}
    </div>
  )
}

function BlowCandleGame({
  title,
  reward,
}: {
  title: string
  reward: string
}) {
  const [blows, setBlows] = useState(0)
  const done = blows >= 3

  return (
    <div className="bd-game">
      <p className="bd-game-hint">{done ? 'ไฟดับแล้ว!' : `${title} — แตะเค้กให้ครบ 3 ครั้ง`}</p>
      <button
        type="button"
        className={`bd-cake-btn ${done ? 'is-done' : ''}`}
        onClick={() => !done && setBlows((n) => Math.min(3, n + 1))}
        disabled={done}
      >
        <span className="bd-cake-emoji" aria-hidden>
          {done ? '🎂✨' : '🕯️🎂'}
        </span>
        <span>{done ? 'เป่าสำเร็จ!' : `เป่าอีก ${3 - blows} ครั้ง`}</span>
      </button>
      {done ? <p className="bd-game-reward">{reward}</p> : null}
    </div>
  )
}

function GiftReveal({
  title,
  message,
  imageUrl,
}: {
  title: string
  message: string
  imageUrl?: string
}) {
  const [opened, setOpened] = useState(false)

  return (
    <div className={`bd-gift-reveal ${opened ? 'is-open' : ''}`}>
      {!opened ? (
        <button type="button" className="bd-gift-box" onClick={() => setOpened(true)}>
          <span aria-hidden>🎁</span>
          <strong>แตะเพื่อเปิด{title}</strong>
        </button>
      ) : (
        <>
          {imageUrl ? <img className="bd-gift-photo" src={asset(imageUrl)} alt="" /> : null}
          <p className="bd-gift-text">{message}</p>
        </>
      )}
    </div>
  )
}

export function BirthdayGift({ gift }: { gift: Gift }) {
  const content = (gift.content || {}) as BirthdayContent
  const [panel, setPanel] = useState<Panel>(null)

  const photos = useMemo(
    () => (content.photos || []).map((p) => p.trim()).filter(Boolean),
    [content.photos],
  )

  const headline = content.headline || 'สุขสันต์ วันเกิด'
  const [line1, line2] = useMemo(() => {
    const parts = headline.trim().split(/\s+/)
    if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')]
    return [headline, '']
  }, [headline])

  const heroImg = content.heroImageUrl || 'birthday/cake-hero.png'
  const special =
    content.specialMessage ||
    content.message ||
    'ขอให้เป็นวันที่เต็มไปด้วยรอยยิ้ม ความสุข และสิ่งดี ๆ'
  const thanks =
    content.closingMessage || 'ขอบคุณที่เข้ามาเป็นความสุขในชีวิตฉันนะ'

  const cards = [
    {
      id: 'message' as const,
      icon: '💌',
      title: 'ข้อความพิเศษ',
      sub: 'ส่งข้อความจากใจถึงเธอ',
    },
    {
      id: 'memories' as const,
      icon: '🖼️',
      title: 'ความทรงจำ',
      sub: 'รวมภาพความประทับใจของเรา',
    },
    {
      id: 'game' as const,
      icon: '🍰',
      title: 'เกมวันเกิด',
      sub: 'เล่นเกมสนุก ๆ รับคะแนนพิเศษ',
    },
    {
      id: 'gift' as const,
      icon: '🎁',
      title: 'ของขวัญให้เธอ',
      sub: 'เปิดกล่องของขวัญสุดพิเศษ',
    },
  ]

  return (
    <div className="bd-root">
      <section className="bd-hero">
        <div className="bd-hero-visual">
          <img src={asset(heroImg)} alt="" />
          <div className="bd-hero-wave" aria-hidden />
        </div>
        <div className="bd-hero-copy">
          <p className="bd-kicker">BIRTHDAY</p>
          <h1>
            <span className="bd-h-a">{line1}</span>
            {line2 ? <span className="bd-h-b">{line2}</span> : null}
          </h1>
          <p className="bd-to">{gift.recipient_name || 'เธอ'}</p>
          <p className="bd-msg">
            {content.message ||
              'ขอให้เป็นวันที่เต็มไปด้วยรอยยิ้ม ความสุข และสิ่งดี ๆ ในทุก ๆ วันนะ'}
          </p>
          <p className="bd-from">— {gift.sender_name || 'ฉัน'}</p>
          <span className="bd-doodle bd-d1" aria-hidden>
            ♡
          </span>
          <span className="bd-doodle bd-d2" aria-hidden>
            ♡
          </span>
        </div>
      </section>

      <section className="bd-cards">
        {cards.map((c) => (
          <button
            key={c.id}
            type="button"
            className="bd-card"
            onClick={() => setPanel(c.id)}
          >
            <span className="bd-card-icon" aria-hidden>
              {c.icon}
            </span>
            <span className="bd-card-text">
              <strong>{c.title}</strong>
              <small>{c.sub}</small>
            </span>
            <span className="bd-card-chev" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </section>

      <footer className="bd-thanks">
        <p>
          <span aria-hidden>♡</span> {thanks} <span aria-hidden>♡</span>
        </p>
      </footer>

      {panel === 'message' ? (
        <ModalShell title="ข้อความพิเศษ" onClose={() => setPanel(null)}>
          {special.split(/\n+/).map((p, i) => (
            <p key={i} className="bd-special-line">
              {p}
            </p>
          ))}
        </ModalShell>
      ) : null}

      {panel === 'memories' ? (
        <ModalShell title="ความทรงจำ" onClose={() => setPanel(null)} wide>
          <MemoryCarousel photos={photos} />
        </ModalShell>
      ) : null}

      {panel === 'game' ? (
        <ModalShell title="เกมวันเกิด" onClose={() => setPanel(null)}>
          <BlowCandleGame
            title={content.gameTitle || 'เป่าเทียนวันเกิด'}
            reward={content.gameMessage || 'ขอให้ทุกคำอธิษฐานเป็นจริงนะ'}
          />
        </ModalShell>
      ) : null}

      {panel === 'gift' ? (
        <ModalShell title={content.giftTitle || 'ของขวัญให้เธอ'} onClose={() => setPanel(null)}>
          <GiftReveal
            title={content.giftTitle || 'ของขวัญ'}
            message={
              content.giftMessage ||
              'เปิดกล่องนี้แล้ว… ของขวัญจริงคือเธอที่อยู่ในชีวิตฉันทุกวัน'
            }
            imageUrl={content.giftImageUrl}
          />
        </ModalShell>
      ) : null}
    </div>
  )
}
