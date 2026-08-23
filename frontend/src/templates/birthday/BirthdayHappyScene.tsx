import { useEffect, useMemo, useState } from 'react'
import { asset } from '../../lib/asset'
import { HeartSceneBackdrop } from './HeartStreamRain'

type Phase = 'lead' | 'follow' | 'exit'

const FLOAT_SLOTS = [
  { side: 'left' as const, top: '4%', left: '2%', rot: -8, delay: 0 },
  { side: 'left' as const, top: '12%', left: '14%', rot: 6, delay: 0.4 },
  { side: 'left' as const, top: '22%', left: '4%', rot: -4, delay: 0.8 },
  { side: 'left' as const, top: '8%', left: '24%', rot: 10, delay: 1.1 },
  { side: 'left' as const, top: '18%', left: '18%', rot: -12, delay: 1.5 },
  { side: 'left' as const, top: '28%', left: '10%', rot: 5, delay: 1.9 },
  { side: 'right' as const, top: '5%', right: '3%', rot: 8, delay: 0.2 },
  { side: 'right' as const, top: '14%', right: '16%', rot: -6, delay: 0.6 },
  { side: 'right' as const, top: '24%', right: '5%', rot: 4, delay: 1.0 },
  { side: 'right' as const, top: '10%', right: '26%', rot: -10, delay: 1.3 },
  { side: 'right' as const, top: '20%', right: '20%', rot: 12, delay: 1.7 },
  { side: 'right' as const, top: '30%', right: '12%', rot: -5, delay: 2.1 },
]

export function BirthdayHappyScene({
  floatPhotos,
  onComplete,
  firstWord = 'Happy',
  secondWord = 'birthday',
  holdAtEnd = false,
}: {
  floatPhotos: string[]
  onComplete?: () => void
  firstWord?: string
  secondWord?: string
  holdAtEnd?: boolean
}) {
  const [phase, setPhase] = useState<Phase>('lead')
  const [visibleLetters, setVisibleLetters] = useState(0)
  const word = secondWord
  const thai = /[\u0E00-\u0E7F]/.test(`${firstWord}${secondWord}`)
  const thaiClass = thai ? ' bx-happy-word--thai' : ''

  useEffect(() => {
    if (phase !== 'lead') return
    const t = window.setTimeout(() => setPhase('follow'), 1800)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'follow') return
    if (visibleLetters >= word.length) {
      if (holdAtEnd) return
      const hold = window.setTimeout(() => setPhase('exit'), 3200)
      return () => window.clearTimeout(hold)
    }
    const t = window.setTimeout(() => setVisibleLetters((n) => n + 1), 220)
    return () => window.clearTimeout(t)
  }, [phase, visibleLetters, word.length, holdAtEnd])

  useEffect(() => {
    if (phase !== 'exit') return
    const t = window.setTimeout(() => onComplete?.(), 900)
    return () => window.clearTimeout(t)
  }, [phase, onComplete])

  const photos = useMemo(() => {
    const list = floatPhotos.filter(Boolean)
    return FLOAT_SLOTS.map((slot, i) => ({
      ...slot,
      url: list[i % list.length] || '',
    }))
  }, [floatPhotos])

  return (
    <section className={`bx-scene bx-scene--dark bx-scene--happy ${phase === 'exit' ? 'is-exiting' : ''}`}>
      <HeartSceneBackdrop />
      <div className="bx-float-layer" aria-hidden>
        {photos.map((p, i) =>
          p.url ? (
            <figure
              key={i}
              className={`bx-float-photo bx-float-photo--${p.side}${p.url.includes('tiger/') ? ' is-mascot' : ''}`}
              style={{
                top: p.top,
                left: p.side === 'left' ? p.left : undefined,
                right: p.side === 'right' ? p.right : undefined,
                ['--rot' as string]: `${p.rot}deg`,
                ['--delay' as string]: `${p.delay}s`,
              }}
            >
              <img src={asset(p.url)} alt="" />
            </figure>
          ) : null,
        )}
      </div>

      <div className="bx-happy-text">
        {phase === 'lead' ? (
          <h1 className={`bx-happy-word bx-happy-word--happy${thaiClass}`}>{firstWord}</h1>
        ) : null}
        {phase === 'follow' || phase === 'exit' ? (
          <h1 className={`bx-happy-word bx-happy-word--birthday${thaiClass}`} aria-label={word}>
            {word.split('').map((ch, i) => (
              <span
                key={i}
                className={i < visibleLetters ? 'is-in' : ''}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {ch}
              </span>
            ))}
          </h1>
        ) : null}
      </div>
    </section>
  )
}
