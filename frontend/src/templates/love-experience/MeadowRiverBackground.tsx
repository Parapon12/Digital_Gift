const GRASS_BLADES = Array.from({ length: 64 }, (_, i) => ({
  id: i,
  x: (i / 63) * 1000,
  h: 12 + (i % 6) * 4,
  lean: -10 + (i % 9) * 2.5,
  delay: (i % 11) * 0.12,
}))

const POLLEN = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: 6 + ((i * 19) % 88),
  top: 14 + ((i * 27) % 58),
  size: 2 + (i % 3),
  delay: i * 0.65,
  duration: 5 + (i % 5) * 2,
}))

const WILDFLOWERS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 40 + ((i * 43) % 520),
  y: 18 + (i % 4) * 6,
}))

const DISTANT_TREES = [
  { x: 120, h: 72, w: 38 },
  { x: 210, h: 58, w: 30 },
  { x: 340, h: 80, w: 42 },
  { x: 480, h: 64, w: 34 },
  { x: 620, h: 76, w: 40 },
  { x: 780, h: 60, w: 32 },
  { x: 920, h: 70, w: 36 },
]

/** Fully procedural meadow + river scene — no image assets. */
export function MeadowRiverBackground() {
  return (
    <div className="lx-meadow-scene" aria-hidden>
      <svg className="lx-meadow-scene-sky" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lxSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3d2858" />
            <stop offset="28%" stopColor="#7b5a9e" />
            <stop offset="52%" stopColor="#c995b8" />
            <stop offset="72%" stopColor="#f0b888" />
            <stop offset="88%" stopColor="#ffd4a8" />
            <stop offset="100%" stopColor="#ffe8c8" />
          </linearGradient>
          <radialGradient id="lxSunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8e8" />
            <stop offset="35%" stopColor="#ffd080" />
            <stop offset="100%" stopColor="rgba(255,180,80,0)" />
          </radialGradient>
          <linearGradient id="lxHillFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a7a52" />
            <stop offset="100%" stopColor="#2d5234" />
          </linearGradient>
          <linearGradient id="lxHillNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ecf58" />
            <stop offset="100%" stopColor="#3a7a38" />
          </linearGradient>
          <linearGradient id="lxRiverGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7ec8e8" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#5aa8c8" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#3a7898" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id="lxRiverShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,240,220,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="lxMeadowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ed86a" />
            <stop offset="100%" stopColor="#4a9a42" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#lxSkyGrad)" />

        <circle cx="980" cy="210" r="120" fill="url(#lxSunGlow)" opacity="0.95" />
        <circle cx="980" cy="210" r="48" fill="#fff4d8" opacity="0.92" />

        <g className="lx-cloud lx-cloud-a" opacity="0.82">
          <ellipse cx="280" cy="160" rx="90" ry="32" fill="rgba(255,240,250,0.75)" />
          <ellipse cx="340" cy="148" rx="70" ry="28" fill="rgba(255,245,252,0.8)" />
          <ellipse cx="220" cy="152" rx="55" ry="24" fill="rgba(255,238,248,0.7)" />
        </g>
        <g className="lx-cloud lx-cloud-b" opacity="0.72">
          <ellipse cx="620" cy="120" rx="110" ry="36" fill="rgba(255,230,240,0.65)" />
          <ellipse cx="700" cy="108" rx="80" ry="30" fill="rgba(255,235,245,0.72)" />
        </g>
        <g className="lx-cloud lx-cloud-c" opacity="0.68">
          <ellipse cx="1180" cy="140" rx="95" ry="34" fill="rgba(255,220,210,0.6)" />
          <ellipse cx="1260" cy="128" rx="72" ry="28" fill="rgba(255,225,215,0.68)" />
        </g>

        <path
          d="M0,520 C200,460 380,500 560,470 C740,440 920,490 1100,455 C1260,425 1380,460 1440,445 L1440,900 L0,900 Z"
          fill="url(#lxHillFar)"
          opacity="0.85"
        />
        <path
          d="M0,580 C240,520 420,560 640,530 C860,500 1080,555 1280,525 C1360,515 1400,535 1440,528 L1440,900 L0,900 Z"
          fill="url(#lxHillNear)"
        />

        <path
          className="lx-river-body"
          d="M720,540 C820,520 900,560 980,545 C1080,525 1180,570 1280,550 C1340,540 1380,555 1440,548 L1440,900 L680,900 C700,820 710,680 720,540 Z"
          fill="url(#lxRiverGrad)"
        />
        <path
          className="lx-river-shine"
          d="M760,580 C860,565 960,600 1060,585 C1160,570 1260,610 1360,595"
          fill="none"
          stroke="url(#lxRiverShine)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.55"
        />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            className="lx-water-ripple"
            style={{ animationDelay: `${i * 1.1}s` }}
            d={`M740,${620 + i * 38} Q920,${608 + i * 32} 1100,${625 + i * 36} T1380,${618 + i * 34}`}
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2"
          />
        ))}

        <path
          d="M0,640 C180,600 360,630 540,610 C720,590 900,635 1080,615 C1200,602 1320,628 1440,618 L1440,900 L0,900 Z"
          fill="url(#lxMeadowGrad)"
        />

        {DISTANT_TREES.map((t, i) => (
          <g key={i} transform={`translate(${t.x}, ${640 - t.h})`} opacity="0.55">
            <rect x={t.w / 2 - 5} y={t.h - 18} width="10" height="22" rx="3" fill="#4a3828" />
            <ellipse cx={t.w / 2} cy={t.h * 0.42} rx={t.w / 2} ry={t.h * 0.48} fill="#3d6a38" />
            <ellipse cx={t.w / 2 - 8} cy={t.h * 0.55} rx={t.w * 0.35} ry={t.h * 0.32} fill="#4a7a42" opacity="0.8" />
          </g>
        ))}

        {WILDFLOWERS.map((f) => (
          <g key={f.id} transform={`translate(${f.x}, ${680 + f.y})`}>
            <line x1="0" y1="0" x2="0" y2="14" stroke="#5a9a48" strokeWidth="1.5" />
            <circle cx="0" cy="-2" r="3.5" fill={f.id % 3 === 0 ? '#ffb4c8' : f.id % 3 === 1 ? '#fff0a8' : '#e8c8ff'} />
          </g>
        ))}

        <path
          d="M0,780 C200,740 400,770 600,750 C800,730 1000,765 1200,745 C1320,732 1400,752 1440,745 L1440,900 L0,900 Z"
          fill="#5cb848"
          opacity="0.92"
        />
      </svg>

      <div className="lx-meadow-scene-atmosphere" />

      <svg className="lx-meadow-scene-grass" viewBox="0 0 1000 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lxGrassBlade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ee870" />
            <stop offset="100%" stopColor="#3d7a32" />
          </linearGradient>
        </defs>
        {GRASS_BLADES.map((b) => (
          <path
            key={b.id}
            className="lx-grass-blade"
            style={{ animationDelay: `${b.delay}s` }}
            d={`M${b.x},80 Q${b.x + b.lean},${80 - b.h * 0.55} ${b.x + b.lean * 0.4},${80 - b.h}`}
            stroke="url(#lxGrassBlade)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </svg>

      <div className="lx-meadow-scene-pollen">
        {POLLEN.map((p) => (
          <span
            key={p.id}
            className="lx-pollen"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="lx-meadow-scene-vignette" />
    </div>
  )
}
