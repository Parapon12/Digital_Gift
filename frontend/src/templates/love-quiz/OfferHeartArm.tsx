import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

function MiniHeart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M12 4 C12 0, 6 0, 6 5 C6 10, 12 16, 12 16 C12 16, 18 10, 18 5 C18 0, 12 0, 12 4Z"
      fill="#ff7aa2"
      stroke="#2d2d2d"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  )
}

export function OfferHeartArm() {
  const offer = useAnimation()
  const heart = useAnimation()
  const floatA = useAnimation()
  const floatB = useAnimation()
  const floatC = useAnimation()

  useEffect(() => {
    let alive = true
    const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

    const loop = async () => {
      while (alive) {
        await offer.start({
          x: 42,
          y: -2,
          rotate: 5,
          scale: 1,
          transition: { type: 'spring', stiffness: 120, damping: 14, mass: 0.9 },
        })
        await heart.start({
          scale: [0.88, 1.12, 1.04],
          transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        })

        await Promise.all([
          floatA.start({
            y: [0, -8, -4],
            opacity: [0.4, 1, 0.7],
            transition: { duration: 0.8 },
          }),
          floatB.start({
            y: [0, -10, -5],
            opacity: [0.35, 1, 0.65],
            transition: { duration: 0.85 },
          }),
          floatC.start({
            y: [0, -6, -3],
            opacity: [0.3, 0.95, 0.6],
            transition: { duration: 0.75 },
          }),
        ])

        await wait(900)

        await Promise.all([
          offer.start({
            x: -28,
            y: 8,
            rotate: -4,
            scale: 0.9,
            transition: { duration: 1, ease: [0.42, 0, 0.58, 1] },
          }),
          heart.start({
            scale: 0.88,
            transition: { duration: 0.88, ease: [0.42, 0, 0.58, 1] },
          }),
          floatA.start({ y: 0, opacity: 0.45, transition: { duration: 0.72, ease: [0.42, 0, 0.58, 1] } }),
          floatB.start({ y: 0, opacity: 0.4, transition: { duration: 0.72, ease: [0.42, 0, 0.58, 1] } }),
          floatC.start({ y: 0, opacity: 0.35, transition: { duration: 0.72, ease: [0.42, 0, 0.58, 1] } }),
        ])
      }
    }

    loop()
    return () => {
      alive = false
    }
  }, [offer, heart, floatA, floatB, floatC])

  return (
    <div className="lq-offer" aria-hidden>
      <motion.div
        className="lq-offer-motion"
        animate={offer}
        initial={{ x: -28, y: 8, rotate: -4, scale: 0.9 }}
        style={{ transformOrigin: '38% 58%' }}
      >
        <svg className="lq-offer-svg" viewBox="0 0 560 240" preserveAspectRatio="xMidYMid meet">
          <motion.g animate={floatA} initial={{ y: 0, opacity: 0.45 }}>
            <MiniHeart x={168} y={18} s={0.95} />
          </motion.g>
          <motion.g animate={floatB} initial={{ y: 0, opacity: 0.4 }}>
            <MiniHeart x={208} y={8} s={0.75} />
          </motion.g>
          <motion.g animate={floatC} initial={{ y: 0, opacity: 0.35 }}>
            <MiniHeart x={132} y={118} s={0.7} />
          </motion.g>

          <g className="lq-mochi-cat">
            <path
              d="M108 62 L88 22 L132 54 Z M228 54 L268 22 L248 62 Z"
              fill="#fff"
              stroke="#2d2d2d"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M108 72
                 C108 72, 92 88, 88 118
                 C84 158, 108 188, 168 192
                 C228 196, 252 168, 252 128
                 C252 92, 232 72, 208 68
                 C188 64, 128 64, 108 72Z"
              fill="#fff"
              stroke="#2d2d2d"
              strokeWidth="4.2"
              strokeLinejoin="round"
            />
            <circle cx="142" cy="118" r="9" fill="#2d2d2d" />
            <circle cx="198" cy="118" r="9" fill="#2d2d2d" />
            <path
              d="M158 142 Q178 154 198 142"
              fill="none"
              stroke="#2d2d2d"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <ellipse cx="124" cy="136" rx="13" ry="8" fill="#ffb3c7" opacity="0.9" />
            <ellipse cx="216" cy="136" rx="13" ry="8" fill="#ffb3c7" opacity="0.9" />
          </g>

          <motion.g
            animate={heart}
            initial={{ scale: 0.88 }}
            style={{ transformOrigin: '340px 118px', transformBox: 'fill-box' as never }}
          >
            <path
              d="M340 72
                 C340 38, 286 34, 286 76
                 C286 124, 340 176, 340 176
                 C340 176, 394 124, 394 76
                 C394 34, 340 38, 340 72Z"
              fill="#ff7aa2"
              stroke="#2d2d2d"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <ellipse cx="292" cy="152" rx="18" ry="14" fill="#fff" stroke="#2d2d2d" strokeWidth="3.5" />
            <ellipse cx="388" cy="152" rx="18" ry="14" fill="#fff" stroke="#2d2d2d" strokeWidth="3.5" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}
