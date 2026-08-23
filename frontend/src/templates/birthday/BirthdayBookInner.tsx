import { useCallback, useEffect, useRef, useState } from 'react'
import { asset } from '../../lib/asset'
import { BookPinkBackdrop } from './BookPinkBackdrop'
import { BookPhotoPage, BookPolaroidOnly, BookTextPage } from './BirthdayBookPages'

export interface BookSpreadData {
  leftPhoto: string
  rightPhoto: string
  blessing?: string
  leftBody?: string
  leftCaption?: string
  rightCaption?: string
}

const FLIP_MS = 1800

type FlipState = { dir: 'next' | 'prev'; from: number; to: number }

function NotebookLeftPage({
  spread,
  leftSubtitle,
  flat,
}: {
  spread: BookSpreadData
  leftSubtitle: string
  flat?: boolean
}) {
  const isBlessing = Boolean(spread.blessing)
  return (
    <div className={`bx-notebook-sheet bx-notebook-sheet--left${flat ? ' bx-notebook-sheet--flat' : ''}`}>
      {isBlessing ? (
        <BookTextPage leftSubtitle={leftSubtitle} body={spread.leftBody || spread.blessing || ''} />
      ) : (
        <BookPolaroidOnly photoUrl={spread.leftPhoto} caption={spread.leftCaption || ''} tilt="a" />
      )}
    </div>
  )
}

function NotebookRightPage({
  spread,
  recipientName,
  flat,
}: {
  spread: BookSpreadData
  recipientName: string
  flat?: boolean
}) {
  return (
    <div className={`bx-notebook-sheet bx-notebook-sheet--right${flat ? ' bx-notebook-sheet--flat' : ''}`}>
      <BookPhotoPage
        photoUrl={spread.rightPhoto}
        caption={spread.rightCaption || ''}
        recipientName={recipientName}
        tilt="b"
      />
    </div>
  )
}

function SpreadPages({
  spread,
  leftSubtitle,
  recipientName,
}: {
  spread: BookSpreadData
  leftSubtitle: string
  recipientName: string
}) {
  return (
    <>
      <NotebookLeftPage spread={spread} leftSubtitle={leftSubtitle} />
      <NotebookRightPage spread={spread} recipientName={recipientName} />
    </>
  )
}

function preloadSpreadImages(spreads: BookSpreadData[]) {
  spreads.forEach((spread) => {
    ;[spread.leftPhoto, spread.rightPhoto].forEach((url) => {
      if (!url) return
      const img = new Image()
      img.src = asset(url)
    })
  })
}

export function BirthdayBookInner({
  spreads,
  recipientName,
  leftSubtitle,
  spreadIndex,
  onSpreadIndexChange,
}: {
  spreads: BookSpreadData[]
  recipientName: string
  leftSubtitle: string
  spreadIndex: number
  onSpreadIndexChange: (index: number) => void
}) {
  const total = spreads.length
  const spread = spreads[spreadIndex]
  const [flip, setFlip] = useState<FlipState | null>(null)
  const flipSheetRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)

  const canPrev = spreadIndex > 0 && !flip
  const canNext = spreadIndex < total - 1 && !flip

  useEffect(() => {
    preloadSpreadImages(spreads)
  }, [spreads])

  const finishFlip = useCallback(() => {
    setFlip((current) => {
      if (!current) return null
      onSpreadIndexChange(current.to)
      return null
    })
  }, [onSpreadIndexChange])

  const startFlip = useCallback(
    (dir: 'next' | 'prev') => {
      if (flip) return
      const to = dir === 'next' ? spreadIndex + 1 : spreadIndex - 1
      if (to < 0 || to >= total) return
      setFlip({ dir, from: spreadIndex, to })
    },
    [flip, spreadIndex, total],
  )

  useEffect(() => {
    if (!flip) return
    const sheet = flipSheetRef.current
    const onEnd = (e: AnimationEvent) => {
      if (e.target !== sheet || e.animationName !== 'bx-page-flip-next' && e.animationName !== 'bx-page-flip-prev') return
      finishFlip()
    }
    sheet?.addEventListener('animationend', onEnd)
    const fallback = window.setTimeout(finishFlip, FLIP_MS + 120)
    return () => {
      sheet?.removeEventListener('animationend', onEnd)
      window.clearTimeout(fallback)
    }
  }, [flip, finishFlip])

  useEffect(() => {
    const el = bookRef.current
    if (!el) return
    let startX = 0
    let startY = 0
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }
    const onEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.15) return
      if (dx < 0) startFlip('next')
      else startFlip('prev')
    }
    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [startFlip])

  if (!spread) return null

  const fromSpread = flip ? spreads[flip.from] : spread
  const toSpread = flip ? spreads[flip.to] : spread

  return (
    <div className="bx-book-inner">
      <BookPinkBackdrop />

      <div className="bx-notebook" ref={bookRef}>
        <div className="bx-notebook-edge bx-notebook-edge--back" aria-hidden />
        <div className="bx-notebook-body">
          <div className="bx-notebook-rings" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="bx-notebook-ring" />
            ))}
          </div>

          {flip ? (
            <div className={`bx-notebook-spread bx-flip-stage bx-flip-stage--${flip.dir}`}>
              <div className="bx-flip-base">
                <SpreadPages spread={fromSpread} leftSubtitle={leftSubtitle} recipientName={recipientName} />
              </div>

              <div className="bx-flip-reveal bx-flip-reveal--right">
                <NotebookRightPage spread={toSpread} recipientName={recipientName} flat />
              </div>

              {flip.dir === 'prev' ? (
                <div className="bx-flip-reveal bx-flip-reveal--left">
                  <NotebookLeftPage spread={toSpread} leftSubtitle={leftSubtitle} flat />
                </div>
              ) : null}

              <div
                ref={flipSheetRef}
                className={`bx-flip-sheet bx-flip-sheet--${flip.dir}`}
              >
                <div className="bx-flip-face bx-flip-face--front">
                  {flip.dir === 'next' ? (
                    <NotebookRightPage spread={fromSpread} recipientName={recipientName} flat />
                  ) : (
                    <NotebookLeftPage spread={fromSpread} leftSubtitle={leftSubtitle} flat />
                  )}
                </div>
                <div className="bx-flip-face bx-flip-face--back">
                  {flip.dir === 'next' ? (
                    <NotebookLeftPage spread={toSpread} leftSubtitle={leftSubtitle} flat />
                  ) : (
                    <NotebookRightPage spread={toSpread} recipientName={recipientName} flat />
                  )}
                </div>
                <span className="bx-flip-shadow" aria-hidden />
              </div>
            </div>
          ) : (
            <div className="bx-notebook-spread">
              <SpreadPages spread={spread} leftSubtitle={leftSubtitle} recipientName={recipientName} />
            </div>
          )}

          <div className="bx-notebook-strap" aria-hidden>
            <span className="bx-notebook-strap-btn">♥</span>
          </div>
        </div>
        <div className="bx-notebook-edge bx-notebook-edge--front" aria-hidden />
      </div>

      <nav className={`bx-book-nav bx-book-nav--pink ${flip ? 'bx-book-nav--busy' : ''}`}>
        <button type="button" className="bx-book-nav-btn" disabled={!canPrev} onClick={() => startFlip('prev')}>
          ← ก่อนหน้า
        </button>
        <span className="bx-book-nav-count">
          {spreadIndex + 1} / {total}
        </span>
        <button type="button" className="bx-book-nav-btn" disabled={!canNext} onClick={() => startFlip('next')}>
          ถัดไป →
        </button>
      </nav>
    </div>
  )
}
