export function BookPinkBackdrop() {
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
      <span className="bx-cover-lace" />
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={`p-${i}`}
          className="bx-cover-petal"
          style={{
            left: `${4 + i * 8}%`,
            top: `${60 + (i % 4) * 8}%`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  )
}
