import { useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react'

const TOTAL_ITEMS = 100
/** Path canvas size used by the CSS keyframes. */
const HEART_BOX = 450
/** Extra room for rotated “I love you” text that paints outside the 450 box. */
const HEART_BLEED = 130

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

/** 3D “I love you” heart — matches the reference script (100 layers + H/V motion). */
export function HeartLoveAnimation({ phrase = 'I love you' }: { phrase?: string }) {
  const stackRef = useRef<HTMLDivElement>(null)
  const items = useMemo(() => Array.from({ length: TOTAL_ITEMS }, (_, i) => i + 1), [])
  const display =
    !phrase || phrase.trim() === 'รัก' ? 'I love you' : phrase

  useLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack) return
    const stage = stack.closest('.lx-heart-stage') as HTMLElement | null
    if (!stage) return

    const fit = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      if (w < 16 || h < 16) return

      const extra = clamp(36 + display.length * 7, 90, 170)
      const visual = HEART_BOX + Math.max(HEART_BLEED, extra)
      const scale = Math.min(1, w / visual, h / visual)
      stack.style.setProperty('--lx-heart-scale', String(Number(scale.toFixed(4))))

      const leftoverX = Math.max(0, w - visual * scale)
      const leftoverY = Math.max(0, h - visual * scale)
      const nudgeX = clamp(-0.055 * HEART_BOX * scale, -leftoverX / 2, leftoverX / 2)
      const nudgeY = clamp(-0.02 * HEART_BOX * scale, -leftoverY / 2, leftoverY / 2)
      stack.style.setProperty('--lx-heart-shift-x', `${nudgeX.toFixed(1)}px`)
      stack.style.setProperty('--lx-heart-shift-y', `${nudgeY.toFixed(1)}px`)
    }

    const ro = new ResizeObserver(fit)
    ro.observe(stage)
    window.addEventListener('resize', fit)
    window.addEventListener('orientationchange', fit)
    fit()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
      window.removeEventListener('orientationchange', fit)
    }
  }, [display])

  return (
    <div ref={stackRef} className="lx-heart-words-stack">
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
