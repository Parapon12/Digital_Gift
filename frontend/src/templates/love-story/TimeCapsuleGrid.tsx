import type { LoveCapsule } from '../../types'
import {
  canOpenCapsule,
  capsuleMonthIndex,
  daysUntilUnlock,
  formatMilestoneLabel,
} from '../../utils/anniversary'

function EnvelopeArt({ ready }: { ready: boolean }) {
  return (
    <div className={`tc-env-art ${ready ? 'is-ready' : ''}`} aria-hidden>
      {ready ? (
        <>
          <span className="tc-spark tc-spark-a">✦</span>
          <span className="tc-spark tc-spark-b">♥</span>
          <span className="tc-spark tc-spark-c">✦</span>
        </>
      ) : null}
      <span className="tc-env-body">
        <span className="tc-env-flap" />
        <span className="tc-env-heart">♥</span>
      </span>
    </div>
  )
}

export function TimeCapsuleGrid({
  capsules,
  anniversaryDate,
  onOpen,
}: {
  capsules: LoveCapsule[]
  anniversaryDate?: string
  onOpen: (capsule: LoveCapsule) => void
}) {
  const timed = capsules
    .filter((c) => c.unlockRule === 'months' || c.unlockRule === 'years')
    .sort(
      (a, b) => capsuleMonthIndex(a.unlockRule, a.unlockValue) - capsuleMonthIndex(b.unlockRule, b.unlockValue),
    )

  const noAnniversary = !anniversaryDate

  return (
    <section className="tc-page">
      <header className="tc-head">
        <p className="tc-kicker">
          Time Capsule
          <span aria-hidden>♥</span>
        </p>
        <h1 className="tc-title">กล่องข้อความลับ</h1>
        <p className="tc-sub">
          <span aria-hidden>✦</span>
          ซ่อนข้อความความรู้สึกไว้ เพื่อวันที่พิเศษของเรา
          <span aria-hidden>✦</span>
        </p>
      </header>

      {noAnniversary ? (
        <p className="tc-no-date">
          ยังไม่ได้ตั้งวันครบรอบ — ข้อความลับจะเปิดได้เมื่อถึงวันครบรอบของแต่ละเดือน
        </p>
      ) : null}

      <div className="tc-grid">
        {timed.map((c, i) => {
          const monthIndex = capsuleMonthIndex(c.unlockRule, c.unlockValue)
          if (monthIndex < 1) return null
          const label = c.unlockLabel || formatMilestoneLabel(monthIndex)
          const openable = !noAnniversary && canOpenCapsule(anniversaryDate, monthIndex)
          const daysLeft = anniversaryDate ? daysUntilUnlock(anniversaryDate, monthIndex) : 0

          return (
            <button
              key={c.id || `${label}-${i}`}
              type="button"
              className={`tc-card ${openable ? 'is-ready' : 'is-locked'}`}
              onClick={() => openable && onOpen(c)}
              disabled={!openable}
            >
              <span className="tc-card-lock" aria-hidden>{openable ? '🔓' : '🔒'}</span>
              <EnvelopeArt ready={openable} />
              <strong className="tc-card-label">{label}</strong>
              <span className={`tc-card-status ${openable ? 'ready' : 'locked'}`}>
                {openable ? '🔓 พร้อมเปิดแล้ว' : '🔒 ยังไม่ถึงเวลา'}
              </span>
              <span className="tc-card-countdown">
                <span aria-hidden>🕒</span>
                เหลืออีก {daysLeft} วัน
              </span>
            </button>
          )
        })}
      </div>

      <p className="tc-foot">♥ ทุกข้อความคือความรู้สึกดี ๆ ที่เก็บไว้เพื่อเรา ♥</p>
      <div className="tc-clouds" aria-hidden>
        <span className="tc-cloud tc-cloud-l" />
        <span className="tc-cloud tc-cloud-r" />
      </div>
    </section>
  )
}
