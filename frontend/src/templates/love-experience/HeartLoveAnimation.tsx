import { useMemo, type CSSProperties } from 'react'

const TOTAL_ITEMS = 100

/** 3D “I love you” heart — matches the reference script (100 layers + H/V motion). */
export function HeartLoveAnimation({ phrase = 'I love you' }: { phrase?: string }) {
  const items = useMemo(() => Array.from({ length: TOTAL_ITEMS }, (_, i) => i + 1), [])
  const display =
    !phrase || phrase.trim() === 'รัก' ? 'I love you' : phrase

  return (
    <div className="lx-heart-words-stack">
      <div className="lx-heart-glow" aria-hidden />
      <div className="lx-heart-anim-ui" aria-hidden>
        {items.map((i) => (
          <div
            key={i}
            className="lx-heart-anim-love"
            style={{ '--i': i } as CSSProperties}
          >
            <div className="lx-heart-anim-h">
              <div className="lx-heart-anim-v">
                <div className="lx-heart-anim-word">{display}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
