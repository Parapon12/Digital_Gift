import { useCallback, useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'
import type { Gift, LoveQuizContent } from '../types'

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

export function LoveQuiz({ gift }: { gift: Gift }) {
  const content = gift.content as LoveQuizContent
  const [won, setWon] = useState(false)
  const [noPos, setNoPos] = useState<NoPos>({ left: 0, top: 0, rot: 0 })
  const [catRun, setCatRun] = useState(false)
  const [fireworks, setFireworks] = useState<Firework[]>([])
  const [gothicFlash, setGothicFlash] = useState<{ id: number; emoji: string } | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const noRef = useRef<HTMLButtonElement>(null)
  const noPosRef = useRef(noPos)
  const fwId = useRef(0)
  const gothicId = useRef(0)

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
    const pad = 8

    const maxLeft = Math.max(pad, aw - bw - pad)
    const maxTop = Math.max(pad, ah - bh - pad)

    const cur = noPosRef.current
    let left = pad
    let top = pad

    if (!flee) {
      const isInitial = cur.left === 0 && cur.top === 0 && cur.rot === 0
      if (isInitial) {
        left = clamp((aw - bw) / 2, pad, maxLeft)
        top = clamp(ah * 0.62 - bh / 2, pad, maxTop)
      } else {
        left = clamp(cur.left, pad, maxLeft)
        top = clamp(cur.top, pad, maxTop)
      }
    } else {
      let best = { left: cur.left, top: cur.top, dist: -1 }
      for (let i = 0; i < 14; i++) {
        const nx = pad + Math.random() * Math.max(0, maxLeft - pad)
        const ny = pad + Math.random() * Math.max(0, maxTop - pad)
        const dist = Math.hypot(nx - cur.left, ny - cur.top)
        if (dist > best.dist) best = { left: nx, top: ny, dist }
      }
      left = clamp(best.left, pad, maxLeft)
      top = clamp(best.top, pad, maxTop)
    }

    const dx = left - cur.left
    const dy = top - cur.top
    const rot = flee
      ? clamp((Math.atan2(dy, dx) * 180) / Math.PI * 0.15 + (Math.random() - 0.5) * 10, -18, 18)
      : 0

    setNoPos({ left, top, rot })
  }, [])

  const runAway = () => placeNoButton(true)

  const flashGothic = () => {
    const emojis = ['💀', '☠️', '🖤', '🦇', '🕸️']
    gothicId.current += 1
    const id = gothicId.current
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    setGothicFlash({ id, emoji })
    window.setTimeout(() => {
      setGothicFlash((prev) => (prev?.id === id ? null : prev))
    }, 900)
  }

  const onNoTap = () => {
    flashGothic()
    runAway()
  }

  useEffect(() => {
    if (won) return
    const id = window.requestAnimationFrame(() => placeNoButton(false))
    const onResize = () => placeNoButton(false)
    window.addEventListener('resize', onResize)
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('resize', onResize)
    }
  }, [won, placeNoButton])

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
    <div className={`lq-root ${won ? 'is-won' : ''}`} ref={stageRef}>
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

      {gothicFlash ? (
        <div key={gothicFlash.id} className="lq-gothic" aria-hidden>
          {gothicFlash.emoji}
        </div>
      ) : null}

      {catRun && (
        <div className="lq-cat-run" aria-hidden>
          <img src={asset('love/mochi-cat.png')} alt="" />
          <span className="lq-cat-trail">♥</span>
          <span className="lq-cat-trail delay">✦</span>
        </div>
      )}

      <div className="lq-stage">
        {!won ? (
          <>
            <h1 className="lq-hello">
              <span className="lq-hello-name">{gift.recipient_name || 'เธอ'}</span>
            </h1>
            <p className="lq-q">
              {content.question || 'รักฉันมั้ยที่รัก'}
              <span className="lq-wave" aria-hidden />
            </p>

            <div className="lq-buttons" ref={arenaRef}>
              <button type="button" className="lq-yes" onClick={onYes}>
                {content.yesLabel || 'รักที่สุด'} <span aria-hidden>❤</span>
              </button>
              <button
                ref={noRef}
                type="button"
                className="lq-no"
                style={{
                  left: noPos.left,
                  top: noPos.top,
                  transform: `rotate(${noPos.rot}deg)`,
                }}
                onMouseEnter={runAway}
                onFocus={runAway}
                onClick={(e) => {
                  e.preventDefault()
                  onNoTap()
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  onNoTap()
                }}
              >
                <span className="lq-no-lines" aria-hidden />
                {content.noLabel || 'ไม่'}
                <span className="lq-no-lines" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <div className="lq-win">
            <div className="lq-win-burst" aria-hidden>❤</div>
            <h2>{content.successTitle || 'น่ารัก'}</h2>
            <p className="lq-win-lead">
              {content.successMessage || 'ได้ยินแล้วใจฟูเลย 😊'}
            </p>
            {(content.photos || []).filter(Boolean).map((url) => (
              <img key={url} src={asset(url)} alt="" className="lq-photo" />
            ))}
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
        )}
      </div>
    </div>
  )
}
