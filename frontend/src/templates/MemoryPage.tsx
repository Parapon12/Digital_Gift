import { useEffect, useMemo, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import type { Gift, MemoryPageContent, MemoryPageEntry, MemoryTheme } from '../types'

const THEME_LABEL: Record<MemoryTheme, string> = {
  couple: 'คู่รัก',
  friends: 'เพื่อน',
  family: 'ครอบครัว',
}

function entryKey(entry: MemoryPageEntry, index: number) {
  return entry.id || `m-${index}`
}

function MemoryEntryBlock({
  entry,
  index,
  total,
  unlocked,
  opened,
  onReveal,
  onOpen,
}: {
  entry: MemoryPageEntry
  index: number
  total: number
  unlocked: boolean
  opened: boolean
  onReveal: () => void
  onOpen: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const side = index % 2 === 0 ? 'left' : 'right'
  const tilt = index % 2 === 0 ? -2.2 : 2.4
  const hasFeeling = Boolean(entry.secretNote?.trim())

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit?.isIntersecting) {
          setVisible(true)
          if (hasFeeling) onReveal()
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasFeeling, onReveal])

  return (
    <article
      ref={ref}
      className={`mp-entry side-${side} ${visible ? 'is-inview' : ''} ${opened ? 'is-opened' : ''}`}
      style={{
        ['--tilt' as string]: `${tilt}deg`,
        ['--delay' as string]: `${(index % 4) * 0.06}s`,
      }}
    >
      <div className="mp-rail" aria-hidden>
        <span className="mp-rail-dot" />
        {index < total - 1 ? <span className="mp-rail-line" /> : null}
      </div>

      <div className="mp-card">
        <div className="mp-chapter">
          ความทรงจำ {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </div>

        <div className="mp-polaroid">
          <span className="mp-tape" aria-hidden />
          <div className="mp-frame">
            <img src={asset(entry.imageUrl)} alt="" loading="lazy" />
          </div>
          <div className="mp-glint" aria-hidden />
        </div>

        <div className="mp-meta">
          {entry.date ? <time className="mp-date">{entry.date}</time> : null}
          <p className="mp-place-label">ที่นี่</p>
          <p className="mp-place">📍 {entry.caption}</p>
        </div>

        {hasFeeling ? (
          <div className={`mp-note ${opened ? 'is-open' : unlocked ? 'is-ready' : ''}`}>
            {!opened ? (
              <button
                type="button"
                className="mp-note-seal"
                onClick={onOpen}
                disabled={!unlocked}
                aria-label={unlocked ? 'เปิดอ่านความรู้สึก' : 'เลื่อนมาถึงเพื่อปลดล็อก'}
              >
                <span className="mp-note-frame" aria-hidden>
                  <span className="mp-note-icon">✉</span>
                </span>
                <span className="mp-note-copy">
                  <strong>{unlocked ? 'เปิดอ่านความรู้สึก' : 'เลื่อนเข้ามาใกล้…'}</strong>
                  <small>ใต้รูปบอกแค่ที่ — อ่านตรงนี้ถึงเรื่องในใจ</small>
                </span>
                {unlocked ? <span className="mp-note-spark" aria-hidden>✦</span> : null}
              </button>
            ) : (
              <blockquote className="mp-note-body">
                <div className="mp-note-ornament" aria-hidden>
                  <span />
                  <em>ความรู้สึกตรงนี้</em>
                  <span />
                </div>
                <p className="mp-note-text">{entry.secretNote}</p>
              </blockquote>
            )}
          </div>
        ) : null}
      </div>
    </article>
  )
}

function ThankYouLetter({
  title,
  body,
  sender,
  recipient,
}: {
  title: string
  body: string
  sender: string
  recipient: string
}) {
  const wrapRef = useRef<HTMLElement>(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit?.isIntersecting) setReady(true)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const paragraphs = body.split(/\n+/).map((p) => p.trim()).filter(Boolean)

  return (
    <section
      ref={wrapRef}
      className={`mp-letter ${ready ? 'is-ready' : ''} ${open ? 'is-open' : ''}`}
    >
      <p className="mp-letter-eyebrow">ถึงท้ายสุดของสมุดเล่มนี้</p>
      <h2 className="mp-letter-heading">จดหมายขอบคุณ</h2>
      <p className="mp-letter-lead">ไม่ใช่แค่รูป — แต่ว่าขอบคุณที่เดินทางมาด้วยกัน</p>

      {!open ? (
        <button
          type="button"
          className="mp-envelope"
          onClick={() => setOpen(true)}
          disabled={!ready}
          aria-label="เปิดจดหมายขอบคุณ"
        >
          <span className="mp-envelope-flap" aria-hidden />
          <span className="mp-envelope-body">
            <span className="mp-envelope-to">ถึง {recipient}</span>
            <span className="mp-envelope-cta">
              {ready ? 'แตะเพื่อเปิดจดหมายใหญ่' : 'เลื่อนมาถึงตรงนี้…'}
            </span>
          </span>
          <span className="mp-envelope-seal" aria-hidden>♥</span>
        </button>
      ) : (
        <article className="mp-letter-paper">
          <p className="mp-letter-title">{title}</p>
          {paragraphs.map((p, i) => (
            <p key={i} className="mp-letter-line">{p}</p>
          ))}
          <p className="mp-letter-sign">จากใจ — {sender}</p>
        </article>
      )}
    </section>
  )
}

export function MemoryPage({ gift }: { gift: Gift }) {
  const content = (gift.content || {}) as MemoryPageContent
  const theme = (content.theme || 'couple') as MemoryTheme
  const entries = useMemo(
    () => (content.entries || []).filter((e) => e.imageUrl && e.caption),
    [content.entries],
  )

  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({})
  const [opened, setOpened] = useState<Record<string, boolean>>({})
  const [musicOn, setMusicOn] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [hasMoreBelow, setHasMoreBelow] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const letterTitle = content.letterTitle || content.closingTitle || 'ขอบคุณที่เป็นเธอ'
  const letterBody =
    content.letterBody ||
    content.closingMessage ||
    'ขอบคุณที่เป็นส่วนหนึ่งของเรื่องราวนี้'

  useEffect(() => {
    if (!content.musicUrl) return
    const audio = new Audio(asset(content.musicUrl))
    audio.loop = true
    audio.volume = 0.28
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [content.musicUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn) {
      void audio.play().catch(() => setMusicOn(false))
    } else {
      audio.pause()
    }
  }, [musicOn])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = Math.max(1, el.scrollHeight - el.clientHeight)
      const top = el.scrollTop || window.scrollY || 0
      const remaining = el.scrollHeight - (top + el.clientHeight)
      const p = Math.min(1, top / max)
      setProgress(p)
      if (top > 40) setScrolled(true)
      setHasMoreBelow(remaining > 140)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const openCount = Object.values(opened).filter(Boolean).length
  const secretTotal = entries.filter((e) => e.secretNote?.trim()).length

  const nudgeDown = () => {
    window.scrollBy({ top: Math.max(280, window.innerHeight * 0.55), behavior: 'smooth' })
  }

  return (
    <div className={`mp-root theme-${theme}`}>
      <div className="mp-progress" aria-hidden>
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>

      <button
        type="button"
        className={`mp-more-hint ${hasMoreBelow ? 'is-visible' : ''}`}
        onClick={nudgeDown}
        aria-label="ยังมีด้านล่าง เลื่อนลงต่อ"
      >
        <span className="mp-more-hint-text">ยังมีด้านล่าง</span>
        <span className="mp-more-hint-arrow" aria-hidden>
          <i />
          <i />
        </span>
      </button>

      <div className="mp-floaters" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} style={{ ['--i' as string]: i }} />
        ))}
      </div>

      <div className="mp-paper" aria-hidden />
      <div className="mp-grain" aria-hidden />

      <header className="mp-hero">
        <p className="mp-eyebrow">Memory page · {THEME_LABEL[theme]}</p>
        <h1>{content.title || gift.title || 'สมุดความทรงจำ'}</h1>
        <p className="mp-to">
          ถึง {gift.recipient_name || 'เธอ'} — จาก {gift.sender_name || 'ฉัน'}
        </p>
        {content.intro ? <p className="mp-intro">{content.intro}</p> : null}

        <ul className="mp-howto">
          <li><strong>ใต้รูป</strong> = ที่ไหน</li>
          <li><strong>เปิดซอง</strong> = ความรู้สึก</li>
          <li><strong>ท้ายสุด</strong> = จดหมายขอบคุณ</li>
        </ul>

        {content.musicUrl ? (
          <button
            type="button"
            className={`mp-music-btn ${musicOn ? 'is-on' : ''}`}
            onClick={() => setMusicOn((v) => !v)}
          >
            {musicOn ? 'เสียงเบา ๆ กำลังเล่น' : 'เปิดเสียงประกอบ'}
          </button>
        ) : null}

        <div className={`mp-scroll-cue ${scrolled ? 'is-hidden' : ''}`} aria-hidden>
          <span>เลื่อนลง</span>
          <i />
        </div>
      </header>

      <div className="mp-stream">
        {entries.map((entry, i) => {
          const key = entryKey(entry, i)
          return (
            <MemoryEntryBlock
              key={key}
              entry={entry}
              index={i}
              total={entries.length}
              unlocked={!!unlocked[key]}
              opened={!!opened[key]}
              onReveal={() => setUnlocked((prev) => (prev[key] ? prev : { ...prev, [key]: true }))}
              onOpen={() => setOpened((prev) => ({ ...prev, [key]: true }))}
            />
          )
        })}
      </div>

      <div className="mp-closing">
        {secretTotal > 0 ? (
          <p className="mp-opened-count">
            อ่านความรู้สึกแล้ว {openCount}/{secretTotal}
          </p>
        ) : null}

        <ThankYouLetter
          title={letterTitle}
          body={letterBody}
          sender={gift.sender_name || 'ฉัน'}
          recipient={gift.recipient_name || 'เธอ'}
        />
      </div>
    </div>
  )
}
