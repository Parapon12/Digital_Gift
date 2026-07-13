import { useState } from 'react'
import { Link } from 'react-router-dom'

export function GiftBoxIntro({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'zoom'>('idle')

  const handleOpen = () => {
    if (phase !== 'idle') return
    setPhase('opening')
    window.setTimeout(() => setPhase('zoom'), 1100)
    window.setTimeout(() => onOpen(), 2100)
  }

  return (
    <section className={`ld-gift ${phase}`}>
      <header className="ld-gift-top">
        <p className="ld-gift-mode">
          <span aria-hidden>♥</span>
          โหมดความรัก · ไปให้ถึงจุดที่สุดใจ
        </p>
        <Link to="/" className="ld-gift-home">
          <span aria-hidden>⌂</span> กลับหน้าหลัก
        </Link>
      </header>

      <div className="ld-gift-fx" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <i key={`d-${i}`} className="ld-gift-spark" style={{ ['--d' as string]: i }} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={`h-${i}`} className="ld-gift-heart" style={{ ['--h' as string]: i }}>
            ♥
          </span>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <em key={`c-${i}`} className="ld-gift-confetti" style={{ ['--c' as string]: i }} />
        ))}
      </div>

      <div className="ld-gift-hero">
        <p className="ld-kicker">• Digital Gift •</p>
        <h1 className="ld-gift-title">มีของขวัญเล็ก ๆ ให้เธอ</h1>
        <p className="ld-sub">แตะกล่องเพื่อเปิดความทรงจำ 💗</p>

        <button
          type="button"
          className="ld-box-wrap"
          onClick={handleOpen}
          aria-label="เปิดกล่องของขวัญ"
        >
          <div className="ld-glow" aria-hidden />
          <div className="ld-glow ld-glow-core" aria-hidden />
          <div className="ld-glow ld-glow-floor" aria-hidden />

          <div className="ld-box-scene">
            <img
              className="ld-box-img ld-box-closed"
              src="/brand/gift-box-a.png"
              alt=""
              draggable={false}
            />
            <img
              className="ld-box-img ld-box-open"
              src="/brand/gift-box-b.png"
              alt=""
              draggable={false}
            />
            <span className="ld-box-shadow" aria-hidden />
          </div>

          {phase !== 'idle' && (
            <div className="ld-petals" aria-hidden>
              {Array.from({ length: 20 }).map((_, i) => (
                <i key={i} className="ld-petal" style={{ ['--i' as string]: i }} />
              ))}
            </div>
          )}
        </button>

        <button type="button" className="ld-gift-cta" onClick={handleOpen} disabled={phase !== 'idle'}>
          <span className="ld-gift-cta-ico" aria-hidden>👆</span>
          แตะกล่องเพื่อเปิดเลย 💗
        </button>
      </div>

      <aside className="ld-gift-lockcard">
        <span aria-hidden>♥</span>
        <p>ของขวัญนี้ มีเพียงคนเดียว ที่เปิดได้</p>
        <span aria-hidden>🔒</span>
      </aside>

      <footer className="ld-gift-foot">
        <p>
          <span className="ld-gift-rule" aria-hidden />
          <span aria-hidden>♥</span>
          <span className="ld-gift-rule" aria-hidden />
        </p>
        <p>เตรียมใจให้พร้อม แล้วมาเริ่มความทรงจำของเรากันนะ ♡</p>
      </footer>
    </section>
  )
}
