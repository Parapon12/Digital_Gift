import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LoveCapsule, LoveStoryMemory } from '../../types'

function youtubeEmbed(url?: string) {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    const id = u.searchParams.get('v')
    if (id) return `https://www.youtube.com/embed/${id}`
  } catch {
    return ''
  }
  return ''
}

export type DashView = 'home' | 'duration' | 'memories' | 'capsules'

const MOODS = ['sea', 'dinner', 'cake', 'walk', 'night'] as const

const CLOCK_META = [
  { key: 'years', label: 'ปี', icon: '📅' },
  { key: 'months', label: 'เดือน', icon: '💗' },
  { key: 'days', label: 'วัน', icon: '🗓️' },
  { key: 'hours', label: 'ชั่วโมง', icon: '⏰' },
  { key: 'minutes', label: 'นาที', icon: '⏱️' },
  { key: 'seconds', label: 'วินาที', icon: '✨' },
] as const

function useLoveClock(startIso?: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return useMemo(() => {
    if (!startIso) return null
    const start = new Date(`${startIso}T00:00:00`).getTime()
    if (Number.isNaN(start)) return null
    const diff = Math.max(0, now - start)
    const sec = Math.floor(diff / 1000)
    const daysTotal = Math.floor(sec / 86400)
    const years = Math.floor(daysTotal / 365)
    const months = Math.floor((daysTotal % 365) / 30)
    const days = daysTotal - years * 365 - months * 30
    const hours = Math.floor((sec % 86400) / 3600)
    const minutes = Math.floor((sec % 3600) / 60)
    const seconds = sec % 60
    return { years, months, days, hours, minutes, seconds, daysTotal }
  }, [startIso, now])
}

function isCapsuleOpen(c: LoveCapsule, startIso?: string, daysTotal = 0) {
  if (c.unlockRule === 'always') return true
  if (c.unlockRule === 'manual') return !!c.unlocked
  if (!startIso) return false
  if (c.unlockRule === 'months') return daysTotal >= (c.unlockValue || 0) * 30
  if (c.unlockRule === 'years') return daysTotal >= (c.unlockValue || 0) * 365
  return false
}

function MemoryThumb({ m, i }: { m: LoveStoryMemory; i: number }) {
  if (m.imageUrl) return <img src={m.imageUrl} alt="" />
  return <div className={`ld-polaroid-ph mood-${MOODS[i % MOODS.length]}`} aria-hidden />
}

function PageShell({
  children,
  onBack,
  wide,
}: {
  children: ReactNode
  onBack: () => void
  wide?: boolean
}) {
  return (
    <section className={`ls-page enter ${wide ? 'is-wide' : ''}`}>
      <header className="ls-page-top">
        <button type="button" className="ls-back" onClick={onBack}>← กลับ Dashboard</button>
        <span className="ls-youme">♥ You & Me</span>
      </header>
      {children}
    </section>
  )
}

export function LoveDashboard({
  title,
  anniversaryDate,
  targetDays,
  memories,
  capsules,
  onBackHome,
}: {
  title?: string
  anniversaryDate?: string
  targetDays?: number
  memories: LoveStoryMemory[]
  capsules: LoveCapsule[]
  onBackHome?: () => void
}) {
  const [view, setView] = useState<DashView>('home')
  const clock = useLoveClock(anniversaryDate)
  const goal = targetDays || 1000
  const progress = clock ? Math.min(100, (clock.daysTotal / goal) * 100) : 0

  const [polaroid, setPolaroid] = useState<{ m: LoveStoryMemory; i: number } | null>(null)
  const [openCapsule, setOpenCapsule] = useState<LoveCapsule | null>(null)

  if (view === 'duration') {
    const values = {
      years: clock?.years ?? 0,
      months: clock?.months ?? 0,
      days: clock?.days ?? 0,
      hours: clock?.hours ?? 0,
      minutes: clock?.minutes ?? 0,
      seconds: clock?.seconds ?? 0,
    }

    return (
      <PageShell onBack={() => setView('home')} wide>
        <p className="ls-eyebrow">
          Countdown
          <span aria-hidden>♥</span>
        </p>
        <h1 className="ls-title">เราคบกันมานานเท่าไหร่</h1>
        <p className="ls-chip">♥ คบกันมาแล้ว</p>

        <div className="cd-grid">
          {CLOCK_META.map((item) => (
            <div key={item.key} className="cd-card">
              <span className="cd-ico" aria-hidden>{item.icon}</span>
              <div>
                <strong key={`${item.key}-${values[item.key]}`}>{values[item.key]}</strong>
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="cd-progress">
          <p>
            ผ่านไปแล้ว <b>{clock?.daysTotal ?? 0}</b> วัน จาก <b>{goal}</b> วันแรกของเรา
          </p>
          <div className="cd-track">
            <i style={{ width: `${progress}%` }} />
            <em style={{ left: `${progress}%` }}>{progress.toFixed(1)}%</em>
          </div>
          <div className="cd-range">
            <span>0 วัน</span>
            <span>{goal} วัน</span>
          </div>
        </div>

        <p className="ls-footer-note">ขอบคุณที่เข้ามาเป็นความสุขในทุกวันของเรา ♡</p>
      </PageShell>
    )
  }

  if (view === 'memories') {
    return (
      <PageShell onBack={() => { setPolaroid(null); setView('home') }}>
        <p className="ls-eyebrow">
          Gallery
          <span aria-hidden>♥</span>
        </p>
        <h1 className="ls-title">ความทรงจำของเรา</h1>
        <p className="ls-sub">แตะ Polaroid เพื่อขยาย</p>
        <div className="ld-polaroids">
          {memories.map((m, i) => (
            <button
              key={`${m.title}-${i}`}
              type="button"
              className={`ld-polaroid rot-${i % 5}`}
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => setPolaroid({ m, i })}
            >
              <span className="ld-tape" aria-hidden />
              <MemoryThumb m={m} i={i} />
              <span>{m.caption || m.text || m.title}</span>
            </button>
          ))}
        </div>
        {polaroid && (
          <div className="ld-lightbox" onClick={() => setPolaroid(null)} role="presentation">
            <article className="ld-lightbox-card" onClick={(e) => e.stopPropagation()}>
              <MemoryThumb m={polaroid.m} i={polaroid.i} />
              <h2>{polaroid.m.title}</h2>
              <p>{polaroid.m.caption || polaroid.m.text}</p>
              <button type="button" className="ml-btn" onClick={() => setPolaroid(null)}>ปิด</button>
            </article>
          </div>
        )}
      </PageShell>
    )
  }

  if (view === 'capsules') {
    return (
      <PageShell onBack={() => { setOpenCapsule(null); setView('home') }}>
        <p className="ls-eyebrow">
          Time Capsule
          <span aria-hidden>♥</span>
        </p>
        <h1 className="ls-title">กล่องข้อความลับ</h1>
        <p className="ls-sub">ซองที่ถึงเวลาแล้วเท่านั้นที่เปิดได้</p>
        <div className="ld-envelopes">
          {capsules.map((c, i) => {
            const openable = isCapsuleOpen(c, anniversaryDate, clock?.daysTotal ?? 0)
            return (
              <button
                key={`${c.title}-${i}`}
                type="button"
                className={`ld-envelope ${openable ? 'openable' : 'locked'}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => openable && setOpenCapsule(c)}
                disabled={!openable}
              >
                <span className="ld-env-visual" aria-hidden>
                  <span className="ld-env-flap" />
                  <span className="ld-env-seal">{openable ? '♥' : '🔒'}</span>
                </span>
                <span className="ld-env-copy">
                  <strong>{c.unlockLabel || c.title}</strong>
                  <small>{openable ? 'พร้อมเปิดแล้ว' : 'ยังไม่ถึงเวลา'}</small>
                </span>
              </button>
            )
          })}
        </div>
        {openCapsule && (
          <div className="ld-lightbox" onClick={() => setOpenCapsule(null)} role="presentation">
            <article className="ld-lightbox-card letter enter" onClick={(e) => e.stopPropagation()}>
              <p className="ls-eyebrow">{openCapsule.title}</p>
              <p className="ld-letter-body">{openCapsule.text}</p>
              {openCapsule.imageUrl ? <img src={openCapsule.imageUrl} alt="" /> : null}
              {youtubeEmbed(openCapsule.videoUrl) ? (
                <div className="ld-video">
                  <iframe src={youtubeEmbed(openCapsule.videoUrl)} title={openCapsule.title} allowFullScreen />
                </div>
              ) : null}
              {openCapsule.audioUrl ? (
                <audio controls src={openCapsule.audioUrl} style={{ width: '100%', marginTop: 12 }} />
              ) : null}
              <button type="button" className="ml-btn" onClick={() => setOpenCapsule(null)}>ปิดซอง</button>
            </article>
          </div>
        )}
      </PageShell>
    )
  }

  return (
    <section className="ls-page enter">
      <p className="ls-eyebrow">
        Love Dashboard
        <span aria-hidden>♥</span>
      </p>
      <h1 className="ls-title">{title || 'ความทรงจำของเรา'}</h1>
      <p className="ls-sub">เลือกบล็อกเพื่อเปิดสำรวจ</p>
      <div className="ld-blocks ld-blocks-3">
        <button type="button" className="ld-block" onClick={() => setView('duration')}>
          <span className="ld-block-ico">⏳</span>
          <strong>เราคบกันมานานเท่าไหร่</strong>
          <small>{clock ? `${clock.daysTotal} วันแล้ว · เดินต่อทุกวินาที` : 'นับแบบเรียลไทม์'}</small>
        </button>
        <button type="button" className="ld-block" onClick={() => setView('memories')}>
          <span className="ld-block-ico">📸</span>
          <strong>ความทรงจำของเรา</strong>
          <small>{memories.length} Polaroid รอเปิดดู</small>
        </button>
        <button type="button" className="ld-block" onClick={() => setView('capsules')}>
          <span className="ld-block-ico">💌</span>
          <strong>กล่องข้อความลับ</strong>
          <small>Time Capsule · เปิดเมื่อถึงเวลา</small>
        </button>
      </div>
      {onBackHome ? (
        <button type="button" className="ld-link" onClick={onBackHome}>เปิดกล่องใหม่</button>
      ) : null}
    </section>
  )
}
