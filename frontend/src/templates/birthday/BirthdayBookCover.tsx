function BookCoverBackdrop() {
  const bokeh = [
    { w: 120, t: '8%', l: '5%', o: 0.35 },
    { w: 80, t: '22%', l: '78%', o: 0.28 },
    { w: 160, t: '55%', l: '-5%', o: 0.22 },
    { w: 100, t: '70%', l: '82%', o: 0.3 },
    { w: 200, t: '85%', l: '20%', o: 0.18 },
  ]

  return (
    <div className="bx-cover-bg" aria-hidden>
      {bokeh.map((b, i) => (
        <span
          key={i}
          className="bx-cover-bokeh"
          style={{
            width: b.w,
            height: b.w,
            top: b.t,
            left: b.l,
            opacity: b.o,
          }}
        />
      ))}
      <span className="bx-cover-heart bx-cover-heart--bl" />
      <span className="bx-cover-heart bx-cover-heart--br" />
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={`c-${i}`}
          className="bx-cover-confetti"
          style={{
            left: `${8 + i * 6.5}%`,
            animationDelay: `${(i * 0.37) % 3}s`,
            animationDuration: `${3.5 + (i % 4) * 0.8}s`,
          }}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={`h-${i}`}
          className="bx-cover-mini-heart"
          style={{
            left: `${5 + i * 9}%`,
            top: `${12 + (i % 5) * 14}%`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

export function BirthdayBookCover({
  recipientName,
  senderName,
  coverMessage,
  onOpen,
}: {
  recipientName: string
  senderName: string
  coverMessage: string
  onOpen: () => void
}) {
  return (
    <div className="bx-cover-page">
      <BookCoverBackdrop />

      <header className="bx-cover-head">
        <p className="bx-cover-kicker">♥ สมุดความทรงจำ ♥</p>
        <h1 className="bx-cover-name">
          <span className="bx-cover-sparkle" aria-hidden>
            ✦
          </span>
          {recipientName || 'เธอ'}
          <span className="bx-cover-sparkle" aria-hidden>
            ✦
          </span>
        </h1>
        <p className="bx-cover-from">— {senderName || 'ฉัน'} —</p>
      </header>

      <div className="bx-cover-card">
        <span className="bx-cover-ribbon bx-cover-ribbon--bow" aria-hidden />
        <span className="bx-cover-ribbon bx-cover-ribbon--corner" aria-hidden />

        <div className="bx-cover-card-body">
          <div className="bx-cover-cake-glow" aria-hidden>
            <span className="bx-cover-cake-ring" />
            <span className="bx-cover-cake-icon">🎂</span>
            <span className="bx-cover-stars">✦ ✧ ✦</span>
          </div>

          <p className="bx-cover-script">Happy Birthday</p>

          <div className="bx-cover-tagline">
            <span className="bx-cover-tag-heart" aria-hidden>
              ♥
            </span>
            <span className="bx-cover-tag-line" aria-hidden />
            <p>{coverMessage}</p>
          </div>

          <button type="button" className="bx-cover-cta" onClick={onOpen}>
            <span aria-hidden>♥</span>
            เปิดดูสมุด
          </button>
        </div>
      </div>
    </div>
  )
}
