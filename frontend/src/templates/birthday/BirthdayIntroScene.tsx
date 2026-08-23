import { useEffect, useState } from 'react'
import { HeartSceneBackdrop } from './HeartStreamRain'

export function BirthdayIntroScene({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (count <= 0) {
      const t = window.setTimeout(onComplete, 700)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setCount((c) => c - 1), 1200)
    return () => window.clearTimeout(t)
  }, [count, onComplete])

  return (
    <section className="bx-scene bx-scene--dark">
      <HeartSceneBackdrop />
      <div className="bx-countdown" aria-live="polite">
        {count > 0 ? (
          <span key={count} className={`bx-count-num bx-count-num--${count}`}>
            {count}
          </span>
        ) : null}
      </div>
    </section>
  )
}
