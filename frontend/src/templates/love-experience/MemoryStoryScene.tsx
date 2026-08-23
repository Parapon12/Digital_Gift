import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { asset } from '../../lib/asset'
import type { Gift, MemoryStoryContent } from '../../types'
import { ExperienceShell } from './ExperienceShell'
import { HeartLoveAnimation } from './HeartLoveAnimation'
import { demoPath } from './nav'

const COUNTDOWN = [3, 2, 1]
const STORY_EASE = [0.22, 1, 0.36, 1] as const
const AUTO_SCROLL_EASE = [0.42, 0, 0.58, 1] as const
const AUTO_SCROLL_SEC = 2.05
const AUTO_SCROLL_SEC_LONG = 2.25
const AUTO_PAUSE_MS = 2200
const GALLERY_PAUSE_MS = 7800
const HEART_PAUSE_MS = 4800

function chunkPairs<T>(items: T[]): [T, T][] {
  const pairs: [T, T][] = []
  for (let i = 0; i < items.length; i += 2) {
    if (items[i + 1]) pairs.push([items[i], items[i + 1]])
  }
  return pairs
}

function PhotoPair({ urls, visible }: { urls: string[]; visible: boolean }) {
  return (
    <div className={`lx-memory-pair ${visible ? 'is-visible' : ''}`}>
      {urls.map((url, i) => (
        <div
          key={url}
          className={`lx-memory-frame ${i === 0 ? 'is-left' : 'is-right'}`}
          style={{ animationDelay: visible ? `${i * 0.12}s` : undefined }}
        >
          <img
            src={asset(url)}
            alt=""
            className={`lx-memory-photo ${visible ? 'is-in' : ''}`}
            style={{ animationDelay: visible ? `${i * 0.12}s` : undefined }}
          />
          <span className="lx-memory-shine" aria-hidden />
        </div>
      ))}
    </div>
  )
}

export function MemoryStoryScene({ gift }: { gift: Gift }) {
  const content = gift.content as MemoryStoryContent
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const trackY = useMotionValue(0)
  const maxScrollRef = useRef(0)
  const scrollAnimStop = useRef<(() => void) | null>(null)

  const [countIdx, setCountIdx] = useState(0)
  const [countdownDone, setCountdownDone] = useState(false)
  const [revealBatch, setRevealBatch] = useState(0)
  /** Auto-play done → user may scroll freely. */
  const [canScroll, setCanScroll] = useState(false)
  const [atHeart, setAtHeart] = useState(false)

  const memoryPhotos =
    content.memoryPhotos?.filter(Boolean) ??
    [
      'love/couple-demo.png',
      'love/memory-10-home.jpg',
      'love/memory-09-forest.jpg',
      'love/memory-07-city.jpg',
    ]

  const galleryPhotos =
    content.galleryPhotos?.filter(Boolean) ??
    [
      'love/memory-06-beach.jpg',
      'love/memory-08-sunset.jpg',
      'love/memory-05-cafe.jpg',
      'love/adventure-scene-landscape.png',
      'love/heart-tree.png',
      'love/memory-04-park.jpg',
    ]

  const photoPairs = useMemo(() => chunkPairs(memoryPhotos), [memoryPhotos])
  const endingPhrase =
    content.endingWord && content.endingWord !== 'รัก' ? content.endingWord : 'I love you'

  const gallerySection = 1
  const heartSection = 2

  const galleryLoop = useMemo(
    () => [...galleryPhotos, ...galleryPhotos, ...galleryPhotos, ...galleryPhotos],
    [galleryPhotos],
  )

  const bindSectionRef = (index: number) => (node: HTMLElement | null) => {
    sectionRefs.current[index] = node
  }

  const scrollProgress = useTransform(trackY, (y) => {
    const max = maxScrollRef.current || 1
    return Math.min(1, Math.max(0, Math.abs(y) / max))
  })

  const updateMaxScroll = useCallback(() => {
    const viewport = scrollRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    maxScrollRef.current = Math.max(0, track.offsetHeight - viewport.clientHeight)
    const y = trackY.get()
    if (y < -maxScrollRef.current) trackY.set(-maxScrollRef.current)
  }, [trackY])

  const clampTrackY = useCallback(
    (next: number) => Math.min(0, Math.max(-maxScrollRef.current, next)),
    [],
  )

  const scrollTrackTo = (section: HTMLElement | null, durationSec: number) => {
    if (!section) return Promise.resolve()
    const target = section.offsetTop
    if (Math.abs(Math.abs(trackY.get()) - target) < 2) return Promise.resolve()

    scrollAnimStop.current?.()
    const ctrl = animate(trackY, -target, {
      duration: durationSec,
      ease: AUTO_SCROLL_EASE,
    })
    scrollAnimStop.current = () => ctrl.stop()
    return ctrl.finished
  }

  useEffect(() => {
    if (!countdownDone) return
    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll)
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [countdownDone, photoPairs.length, galleryPhotos.length, updateMaxScroll])

  useEffect(() => {
    if (countdownDone) return
    if (countIdx >= COUNTDOWN.length) {
      setCountdownDone(true)
      return
    }
    const t = window.setTimeout(() => setCountIdx((i) => i + 1), 1000)
    return () => window.clearTimeout(t)
  }, [countIdx, countdownDone])

  /* Auto-play full story — locked until heart ending. */
  useEffect(() => {
    if (!countdownDone) return
    let cancelled = false

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), ms)
      })

    ;(async () => {
      trackY.set(0)
      updateMaxScroll()
      setRevealBatch(1)
      await wait(AUTO_PAUSE_MS)
      if (cancelled) return

      if (photoPairs.length > 1) {
        setRevealBatch(2)
        await wait(AUTO_PAUSE_MS + 500)
        if (cancelled) return
      }

      await scrollTrackTo(sectionRefs.current[gallerySection], AUTO_SCROLL_SEC)
      if (cancelled) return
      await wait(GALLERY_PAUSE_MS)
      if (cancelled) return

      await scrollTrackTo(sectionRefs.current[heartSection], AUTO_SCROLL_SEC_LONG)
      if (cancelled) return
      await wait(HEART_PAUSE_MS)
      if (cancelled) return

      setAtHeart(true)
      setCanScroll(true)
      updateMaxScroll()
    })()

    return () => {
      cancelled = true
      scrollAnimStop.current?.()
    }
  }, [countdownDone, gallerySection, heartSection, photoPairs.length, updateMaxScroll])

  /* Block scroll during auto-play. */
  useEffect(() => {
    const el = scrollRef.current
    if (!el || canScroll || !countdownDone) return

    const block = (e: Event) => e.preventDefault()
    el.addEventListener('wheel', block, { passive: false })
    el.addEventListener('touchmove', block, { passive: false })
    return () => {
      el.removeEventListener('wheel', block)
      el.removeEventListener('touchmove', block)
    }
  }, [canScroll, countdownDone])

  /* Manual vertical scroll after auto-play. */
  useEffect(() => {
    if (!canScroll) return
    const el = scrollRef.current
    if (!el) return

    updateMaxScroll()

    let dragIdleTimer = 0

    const markDragging = () => {
      el.classList.add('is-dragging')
      window.clearTimeout(dragIdleTimer)
      dragIdleTimer = window.setTimeout(() => el.classList.remove('is-dragging'), 140)
    }

    const checkHeart = (y: number) => {
      const heartEl = sectionRefs.current[heartSection]
      if (!heartEl) return
      const heartTop = heartEl.offsetTop
      setAtHeart(Math.abs(y) >= heartTop - el.clientHeight * 0.35)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      markDragging()
      const next = clampTrackY(trackY.get() - e.deltaY)
      trackY.set(next)
      checkHeart(next)
    }

    let startY = 0
    let startTrack = 0
    let touching = false

    const onTouchStart = (e: TouchEvent) => {
      touching = true
      startY = e.touches[0]?.clientY ?? 0
      startTrack = trackY.get()
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!touching) return
      e.preventDefault()
      markDragging()
      const y = e.touches[0]?.clientY ?? startY
      const next = clampTrackY(startTrack + (y - startY))
      trackY.set(next)
      checkHeart(next)
    }

    const onTouchEnd = () => {
      touching = false
    }

    checkHeart(trackY.get())

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      window.clearTimeout(dragIdleTimer)
      el.classList.remove('is-dragging')
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [canScroll, clampTrackY, heartSection, trackY, updateMaxScroll])

  return (
    <ExperienceShell className="lx-memory">
      <div className="lx-memory-ambience" aria-hidden>
        <span className="lx-memory-orb lx-memory-orb-a" />
        <span className="lx-memory-orb lx-memory-orb-b" />
        <span className="lx-memory-orb lx-memory-orb-c" />
        <span className="lx-memory-grain" />
      </div>

      {countdownDone ? (
        <motion.div className="lx-memory-progress" style={{ scaleX: scrollProgress }} aria-hidden />
      ) : null}

      {!countdownDone && countIdx < COUNTDOWN.length ? (
        <motion.div
          key={`cd-${countIdx}`}
          className="lx-seq lx-countdown"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: STORY_EASE }}
        >
          <div className="lx-count-backdrop" aria-hidden>
            <span className="lx-count-blob lx-count-blob-a" />
            <span className="lx-count-blob lx-count-blob-b" />
            <span className="lx-count-blob lx-count-blob-c" />
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="lx-count-spark" style={{ ['--i' as string]: i }} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="lx-count-heart" style={{ ['--i' as string]: i }}>
                ♥
              </span>
            ))}
          </div>

          <motion.div
            className="lx-count-stage"
            initial={{ opacity: 0, scale: 0.72, y: 24 }}
            animate={{ opacity: 1, scale: [0.72, 1.08, 1], y: 0 }}
            transition={{ duration: 0.82, ease: STORY_EASE }}
          >
            <p className="lx-count-eyebrow">พร้อมแล้วหรือยัง ♡</p>
            <div className="lx-count-core">
              <span className="lx-count-ring lx-count-ring-outer" aria-hidden />
              <span className="lx-count-ring lx-count-ring-inner" aria-hidden />
              <span className="lx-count-glow" aria-hidden />
              <motion.span
                key={COUNTDOWN[countIdx]}
                className="lx-count-num"
                initial={{ opacity: 0, scale: 0.4, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.55, ease: STORY_EASE }}
              >
                {COUNTDOWN[countIdx]}
              </motion.span>
            </div>
            <p className="lx-count-caption">เรื่องราวของเรากำลังจะเริ่ม...</p>
          </motion.div>
        </motion.div>
      ) : null}

      {countdownDone ? (
        <div
          ref={scrollRef}
          className={`lx-memory-scroll ${canScroll ? 'is-free' : 'is-locked'}`}
          aria-label="เรื่องราวความทรงจำ"
        >
          <motion.div ref={trackRef} className="lx-memory-track" style={{ y: trackY }}>
            <section ref={bindSectionRef(0)} className="lx-memory-section lx-memory-section-photos-block">
              <div className="lx-memory-photos-grid">
                {photoPairs.map((pair, i) => (
                  <PhotoPair key={pair.join('-')} urls={pair} visible={revealBatch > i} />
                ))}
              </div>
            </section>

            <section ref={bindSectionRef(gallerySection)} className="lx-memory-section lx-memory-section-gallery">
              <div className="lx-section-fade" aria-hidden />
              <p className="lx-gallery-label">
                <span className="lx-gallery-label-line" aria-hidden />
                ความทรงจำของเรา
                <span className="lx-gallery-label-line" aria-hidden />
              </p>
              <div className="lx-gallery-strip">
                <div className="lx-gallery-film-edge is-top" aria-hidden />
                <div className="lx-gallery-wrap">
                  <div className="lx-gallery-track">
                    {galleryLoop.map((url, i) => (
                      <div key={`${url}-${i}`} className="lx-gallery-cell">
                        <img src={asset(url)} alt="" className="lx-gallery-item" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lx-gallery-film-edge is-bottom" aria-hidden />
              </div>
            </section>

            <section ref={bindSectionRef(heartSection)} className="lx-memory-section lx-memory-section-heart">
              <div className="lx-section-fade" aria-hidden />
              <div className="lx-heart-sparkles" aria-hidden>
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="lx-heart-spark" style={{ '--i': i } as CSSProperties} />
                ))}
              </div>
              <div className="lx-heart-stage">
                <div className="lx-heart-words" aria-hidden>
                  <HeartLoveAnimation phrase={endingPhrase} />
                </div>
              </div>
              {atHeart ? (
                <motion.div
                  className="lx-heart-finale"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: STORY_EASE }}
                >
                  <p>ขอบคุณที่รับชมเรื่องราวของเรา</p>
                  <button type="button" className="lx-finale-btn" onClick={() => navigate(demoPath('love-quiz'))}>
                    เริ่มใหม่ ♥
                  </button>
                </motion.div>
              ) : null}
            </section>
          </motion.div>
        </div>
      ) : null}

      {!canScroll && countdownDone ? (
        <p className="lx-memory-lock-hint" aria-live="polite">
          <span className="lx-hint-dot" aria-hidden />
          กำลังเล่าเรื่องให้ฟัง…
        </p>
      ) : null}

      {canScroll && !atHeart ? (
        <p className="lx-memory-scroll-hint" aria-live="polite">
          เลื่อนขึ้นลงเพื่อดูต่อ
        </p>
      ) : null}
    </ExperienceShell>
  )
}
