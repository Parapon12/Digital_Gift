import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { asset } from '../lib/asset'
import type { Gift, LoveQuizContent } from '../types'
import { demoPath } from './love-experience/nav'
import { OfferHeartArm } from './love-quiz/OfferHeartArm'

type Firework = {
  id: number
  x: number
  y: number
  hue: number
}

type NoPos = {
  left: number
  top: number
  rot: number
}

function burstConfetti(root: HTMLElement) {
  const colors = ['#f4a4c0', '#e87ba8', '#c9a0e8', '#fff0f5', '#ffd6e7', '#b794f6']
  for (let i = 0; i < 72; i++) {
    const el = document.createElement('span')
    el.className = 'quiz-confetti'
    el.style.left = `${10 + Math.random() * 80}%`
    el.style.background = colors[i % colors.length]
    el.style.setProperty('--dx', `${(Math.random() - 0.5) * 160}px`)
    el.style.setProperty('--rot', `${Math.random() * 720}deg`)
    el.style.animationDelay = `${Math.random() * 0.35}s`
    el.style.width = `${6 + Math.random() * 8}px`
    el.style.height = `${8 + Math.random() * 10}px`
    root.appendChild(el)
    window.setTimeout(() => el.remove(), 2600)
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const ANGRY_EMOJIS = ['😠', '😡', '🤬', '💢', '👿', '😤']

export function LoveQuiz({ gift }: { gift: Gift }) {
  const content = gift.content as LoveQuizContent
  const navigate = useNavigate()
  const [won, setWon] = useState(false)
  const [noPos, setNoPos] = useState<NoPos>({ left: 0, top: 0, rot: 0 })
  const [catRun, setCatRun] = useState(false)
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [angryFlash, setAngryFlash] = useState<{ id: number; emoji: string } | null>(null)
  const [noHasFled, setNoHasFled] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const noPosRef = useRef(noPos)
  const fwId = useRef(0)
  const angryId = useRef(0)

  useEffect(() => {
    noPosRef.current = noPos
  }, [noPos])

  const placeNoButton = useCallback((flee = false) => {
    const arena = arenaRef.current
    const btn = noRef.current
    if (!arena || !btn) return

    const aw = arena.clientWidth
    const ah = arena.clientHeight
    const bw = btn.offsetWidth || 72
    const bh = btn.offsetHeight || 40
    const pad = 10

    const maxLeft = Math.max(pad, aw - bw - pad)
    const maxTop = Math.max(pad, ah - bh - pad)

    const yesBtn = arena.querySelector('.lq-yes') as HTMLElement | null
    const arenaBox = arena.getBoundingClientRect()
    const yesPad = 14
    const yesRect = yesBtn
      ? (() => {
          const r = yesBtn.getBoundingClientRect()
          return {
            left: r.left - arenaBox.left - yesPad,
            top: r.top - arenaBox.top - yesPad,
            right: r.right - arenaBox.left + yesPad,
            bottom: r.bottom - arenaBox.top + yesPad,
          }
        })()
      : null

    const hitsYes = (left: number, top: number) => {
      if (!yesRect) return false
      return !(
        left + bw < yesRect.left ||
        left > yesRect.right ||
        top + bh < yesRect.top ||
        top > yesRect.bottom
      )
    }

    const cur = noPosRef.current
    let left = pad
    let top = pad

    if (!flee) {
      const isInitial = cur.left === 0 && cur.top === 0 && cur.rot === 0
      if (isInitial && yesBtn) {
        const yr = yesBtn.getBoundingClientRect()
        left = clamp(yr.right - arenaBox.left + 14, pad, maxLeft)
        top = clamp(yr.top - arenaBox.top + (yr.height - bh) / 2, pad, maxTop)
      } else if (isInitial) {
        left = clamp((aw - bw) / 2, pad, maxLeft)
        top = clamp((ah - bh) / 2 + 56, pad, maxTop)
      } else {
        left = clamp(cur.left, pad, maxLeft)
        top = clamp(cur.top, pad, maxTop)
      }
    } else {
      let best = { left: cur.left, top: cur.top, dist: -1 }
      for (let i = 0; i < 22; i++) {
        const nx = pad + Math.random() * Math.max(0, maxLeft - pad)
        const ny = pad + Math.random() * Math.max(0, maxTop - pad)
        if (hitsYes(nx, ny)) continue
        const dist = Math.hypot(nx - cur.left, ny - cur.top)
        if (dist > best.dist) best = { left: nx, top: ny, dist }
      }
      left = clamp(best.left, pad, maxLeft)
      top = clamp(best.top, pad, maxTop)
      if (hitsYes(left, top)) {
        top = clamp(yesRect ? yesRect.bottom + 8 : top + 48, pad, maxTop)
      }
    }

    const dx = left - cur.left
    const dy = top - cur.top
    const rot = flee
      ? clamp((Math.atan2(dy, dx) * 180) / Math.PI * 0.15 + (Math.random() - 0.5) * 10, -18, 18)
      : 0

    setNoPos({ left, top, rot })
  }, [])

  const runAway = () => placeNoButton(true)

  const flashAngry = () => {
    angryId.current += 1
    const id = angryId.current
    const emoji = ANGRY_EMOJIS[Math.floor(Math.random() * ANGRY_EMOJIS.length)]
    setAngryFlash({ id, emoji })
    window.setTimeout(() => {
      setAngryFlash((prev) => (prev?.id === id ? null : prev))
    }, 900)
  }

  const onNoInteract = () => {
    flashAngry()
    if (!noHasFled) {
      const arena = arenaRef.current
      const btn = noRef.current
      if (arena && btn) {
        const rect = btn.getBoundingClientRect()
        const arenaRect = arena.getBoundingClientRect()
        setNoHasFled(true)
        setNoPos({
          left: rect.left - arenaRect.left,
          top: rect.top - arenaRect.top,
          rot: 0,
        })
        window.requestAnimationFrame(() => placeNoButton(true))
        return
      }
    }
    runAway()
  }

  useEffect(() => {
    if (won || !noHasFled) return
    const id = window.requestAnimationFrame(() => placeNoButton(false))
    const onResize = () => placeNoButton(false)
    window.addEventListener('resize', onResize)
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('resize', onResize)
    }
  }, [won, noHasFled, placeNoButton])

  const spawnFireworks = () => {
    const waves: Firework[] = []
    for (let i = 0; i < 8; i++) {
      fwId.current += 1
      waves.push({
        id: fwId.current,
        x: 12 + Math.random() * 76,
        y: 12 + Math.random() * 45,
        hue: 320 + Math.random() * 40,
      })
    }
    setFireworks((prev) => [...prev, ...waves])
    window.setTimeout(() => {
      setFireworks((prev) => prev.filter((f) => !waves.some((w) => w.id === f.id)))
    }, 1800)
  }

  const onYes = () => {
    setWon(true)
    setCatRun(true)
    if (stageRef.current) burstConfetti(stageRef.current)
    spawnFireworks()
    window.setTimeout(spawnFireworks, 500)
    window.setTimeout(spawnFireworks, 1100)
  }

  useEffect(() => {
    if (!catRun) return
    const t = window.setTimeout(() => setCatRun(false), 7200)
    return () => window.clearTimeout(t)
  }, [catRun])

  return (
    <div
      className={`lq-root ${won ? 'is-won' : ''}`}
      ref={stageRef}
      style={
        content.backgroundImageUrl
          ? ({
              ['--lq-meadow-img' as string]: `url("${asset(content.backgroundImageUrl)}")`,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="lq-bg" aria-hidden />
      <div className="lq-bg-veil" aria-hidden />
      <div className="lq-petals" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <i key={i} style={{ ['--p' as string]: i }} />
        ))}
      </div>

      {fireworks.map((fw) => (
        <div
          key={fw.id}
          className="lq-firework"
          style={{ left: `${fw.x}%`, top: `${fw.y}%`, ['--hue' as string]: fw.hue }}
          aria-hidden
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} style={{ ['--i' as string]: i }} />
          ))}
        </div>
      ))}

      {angryFlash ? (
        <div key={angryFlash.id} className="lq-angry-flash" aria-hidden>
          {angryFlash.emoji}
        </div>
      ) : null}

      {catRun && (
        <div className="lq-cat-run" aria-hidden>
          <img src={asset(content.catRunImageUrl || 'love/mochi-cat.png')} alt="" />
          <span className="lq-cat-trail">♥</span>
          <span className="lq-cat-trail delay">✦</span>
        </div>
      )}

      <div className="lq-stage" ref={arenaRef}>
        {!won ? (
          <>
            <div className="lq-head">
              <h1 className="lq-hello">
                <span className="lq-hello-name">{gift.recipient_name || 'เธอ'}</span>
              </h1>
              <p className="lq-q">
                {content.question || 'รักฉันมั้ยที่รัก'}
                <span className="lq-wave" aria-hidden />
              </p>
            </div>

            <div className="lq-cat-lane">
              <OfferHeartArm />
            </div>

            <div className="lq-button-dock">
              <div className="lq-button-row">
                <button type="button" className="lq-yes" onClick={onYes}>
                  {content.yesLabel || 'รักที่สุด'} <span aria-hidden>❤</span>
                </button>
                <button
                  ref={noRef}
                  type="button"
                  className={`lq-no ${noHasFled ? 'is-fleeing' : ''}`}
                  style={
                    noHasFled
                      ? {
                          left: noPos.left,
                          top: noPos.top,
                          transform: `rotate(${noPos.rot}deg)`,
                        }
                      : undefined
                  }
                  onMouseEnter={onNoInteract}
                  onFocus={onNoInteract}
                  onClick={(e) => {
                    e.preventDefault()
                    onNoInteract()
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    onNoInteract()
                  }}
                >
                  <span className="lq-no-lines" aria-hidden />
                  {content.noLabel || 'ไม่'}
                  <span className="lq-no-lines" aria-hidden />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="lq-win">
            <div className="lq-win-burst" aria-hidden>❤</div>
            <div className="lq-win-head">
              <h2>{content.successTitle || 'น่ารัก'}</h2>
              <p className="lq-win-lead">
                {content.successMessage || 'ได้ยินแล้วใจฟูเลย 😊'}
              </p>
            </div>
            {(content.photos || []).filter(Boolean).map((url) => (
              <div key={url} className="lq-photo-wrap">
                <span className="lq-photo-fw lq-photo-fw-left" aria-hidden>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <i key={i} style={{ ['--i' as string]: i, ['--delay' as string]: `${i * 0.17}s` }} />
                  ))}
                </span>
                <span className="lq-photo-fw lq-photo-fw-right" aria-hidden>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <i key={i} style={{ ['--i' as string]: i, ['--delay' as string]: `${i * 0.17 + 0.45}s` }} />
                  ))}
                </span>
                <img src={asset(url)} alt="" className="lq-photo" />
              </div>
            ))}
            <div className="lq-win-actions">
              <button type="button" className="lq-continue" onClick={() => navigate(demoPath(content.nextSlug || 'love-letter'))}>
                ต่อไป ❤️
              </button>
              <button
                type="button"
                className="lq-again"
                onClick={() => {
                  setCatRun(true)
                  spawnFireworks()
                  if (stageRef.current) burstConfetti(stageRef.current)
                }}
              >
                ให้แมววิ่งอีกครั้ง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
