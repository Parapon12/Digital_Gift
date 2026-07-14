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
  unlocked,
  opened,
  onReveal,
  onOpen,
}: {
  entry: MemoryPageEntry
  index: number
  unlocked: boolean
  opened: boolean
  onReveal: () => void
  onOpen: () => void
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const tilt = index % 2 === 0 ? -1.4 : 1.6

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([hit]) => {
        if (hit?.isIntersecting) {
          setVisible(true)
          if (entry.secretNote) onReveal()
        }
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [entry.secretNote, onReveal])

  return (
    <article
      ref={ref}
      className={`mp-entry ${visible ? 'is-inview' : ''}`}
      style={{ ['--tilt' as string]: `${tilt}deg` }}
    >
      <div className="mp-polaroid">
        <img src={asset(entry.imageUrl)} alt="" loading="lazy" />
      </div>
      <div className="mp-meta">
        {entry.date ? <time className="mp-date">{entry.date}</time> : null}
        <p className="mp-caption">{entry.caption}</p>
      </div>

      {entry.secretNote ? (
        <div className={`mp-note ${opened ? 'is-open' : unlocked ? 'is-ready' : ''}`}>
          {!opened ? (
            <button
              type="button"
              className="mp-note-seal"
              onClick={onOpen}
              disabled={!unlocked}
              aria-label={unlocked ? 'เปิดโน้ตลับ' : 'เลื่อนมาถึงเพื่อปลดล็อกโน้ต'}
            >
              <span className="mp-note-icon" aria-hidden>
                ✉
              </span>
              <span>{unlocked ? 'มีโน้ตลับ — แตะเพื่อเปิด' : 'เลื่อนเข้ามาใกล้ ๆ เพื่อปลดล็อก'}</span>
            </button>
          ) : (
            <blockquote className="mp-note-body">
              <p>{entry.secretNote}</p>
            </blockquote>
          )}
        </div>
      ) : null}
    </article>
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
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  return (
    <div className={`mp-root theme-${theme}`}>
      <div className="mp-paper" aria-hidden />
      <div className="mp-grain" aria-hidden />

      <header className="mp-hero">
        <p className="mp-eyebrow">Memory page · {THEME_LABEL[theme]}</p>
        <h1>{content.title || gift.title || 'สมุดความทรงจำ'}</h1>
        <p className="mp-to">
          ถึง {gift.recipient_name || 'เธอ'} — จาก {gift.sender_name || 'ฉัน'}
        </p>
        {content.intro ? <p className="mp-intro">{content.intro}</p> : null}
        <p className="mp-hint">เลื่อนลงช้า ๆ — บางหน้ามีโน้ตลับซ่อนอยู่</p>

        {content.musicUrl ? (
          <button
            type="button"
            className={`mp-music-btn ${musicOn ? 'is-on' : ''}`}
            onClick={() => setMusicOn((v) => !v)}
          >
            {musicOn ? 'เสียงเบา ๆ กำลังเล่น' : 'เปิดเสียงประกอบ'}
          </button>
        ) : null}
      </header>

      <div className="mp-spine" aria-hidden />

      <div className="mp-stream">
        {entries.map((entry, i) => {
          const key = entryKey(entry, i)
          return (
            <MemoryEntryBlock
              key={key}
              entry={entry}
              index={i}
              unlocked={!!unlocked[key]}
              opened={!!opened[key]}
              onReveal={() => setUnlocked((prev) => (prev[key] ? prev : { ...prev, [key]: true }))}
              onOpen={() => setOpened((prev) => ({ ...prev, [key]: true }))}
            />
          )
        })}
      </div>

      <footer className="mp-closing">
        <p className="mp-closing-eyebrow">บทสรุป</p>
        <h2>{content.closingTitle || 'และจากนี้…'}</h2>
        <p>{content.closingMessage || 'ขอบคุณที่เป็นส่วนหนึ่งของเรื่องราวนี้'}</p>
        <p className="mp-closing-sign">
          ด้วยรัก — {gift.sender_name || 'ฉัน'}
        </p>
      </footer>
    </div>
  )
}
