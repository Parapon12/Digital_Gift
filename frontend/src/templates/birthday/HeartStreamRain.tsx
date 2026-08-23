import { useMemo } from 'react'

/** สายหัวใจชมพู — แต่ละสายตกไม่เท่ากัน (เร็ว/ช้า · ยาว/สั้น) */
export function HeartStreamRain() {
  const streams = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const duration = 1.8 + (i % 7) * 0.85 + (i % 3) * 0.45
        const heartCount = 2 + (i % 5) + Math.floor(i / 6)
        return {
          id: i,
          left: `${2 + i * 5.4}%`,
          duration,
          delay: (i * 0.31) % 2.8,
          heartCount,
          gap: 0.28 + (i % 4) * 0.18,
          size: 10 + (i % 4) * 3,
        }
      }),
    [],
  )

  return (
    <div className="bx-heart-streams" aria-hidden>
      {streams.map((s) => (
        <div key={s.id} className="bx-heart-stream" style={{ left: s.left }}>
          {Array.from({ length: s.heartCount }, (_, hi) => (
            <span
              key={hi}
              className="bx-stream-heart"
              style={{
                width: s.size,
                height: s.size,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay + hi * s.gap}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function HeartSceneBackdrop() {
  return (
    <>
      <div className="bx-scene-backdrop" aria-hidden />
      <div className="bx-intro-vignette" aria-hidden />
      <HeartStreamRain />
    </>
  )
}
