import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Gift, LoveAdventureContent, MemoryItem } from '../types'
import AdventureScene, { type AdventureWorldMode } from './love-adventure/AdventureScene'
import { AdventureErrorBoundary } from './love-adventure/AdventureErrorBoundary'
import {
  FINALE_X,
  PATH_START,
  STOP_PLACES,
  buildStoryStops,
  walkDurationMs,
} from './love-adventure/constants'

type WalkIntent = 'story' | 'finale' | null

const DEFAULT_MEMORIES: MemoryItem[] = [
  { title: 'วันแรกที่เจอ', text: 'ยิ้มของเธอทำให้โลกช้าลง ทุกอย่างดูสว่างขึ้นทันที' },
  { title: 'ทริปด้วยกัน', text: 'เสียงหัวเราะดังก้องในความทรงจำ แม้วันเวลาจะผ่านไป' },
  { title: 'วันที่เหนื่อย', text: 'เธอยังเป็นที่พักใจของฉัน ในวันที่โลกดูหนักเกินไป' },
  { title: 'วันนี้', text: 'ยังเลือกเธอเหมือนเดิม และอยากเดินต่อไปด้วยกัน' },
]

export function LoveAdventure3D({ gift }: { gift: Gift }) {
  const content = gift.content as LoveAdventureContent
  const memories: MemoryItem[] = useMemo(() => {
    const raw = content.memories?.filter((m) => m.title || m.text) ?? []
    return (raw.length ? raw.slice(0, 5) : DEFAULT_MEMORIES)
  }, [content.memories])

  const storyStops = useMemo(() => buildStoryStops(memories.length), [memories.length])

  const [mode, setMode] = useState<AdventureWorldMode>('intro')
  const [storyIndex, setStoryIndex] = useState(0)
  const [walkTarget, setWalkTarget] = useState(PATH_START)
  const [walkIntent, setWalkIntent] = useState<WalkIntent>(null)
  const [showMessage, setShowMessage] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const posRef = useRef(PATH_START)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const walkIntentRef = useRef<WalkIntent>(null)
  walkIntentRef.current = walkIntent

  useEffect(() => {
    if (!content.musicUrl) return
    const audio = new Audio(content.musicUrl)
    audio.loop = true
    audio.volume = 0.32
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [content.musicUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicOn && mode !== 'intro') {
      void audio.play().catch(() => {})
    } else if (!musicOn) {
      audio.pause()
    }
  }, [musicOn, mode])

  useEffect(() => {
    if (mode !== 'zoom') return
    const t = window.setTimeout(() => {
      posRef.current = PATH_START
      const target = storyStops[0] ?? 3.5
      setWalkTarget(target)
      setWalkIntent('story')
      setStoryIndex(0)
      setMode('walk')
    }, 1200)
    return () => window.clearTimeout(t)
  }, [mode, storyStops])

  const finishWalk = () => {
    const intent = walkIntentRef.current
    if (!intent) return
    walkIntentRef.current = null
    posRef.current = walkTarget
    setWalkIntent(null)
    if (intent === 'finale') setMode('finale')
    else setMode('story')
  }

  // Backup only — primary completion is onArrive from the 3D scene
  useEffect(() => {
    if (mode !== 'walk' || !walkIntent) return
    const duration = walkDurationMs(posRef.current, walkTarget)
    const t = window.setTimeout(finishWalk, duration)
    return () => window.clearTimeout(t)
  }, [mode, walkTarget, walkIntent])

  const startAdventure = () => {
    setShowMessage(false)
    setStoryIndex(0)
    setWalkTarget(PATH_START)
    posRef.current = PATH_START
    setWalkIntent(null)
    setMusicOn(true)
    setMode('zoom')
  }

  const nextStory = () => {
    if (storyIndex < memories.length - 1) {
      const next = storyIndex + 1
      const target = storyStops[next] ?? walkTarget
      setStoryIndex(next)
      setWalkTarget(target)
      setWalkIntent('story')
      setMode('walk')
      return
    }
    setWalkTarget(FINALE_X - 2.1)
    setWalkIntent('finale')
    setMode('walk')
  }

  const goEnding = () => {
    setMode('ending')
    setShowMessage(true)
  }

  const current = memories[storyIndex] || memories[0]
  const place = STOP_PLACES[Math.min(storyIndex, STOP_PLACES.length - 1)]
  const catName = content.catName || 'Mochi'
  const totalSteps = memories.length
  const progressStep =
    mode === 'finale' || mode === 'ending'
      ? totalSteps
      : mode === 'intro' || mode === 'zoom'
        ? 0
        : storyIndex + 1

  const showHud = mode !== 'ending'
  const showStoryCard = mode === 'intro' || mode === 'story' || mode === 'finale'
  const cardTitle =
    mode === 'finale'
      ? `เจอ ${catName} แล้ว`
      : mode === 'intro'
        ? current.title || 'วันแรกที่เจอ'
        : current.title || 'ความทรงจำ'
  const cardBody =
    mode === 'finale'
      ? `แตะแมวบนแท่นหิน เพื่อเปิดข้อความพิเศษจาก ${gift.sender_name || 'ฉัน'}`
      : current.text
  const cardStep = mode === 'finale' ? memories.length : Math.max(1, mode === 'intro' ? 1 : storyIndex + 1)
  const cardCta =
    mode === 'intro'
      ? 'เริ่มเดินทาง'
      : mode === 'finale'
        ? 'เปิดข้อความ'
        : storyIndex >= memories.length - 1
          ? 'ไปยังจุดหมาย'
          : 'เดินต่อไป'
  const onCardAction =
    mode === 'intro' ? startAdventure : mode === 'finale' ? goEnding : nextStory

  return (
    <div className="adventure-root">
      <div className="adventure-stage">
        <AdventureErrorBoundary>
          <AdventureScene
            mode={mode}
            storyIndex={storyIndex}
            walkTarget={walkTarget}
            storyStops={storyStops}
            memoryCount={memories.length}
            catInteractive={mode === 'finale'}
            onCatClick={goEnding}
            onArrive={finishWalk}
          />
        </AdventureErrorBoundary>
      </div>

      {showHud && (
        <header className="adv-topbar">
          <p className="adv-mode">
            <span aria-hidden>♥</span>
            โหมดความรัก · ไปให้ถึงจุดที่สุดใจ
          </p>
          <Link to="/" className="adv-home">
            <span aria-hidden>⌂</span> กลับหน้าหลัก
          </Link>
        </header>
      )}

      {showHud && (
        <div className="adventure-progress" aria-hidden>
          {Array.from({ length: totalSteps }, (_, i) => (
            <span
              key={i}
              className={`adventure-dot ${i < progressStep ? 'done' : ''} ${
                (mode === 'story' && i === storyIndex) ||
                (mode === 'intro' && i === 0) ||
                (mode === 'finale' && i === totalSteps - 1)
                  ? 'current'
                  : ''
              }`}
            />
          ))}
        </div>
      )}

      {(mode === 'zoom' || mode === 'walk') && (
        <div className="adventure-overlay hint">
          <p>
            {walkIntent === 'finale'
              ? 'กำลังมุ่งหน้าสู่จุดหมาย...'
              : `กำลังเดินไปยัง${place?.label || 'จุดถัดไป'}...`}
          </p>
        </div>
      )}

      {showStoryCard && (
        <article className="adventure-overlay story-card adv-glass">
          <p className="adv-step">
            จุดหมายที่ {cardStep} / {memories.length}
          </p>
          <h2>
            <span aria-hidden>♥</span> {cardTitle} <span aria-hidden>♥</span>
          </h2>
          <p>{cardBody}</p>
          {mode === 'story' && current.imageUrl ? (
            <img src={current.imageUrl} alt="" className="tpl-photo" />
          ) : null}

          <div className="adv-reward">
            <span className="adv-reward-line" aria-hidden />
            <span className="adv-reward-heart" aria-hidden>♥</span>
            <span className="adv-reward-line" aria-hidden />
          </div>
          <p className="adv-reward-label">รางวัลเมื่อผ่านด่าน</p>
          <p className="adv-reward-item">
            <span aria-hidden>🎁</span>
            {mode === 'finale' ? 'เปิดข้อความพิเศษ' : 'ปลดล็อกความทรงจำพิเศษ'}
          </p>

          <button type="button" className="adv-cta" onClick={onCardAction}>
            {cardCta} <span aria-hidden>›</span>
          </button>
        </article>
      )}

      {showHud && (
        <div className="adv-music">
          <span className="adv-music-note" aria-hidden>♪</span>
          <p>{content.musicUrl ? 'เพลงพิเศษของเรา กำลังเล่น...' : 'เพลงพิเศษของเรา'}</p>
          <span className={`adv-eq ${musicOn ? 'on' : ''}`} aria-hidden>
            <i /><i /><i />
          </span>
          <button
            type="button"
            className="adv-music-btn"
            aria-label={musicOn ? 'หยุดเพลง' : 'เล่นเพลง'}
            onClick={() => setMusicOn((v) => !v)}
          >
            {musicOn ? '❚❚' : '▶'}
          </button>
        </div>
      )}

      {showMessage && (
        <div className="adventure-overlay ending-card adv-glass">
          <p className="adv-step">Message</p>
          <h2>
            <span aria-hidden>♥</span> สำหรับ {gift.recipient_name || 'เธอ'} <span aria-hidden>♥</span>
          </h2>
          <p>{content.message || 'รักนะ'}</p>
          <p className="tpl-from">— {gift.sender_name || 'ฉัน'}</p>
          <p className="adventure-cat-note">พร้อม {catName} ด้วยนะ</p>
          <button type="button" className="adv-cta" onClick={startAdventure}>
            เริ่มใหม่อีกครั้ง <span aria-hidden>›</span>
          </button>
        </div>
      )}
    </div>
  )
}
