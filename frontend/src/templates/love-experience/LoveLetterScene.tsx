import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Gift, LoveLetterContent } from '../../types'
import { ExperienceShell } from './ExperienceShell'
import { demoPath } from './nav'

type Phase = 'idle' | 'activating' | 'opening'

const openEase = [0.25, 0.9, 0.35, 1] as const
const openDur = 0.92
/** Pulse + seam traces run together, then envelope opens. */
const ACTIVATE_MS = 1200

const SEAM_CENTER = { x: 50, y: 47 }
const SEAM_CORNERS = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 },
] as const

function waxPetal(flowerId: number, angle: number) {
  return (
    <ellipse
      key={`${flowerId}-${angle}`}
      cx="0"
      cy="-5.2"
      rx="2.6"
      ry="4.8"
      transform={`rotate(${angle})`}
    />
  )
}

function WaxFlower({ x, y, scale = 1, rotate = 0 }: { x: number; y: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => waxPetal(i, angle))}
      <circle r="1.35" fill="rgba(78, 48, 36, 0.42)" />
    </g>
  )
}

function WaxSealArt() {
  return (
    <svg className="lx-wax-seal-art" viewBox="0 0 140 140" fill="none" aria-hidden>
      <defs>
        <radialGradient id="lxWaxFill" cx="36%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#edd9cc" />
          <stop offset="45%" stopColor="#c9a48d" />
          <stop offset="88%" stopColor="#a67f6a" />
          <stop offset="100%" stopColor="#8f6754" />
        </radialGradient>
        <filter id="lxWaxShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#5a3828" floodOpacity="0.35" />
        </filter>
        <filter id="lxWaxEmboss">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.35" result="blur" />
          <feOffset dx="0.5" dy="0.75" result="offset" />
          <feComposite in="offset" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="inner" />
          <feFlood floodColor="#fff8f2" floodOpacity="0.42" result="light" />
          <feComposite in="light" in2="inner" operator="in" result="hl" />
          <feMerge>
            <feMergeNode in="hl" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="70" cy="70" r="58" fill="url(#lxWaxFill)" filter="url(#lxWaxShadow)" />
      <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255, 240, 228, 0.26)" strokeWidth="1.8" />
      <circle cx="70" cy="70" r="57" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="3" />
      <circle cx="70" cy="70" r="41" fill="none" stroke="rgba(95, 62, 48, 0.2)" strokeWidth="1.3" />

      <g filter="url(#lxWaxEmboss)" fill="rgba(108, 72, 56, 0.6)" stroke="rgba(78, 48, 36, 0.22)" strokeWidth="0.4">
        <g transform="translate(70 70)">
          <path d="M0 -14v22M-10 2c4.5 2.8 9 2.8 13.5 0" fill="none" strokeWidth="1.15" strokeLinecap="round" />
          <path
            d="M-4 10c-1.4 2.8-0.6 5.6 1.8 7M4 10c1.4 2.8 0.6 5.6-1.8 7"
            fill="none"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
          <ellipse cx="-6" cy="4" rx="2.2" ry="4.5" transform="rotate(-28 -6 4)" />
          <ellipse cx="6" cy="6" rx="2.2" ry="4.5" transform="rotate(24 6 6)" />
          <WaxFlower x={0} y={-10} scale={1.05} />
          <WaxFlower x={-11} y={0} scale={0.92} rotate={-8} />
          <WaxFlower x={11} y={0} scale={0.92} rotate={8} />
        </g>
      </g>
    </svg>
  )
}

/** Expanding radial pulse rings at the wax seal center. */
function SealPulseRings({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="lx-seal-pulse" aria-hidden>
      <span className="lx-seal-pulse-core" />
      {[0, 1, 2].map((i) => (
        <span key={i} className="lx-seal-pulse-ring" style={{ ['--i' as string]: i }} />
      ))}
    </div>
  )
}

/** Golden light traveling along the 4 diagonal envelope seams. */
function SeamLightTraces({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <svg className="lx-seam-lights" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="lxSeamGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <filter id="lxSeamGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {SEAM_CORNERS.map((corner, i) => (
        <g key={i} filter="url(#lxSeamGlow)">
          <line
            x1={SEAM_CENTER.x}
            y1={SEAM_CENTER.y}
            x2={corner.x}
            y2={corner.y}
            className={`lx-seam-beam lx-seam-beam-${i}`}
            stroke="url(#lxSeamGold)"
          />
          <circle r="1.4" fill="#fef3c7" opacity="0">
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.08;0.85;1"
              dur="0.95s"
              begin={`${i * 0.05}s`}
              fill="freeze"
            />
            <animateMotion
              dur="0.95s"
              begin={`${i * 0.05}s`}
              fill="freeze"
              path={`M ${SEAM_CENTER.x} ${SEAM_CENTER.y} L ${corner.x} ${corner.y}`}
            />
          </circle>
        </g>
      ))}
    </svg>
  )
}

export function LoveLetterScene({ gift }: { gift: Gift }) {
  const content = gift.content as LoveLetterContent
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('idle')

  const isActivating = phase === 'activating'
  const isOpening = phase === 'opening'
  const foldTransition = { duration: openDur, ease: openEase }

  const startOpen = useCallback(() => {
    setPhase('opening')
    window.setTimeout(() => {
      navigate(demoPath(content.nextSlug || 'love-arrow'))
    }, 1080)
  }, [content.nextSlug, navigate])

  const onSealClick = () => {
    if (phase !== 'idle') return
    setPhase('activating')
    window.setTimeout(startOpen, ACTIVATE_MS)
  }

  return (
    <ExperienceShell className="lx-letter">
      <div className="lx-letter-stage">
        <div className={`lx-envelope-full ${isOpening ? 'is-open' : ''}`}>
          <div className="lx-env-canvas" aria-hidden>
            <motion.span
              className="lx-env-next-view"
              initial={false}
              animate={isOpening ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: openDur, ease: openEase, delay: isOpening ? 0.14 : 0 }}
            >
              <span className="lx-env-next-sky" />
              <span className="lx-env-next-field" />
            </motion.span>

            <span className="lx-env-base" />

            <motion.span
              className="lx-env-fold lx-env-fold-left"
              initial={false}
              animate={isOpening ? { rotateY: 62, opacity: 0.18 } : { rotateY: 0, opacity: 0.94 }}
              transition={{ ...foldTransition, delay: isOpening ? 0.1 : 0 }}
            />
            <motion.span
              className="lx-env-fold lx-env-fold-right"
              initial={false}
              animate={isOpening ? { rotateY: -62, opacity: 0.18 } : { rotateY: 0, opacity: 0.94 }}
              transition={{ ...foldTransition, delay: isOpening ? 0.1 : 0 }}
            />
            <motion.span
              className="lx-env-fold lx-env-fold-bottom"
              initial={false}
              animate={isOpening ? { rotateX: 48, opacity: 0.22 } : { rotateX: 0, opacity: 1 }}
              transition={{ ...foldTransition, delay: isOpening ? 0.16 : 0 }}
            />
            <motion.span
              className="lx-env-fold lx-env-fold-top"
              initial={false}
              animate={isOpening ? { rotateX: -168, opacity: 0.08 } : { rotateX: 0, opacity: 1 }}
              transition={{ ...foldTransition, delay: isOpening ? 0.04 : 0 }}
            />

            <motion.span
              className="lx-env-fold-shadow"
              initial={false}
              animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.42, ease: 'easeOut', delay: isOpening ? 0.12 : 0 }}
            />

            <motion.svg
              className="lx-env-creases"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
              initial={false}
              animate={isActivating || isOpening ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {SEAM_CORNERS.map((corner, i) => (
                <line
                  key={i}
                  x1={corner.x}
                  y1={corner.y}
                  x2={SEAM_CENTER.x}
                  y2={SEAM_CENTER.y}
                  className="lx-crease"
                />
              ))}
            </motion.svg>

            <span className="lx-env-paper-light" />
            <span className="lx-env-grain" />
          </div>

          <SealPulseRings active={isActivating} />
          <SeamLightTraces active={isActivating} />

          <span className="lx-env-seal-anchor">
            <motion.button
              type="button"
              className="lx-env-seal"
              aria-label="แตะตราประทับเพื่อเปิด"
              onClick={onSealClick}
              disabled={phase !== 'idle'}
              initial={false}
              whileTap={phase === 'idle' ? { scale: 0.96 } : undefined}
              animate={
                isOpening
                  ? { scale: 0.72, opacity: 0, rotate: 10 }
                  : isActivating
                    ? { scale: [1, 1.06, 1], filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)'] }
                    : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={{ duration: isActivating ? 0.55 : 0.48, ease: openEase }}
            >
              <WaxSealArt />
            </motion.button>
          </span>

          <span className="lx-env-burst-anchor">
            <motion.span
              className="lx-env-burst"
              aria-hidden
              initial={false}
              animate={isOpening ? { opacity: 0.75, scale: 1.55 } : { opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          </span>
        </div>

        {phase === 'idle' ? (
          <p className="lx-letter-hint">แตะตราประทับเพื่อเปิด</p>
        ) : null}
      </div>
    </ExperienceShell>
  )
}
