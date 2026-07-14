import { useEffect, useMemo, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import type { Gift, MemoryPageContent, MemoryPageEntry, MemoryTheme } from '../types'

const THEME_LABEL: Record<MemoryTheme, string> = {
  couple: 'คู่รัก',
  friends: 'เพื่อน',
  family: 'ครอบครัว',
}

type Attach = 'tape' | 'pin' | 'clip'
type Prop = 'flower' | 'sign' | 'cam' | 'van' | 'plane' | 'none'

function entryKey(entry: MemoryPageEntry, index: number) {
  return entry.id || `m-${index}`
}

function attachFor(i: number): Attach {
  return (['tape', 'pin', 'clip'] as const)[i % 3]
}

function propFor(i: number): Prop {
  return (['flower', 'sign', 'cam', 'van', 'plane', 'flower'] as const)[i % 6]
}

function ScrapProp({ kind }: { kind: Prop }) {
  if (kind === 'none') return null
  if (kind === 'flower') {
    return (
      <div className="mp-prop mp-prop-flower" aria-hidden>
        <span>❀</span>
        <span>✿</span>
        <span>🌿</span>
      </div>
    )
  }
  if (kind === 'sign') {
    return (
      <div className="mp-prop mp-prop-sign" aria-hidden>
        <div className="mp-signpost">
          <b>Memories</b>
          <b>Adventure</b>
          <b>Happiness</b>
          <i />
        </div>
      </div>
    )
  }
  if (kind === 'cam') {
    return (
      <div className="mp-prop mp-prop-cam" aria-hidden>
        <span className="mp-cam">📷</span>
        <span className="mp-compass">🧭</span>
      </div>
    )
  }
  if (kind === 'van') {
    return (
      <div className="mp-prop mp-prop-van" aria-hidden>
        <span>🚐</span>
      </div>
    )
  }
  return (
    <div className="mp-prop mp-prop-plane" aria-hidden>
      <svg viewBox="0 0 140 60" className="mp-plane-path">
        <path d="M8 40 C 40 8, 90 52, 128 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
      <span>✈</span>
    </div>
  )
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
  const tilt = index % 2 === 0 ? -2.8 : 3.1
  const attach = attachFor(index)
  const prop = propFor(index)
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
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasFeeling, onReveal])

  return (
    <article
      ref={ref}
      className={`mp-entry side-${side} attach-${attach} ${visible ? 'is-inview' : ''} ${opened ? 'is-opened' : ''}`}
      style={{
        ['--tilt' as string]: `${tilt}deg`,
        ['--delay' as string]: `${(index % 3) * 0.05}s`,
      }}
    >
      <div className="mp-spread">
        <ScrapProp kind={prop} />

        <div className="mp-polaroid">
          {attach === 'tape' ? <span className="mp-attach mp-washi" aria-hidden /> : null}
          {attach === 'pin' ? <span className="mp-attach mp-pin" aria-hidden /> : null}
          {attach === 'clip' ? <span className="mp-attach mp-clip" aria-hidden /> : null}
          <div className="mp-frame">
            <img src={asset(entry.imageUrl)} alt="" loading="lazy" />
          </div>
          {hasFeeling && index % 2 === 0 ? (
            <span className="mp-photo-flower" aria-hidden>❀</span>
          ) : null}
        </div>

        <div className="mp-notebook">
          <div className="mp-notebook-rings" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => <i key={i} />)}
          </div>
          <div className="mp-notebook-body">
            <p className="mp-nb-row">
              <span aria-hidden>📍</span>
              <span>สถานที่ : {entry.caption}</span>
            </p>
            {entry.date ? (
              <p className="mp-nb-row">
                <span aria-hidden>📅</span>
                <span>วันที่ : {entry.date}</span>
              </p>
            ) : null}
            <p className="mp-nb-row mp-nb-num">
              <span aria-hidden>✦</span>
              <span>ความทรงจำ {index + 1}/{total}</span>
            </p>
          </div>
        </div>

        {hasFeeling ? (
          <div className={`mp-note ${opened ? 'is-open' : unlocked ? 'is-ready' : ''}`}>
            {!opened ? (
              <button
                type="button"
                className="mp-torn-btn"
                onClick={onOpen}
                disabled={!unlocked}
              >
                <span className="mp-torn-edge" aria-hidden />
                <strong>{unlocked ? 'เปิดอ่านความรู้สึก' : 'เลื่อนมาใกล้ ๆ…'}</strong>
                <small>เศษกระดาษซ่อนข้อความไว้</small>
              </button>
            ) : (
              <blockquote className="mp-quote-card">
                <span className="mp-quote-mark" aria-hidden>“</span>
                <p>{entry.secretNote}</p>
                <span className="mp-quote-heart" aria-hidden>♡</span>
              </blockquote>
            )}
          </div>
        ) : null}

        <div className="mp-scrap-mini" aria-hidden>
          collect moments ♡
        </div>
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
    <section ref={wrapRef} className={`mp-letter ${ready ? 'is-ready' : ''} ${open ? 'is-open' : ''}`}>
      <p className="mp-letter-eyebrow">ท้ายสมุดเล่มนี้</p>
      <h2 className="mp-letter-heading">จดหมายขอบคุณ</h2>

      {!open ? (
        <button
          type="button"
          className="mp-envelope"
          onClick={() => setOpen(true)}
          disabled={!ready}
        >
          <span className="mp-envelope-flap" aria-hidden />
          <span className="mp-envelope-body">
            <span className="mp-envelope-to">ถึง {recipient}</span>
            <span className="mp-envelope-cta">
              {ready ? 'แตะเพื่อเปิดจดหมาย' : 'เลื่อนมาถึงตรงนี้…'}
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
    if (musicOn) void audio.play().catch(() => setMusicOn(false))
    else audio.pause()
  }, [musicOn])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = Math.max(1, el.scrollHeight - el.clientHeight)
      const top = el.scrollTop || window.scrollY || 0
      const remaining = el.scrollHeight - (top + el.clientHeight)
      setProgress(Math.min(1, top / max))
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

  return (
    <div className={`mp-root journal theme-${theme}`}>
      <div className="mp-progress" aria-hidden>
        <i style={{ transform: `scaleX(${progress})` }} />
      </div>

      <button
        type="button"
        className={`mp-more-hint ${hasMoreBelow ? 'is-visible' : ''}`}
        onClick={() => window.scrollBy({ top: Math.max(280, window.innerHeight * 0.55), behavior: 'smooth' })}
        aria-label="ยังมีด้านล่าง"
      >
        <span>ยังมีด้านล่าง</span>
        <span className="mp-more-hint-arrow" aria-hidden><i /><i /></span>
      </button>

      <div className="mp-bg" aria-hidden />

      <header className="mp-hero">
        <p className="mp-topbar">MEMORY PAGE <span aria-hidden>♥</span></p>
        <h1>{content.title || gift.title || 'ทริปเที่ยว ความทรงจำของเรา'}</h1>
        <p className="mp-sub">
          ~ ทุกการเดินทาง มีเรื่องราวดี ๆ ซ่อนอยู่เสมอ ~
        </p>
        <p className="mp-to">
          ถึง {gift.recipient_name || 'เธอ'} — จาก {gift.sender_name || 'ฉัน'}
        </p>
        {content.intro ? <p className="mp-intro">{content.intro}</p> : null}

        <div className="mp-hero-notebook">
          <div className="mp-notebook-rings" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => <i key={i} />)}
          </div>
          <div className="mp-notebook-body">
            <p className="mp-nb-row"><span>📍</span><span>ธีม : {THEME_LABEL[theme]}</span></p>
            <p className="mp-nb-row"><span>📷</span><span>ใต้รูป = ที่ไหน · เปิดเศษกระดาษ = ความรู้สึก</span></p>
            <p className="mp-nb-row"><span>✦</span><span>ท้ายสุด = จดหมายขอบคุณ</span></p>
          </div>
        </div>

        {content.musicUrl ? (
          <button
            type="button"
            className={`mp-music-btn ${musicOn ? 'is-on' : ''}`}
            onClick={() => setMusicOn((v) => !v)}
          >
            {musicOn ? '♪ กำลังเล่น' : '♪ เปิดเสียง'}
          </button>
        ) : null}
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
          <p className="mp-opened-count">อ่านความรู้สึกแล้ว {openCount}/{secretTotal}</p>
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
