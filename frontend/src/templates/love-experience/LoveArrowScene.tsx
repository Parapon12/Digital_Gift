import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Gift, LoveArrowContent } from '../../types'
import { CupidWithBow } from './CupidWithBow'
import { ExperienceShell } from './ExperienceShell'
import { HeartTargetTree } from './HeartTargetTree'
import { MeadowRiverBackground } from './MeadowRiverBackground'
import { demoPath } from './nav'

type Leaf = { id: number; left: number; top: number; size: number; delay: number }

const LEAVES: Leaf[] = [
  { id: 0, left: 35, top: 22, size: 0.85, delay: 0 },
  { id: 1, left: 50, top: 16, size: 0.95, delay: 0.35 },
  { id: 2, left: 65, top: 20, size: 1, delay: 0.7 },
  { id: 3, left: 40, top: 30, size: 0.8, delay: 1.0 },
  { id: 4, left: 55, top: 34, size: 0.9, delay: 0.2 },
  { id: 5, left: 70, top: 28, size: 0.88, delay: 0.55 },
  { id: 6, left: 45, top: 40, size: 0.75, delay: 1.3 },
  { id: 7, left: 58, top: 12, size: 0.82, delay: 0.85 },
]

type Point = { x: number; y: number }

const GRAVITY = 0.14
const MAX_PULL_DIST = 200
const MIN_PULL_DIST = 22
const MIN_PULL_BACK = 16
const MIN_SPEED = 12
const MAX_SPEED = 34

function shotFromPull(nock: Point, pull: Point) {
  const dx = nock.x - pull.x
  const dy = nock.y - pull.y
  const dist = Math.hypot(dx, dy)
  if (dist < MIN_PULL_DIST) return null

  const t = Math.min(1, (dist - MIN_PULL_DIST) / (MAX_PULL_DIST - MIN_PULL_DIST))
  const speed = MIN_SPEED + t * (MAX_SPEED - MIN_SPEED)

  return {
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    rot: (Math.atan2(dy, dx) * 180) / Math.PI,
    power: t,
  }
}

function simulatePath(
  origin: Point,
  vx: number,
  vy: number,
  bounds: { w: number; h: number },
  steps = 52,
) {
  const points: Point[] = [{ x: origin.x, y: origin.y }]
  let x = origin.x
  let y = origin.y
  let cvx = vx
  let cvy = vy

  for (let i = 0; i < steps; i++) {
    x += cvx
    y += cvy
    cvy += GRAVITY
    points.push({ x, y })
    if (x < -30 || x > bounds.w + 50 || y > bounds.h + 50 || y < -30) break
  }

  return points
}

function buildTrajectory(nock: Point, pull: Point, bounds: { w: number; h: number }) {
  const shot = shotFromPull(nock, pull)
  if (!shot) return [] as Point[]
  return simulatePath(nock, shot.vx, shot.vy, bounds)
}

type PullState = {
  top: Point
  mid: Point
  bot: Point
  pull: Point
}

const MAX_PULL_DIST_CLAMP = MAX_PULL_DIST

/** Bow string pulls back left; vertical motion follows finger within limb span. */
function constrainPull(top: Point, mid: Point, bot: Point, raw: Point): Point {
  const span = bot.y - top.y
  const minY = top.y + span * 0.06
  const maxY = bot.y - span * 0.06
  let y = Math.max(minY, Math.min(maxY, raw.y))

  let x = Math.min(raw.x, mid.x - MIN_PULL_BACK)

  const dx = x - mid.x
  const dy = y - mid.y
  const dist = Math.hypot(dx, dy)
  if (dist > MAX_PULL_DIST_CLAMP) {
    x = mid.x + (dx / dist) * MAX_PULL_DIST_CLAMP
    y = mid.y + (dy / dist) * MAX_PULL_DIST_CLAMP
  }

  return { x: Math.min(x, mid.x - MIN_PULL_BACK), y }
}

type Arrow = {
  x: number
  y: number
  rot: number
  vx: number
  vy: number
}

function HeartArrow({ rot }: { rot: number }) {
  return (
    <svg
      className="lx-arrow-svg"
      viewBox="0 0 64 16"
      aria-hidden
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <line x1="4" y1="8" x2="48" y2="8" stroke="#fbcfe8" strokeWidth="2.8" strokeLinecap="round" />
      <polygon points="48,8 40,4 40,12" fill="#fda4af" />
      <path
        d="M56 8 C56 5.5 58.5 4 60.5 5.2 C62.2 6.2 62.2 9.8 60.5 10.8 C58.5 12 56 10.5 56 8Z"
        fill="#fb7185"
      />
      <path
        d="M52 8 C52 6.2 53.4 5 54.6 5.8 C55.6 6.5 55.6 9.5 54.6 10.2 C53.4 11 52 9.8 52 8Z"
        fill="#fecdd3"
      />
    </svg>
  )
}

export function LoveArrowScene({ gift }: { gift: Gift }) {
  const content = gift.content as LoveArrowContent
  const navigate = useNavigate()
  const arenaRef = useRef<HTMLDivElement>(null)
  const bowRef = useRef<HTMLDivElement>(null)
  const targetLeaf = useMemo(() => LEAVES[Math.floor(Math.random() * LEAVES.length)], [])
  const [pull, setPull] = useState<PullState | null>(null)
  const [arrow, setArrow] = useState<Arrow | null>(null)
  const arrowRef = useRef<Arrow | null>(null)
  const [flying, setFlying] = useState(false)
  const [shake, setShake] = useState(false)
  const [fallen, setFallen] = useState(false)
  const [missed, setMissed] = useState(false)
  const [popup, setPopup] = useState(false)
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([])
  const trailId = useRef(0)
  const rafRef = useRef(0)
  const flyingRef = useRef(false)
  const pullRef = useRef<PullState | null>(null)

  const syncPull = useCallback((next: PullState | null) => {
    pullRef.current = next
    setPull(next)
  }, [])

  const stopFlight = useCallback(() => {
    flyingRef.current = false
    arrowRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    setFlying(false)
    setArrow(null)
    setTrails([])
  }, [])

  const getBowAnchors = useCallback((): Pick<PullState, 'top' | 'mid' | 'bot'> | null => {
    const arena = arenaRef.current
    if (!arena) return null
    const top = arena.querySelector('.lx-bow-top') as HTMLElement | null
    const mid = arena.querySelector('.lx-bow-mid') as HTMLElement | null
    const bot = arena.querySelector('.lx-bow-bot') as HTMLElement | null
    if (!top || !mid || !bot) return null

    const ar = arena.getBoundingClientRect()
    const toArena = (el: HTMLElement): Point => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2 - ar.left, y: r.top + r.height / 2 - ar.top }
    }

    return { top: toArena(top), mid: toArena(mid), bot: toArena(bot) }
  }, [])

  const trajectory = useMemo(() => {
    if (!pull || flying) return [] as Point[]
    const arena = arenaRef.current
    if (!arena) return [] as Point[]
    return buildTrajectory(pull.mid, pull.pull, {
      w: arena.clientWidth,
      h: arena.clientHeight,
    })
  }, [pull, flying])

  const pointerToArena = (clientX: number, clientY: number) => {
    const arena = arenaRef.current
    if (!arena) return { x: 0, y: 0 }
    const r = arena.getBoundingClientRect()
    return { x: clientX - r.left, y: clientY - r.top }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (flyingRef.current || flying || popup) return
    const arena = arenaRef.current
    if (!arena) return
    const anchors = getBowAnchors()
    if (!anchors) return

    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = pointerToArena(e.clientX, e.clientY)
    setMissed(false)
    syncPull({
      ...anchors,
      pull: constrainPull(anchors.top, anchors.mid, anchors.bot, {
        x: Math.min(p.x, anchors.mid.x - 48),
        y: p.y,
      }),
    })
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pullRef.current || flyingRef.current) return
    const anchors = getBowAnchors()
    const p = pointerToArena(e.clientX, e.clientY)
    const prev = pullRef.current
    if (anchors) {
      syncPull({
        ...anchors,
        pull: constrainPull(anchors.top, anchors.mid, anchors.bot, p),
      })
    } else {
      syncPull({
        ...prev,
        pull: constrainPull(prev.top, prev.mid, prev.bot, p),
      })
    }
  }

  const startFlight = useCallback(
    (next: Arrow) => {
      arrowRef.current = next
      flyingRef.current = true
      setArrow(next)
      setFlying(true)
      setTrails([])

      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      let frames = 0
      const step = () => {
        frames += 1
        const cur = arrowRef.current
        const arena = arenaRef.current
        if (!cur || !arena || !flyingRef.current) {
          stopFlight()
          return
        }

        const a: Arrow = {
          x: cur.x + cur.vx,
          y: cur.y + cur.vy,
          vx: cur.vx,
          vy: cur.vy + GRAVITY,
          rot: (Math.atan2(cur.vy + GRAVITY, cur.vx) * 180) / Math.PI,
        }
        arrowRef.current = a
        setArrow(a)

        trailId.current += 1
        setTrails((prev) => [...prev.slice(-10), { id: trailId.current, x: a.x, y: a.y }])

        const w = arena.clientWidth
        const h = arena.clientHeight
        const treeHit = a.x > w * 0.48 && a.x < w * 0.88 && a.y > h * 0.04 && a.y < h * 0.68
        const outOfBounds = a.x < -40 || a.x > w + 40 || a.y < -40 || a.y > h + 40
        const timedOut = frames > 480

        if (treeHit || outOfBounds || timedOut) {
          if (treeHit) {
            setShake(true)
            setFallen(true)
          } else {
            setMissed(true)
          }
          stopFlight()
          return
        }

        rafRef.current = requestAnimationFrame(step)
      }

      rafRef.current = requestAnimationFrame(step)
    },
    [stopFlight],
  )

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const bow = e.currentTarget
    if (bow.hasPointerCapture(e.pointerId)) {
      bow.releasePointerCapture(e.pointerId)
    }

    const activePull = pullRef.current
    if (!activePull || flyingRef.current) {
      syncPull(null)
      return
    }

    const shot = shotFromPull(activePull.mid, activePull.pull)
    syncPull(null)
    if (!shot) return

    startFlight({
      x: activePull.mid.x,
      y: activePull.mid.y,
      rot: shot.rot,
      vx: shot.vx,
      vy: shot.vy,
    })
  }

  useEffect(() => () => stopFlight(), [stopFlight])

  const fallenLeaf = LEAVES.find((l) => l.id === targetLeaf.id)!

  return (
    <ExperienceShell className="lx-arrow">
      <MeadowRiverBackground />

      <div className="lx-arrow-arena" ref={arenaRef}>
        <div className="lx-cupid">
          <CupidWithBow
            bowRef={bowRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
          <p className="lx-cupid-hint">
            {missed ? 'พลาดนิดหน่อย — ลองอีกครั้ง' : 'กดค้าง · ดึง · ปล่อย'}
          </p>
        </div>

        <HeartTargetTree
          leaves={LEAVES}
          targetLeafId={targetLeaf.id}
          fallen={fallen}
          shake={shake}
        />

        {pull ? (
          <svg className="lx-bow-string" aria-hidden>
            <line
              x1={pull.top.x}
              y1={pull.top.y}
              x2={pull.pull.x}
              y2={pull.pull.y}
              stroke="rgba(255, 255, 255, 0.92)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line
              x1={pull.bot.x}
              y1={pull.bot.y}
              x2={pull.pull.x}
              y2={pull.pull.y}
              stroke="rgba(255, 255, 255, 0.92)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx={pull.pull.x} cy={pull.pull.y} r="4" fill="#fbcfe8" opacity="0.95" />
            <line
              x1={pull.mid.x}
              y1={pull.mid.y}
              x2={pull.pull.x}
              y2={pull.pull.y}
              stroke="rgba(255, 255, 255, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {trajectory.length > 1 ? (
              <>
                <polyline
                  className="lx-aim-path"
                  points={trajectory.map((p) => `${p.x},${p.y}`).join(' ')}
                />
                {trajectory.filter((_, i) => i > 0 && i % 4 === 0).map((p, i) => (
                  <circle key={i} className="lx-aim-dot" cx={p.x} cy={p.y} r="3.5" />
                ))}
              </>
            ) : null}
          </svg>
        ) : null}

        {trails.map((t) => (
          <span key={t.id} className="lx-trail" style={{ left: t.x, top: t.y }} aria-hidden>
            ♥
          </span>
        ))}

        {arrow ? (
          <div
            className="lx-arrow-shot"
            style={{ left: arrow.x, top: arrow.y }}
          >
            <HeartArrow rot={arrow.rot} />
          </div>
        ) : null}

        {fallen ? (
          <motion.button
            type="button"
            className="lx-fallen-leaf"
            style={{ left: `${fallenLeaf.left - 4}%`, top: `${fallenLeaf.top + 18}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setPopup(true)}
          >
            ♥
          </motion.button>
        ) : null}
      </div>

      <AnimatePresence>
        {popup ? (
          <motion.div
            className="lx-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="lx-popup"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="lx-popup-heart" aria-hidden>
                ❤️
              </p>
              <p className="lx-popup-msg">
                {content.loveMessage ||
                  `รัก ${gift.recipient_name || 'เธอ'} มากที่สุดในโลก — จาก ${gift.sender_name || 'ฉัน'}`}
              </p>
              <button
                type="button"
                className="lx-popup-cta"
                onClick={() => navigate(demoPath(content.nextSlug || 'memory-story'))}
              >
                ต่อไป ❤️
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ExperienceShell>
  )
}
