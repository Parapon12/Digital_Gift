import { motion } from 'framer-motion'

export type TreeLeaf = { id: number; left: number; top: number; size: number; delay: number }

type Props = {
  leaves: TreeLeaf[]
  targetLeafId: number
  fallen: boolean
  shake: boolean
}

const BRANCHES = [
  { d: 'M100,248 C88,210 72,178 58,148', w: 9 },
  { d: 'M100,228 C118,192 138,162 152,128', w: 8 },
  { d: 'M100,268 C82,238 68,208 52,178', w: 7 },
  { d: 'M100,255 C122,228 142,198 158,168', w: 7 },
  { d: 'M58,148 C48,128 42,108 38,88', w: 5 },
  { d: 'M152,128 C162,108 168,90 172,72', w: 5 },
  { d: 'M52,178 C42,158 36,140 32,122', w: 4.5 },
  { d: 'M158,168 C168,148 174,128 178,108', w: 4.5 },
  { d: 'M100,200 C100,168 100,138 100,108', w: 6 },
]

const FOLIAGE = [
  { cx: 100, cy: 88, rx: 52, ry: 44 },
  { cx: 58, cy: 118, rx: 36, ry: 32 },
  { cx: 148, cy: 108, rx: 38, ry: 34 },
  { cx: 78, cy: 148, rx: 32, ry: 28 },
  { cx: 128, cy: 142, rx: 34, ry: 30 },
  { cx: 100, cy: 128, rx: 28, ry: 24 },
  { cx: 42, cy: 108, rx: 24, ry: 22 },
  { cx: 162, cy: 98, rx: 26, ry: 24 },
]

/** Procedural tree with trunk, branches, and foliage — no image assets. */
export function HeartTargetTree({ leaves, targetLeafId, fallen, shake }: Props) {
  return (
    <motion.div
      className="lx-tree lx-tree-art"
      animate={shake ? { rotate: [0, -2, 2, -1.2, 0.8, 0], x: [0, -5, 5, -3, 0] } : { rotate: 0, x: 0 }}
      transition={{ duration: 0.55 }}
    >
      <svg className="lx-tree-svg" viewBox="0 0 200 320" aria-hidden>
        <defs>
          <linearGradient id="lxTrunkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5a3820" />
            <stop offset="35%" stopColor="#8b5a32" />
            <stop offset="65%" stopColor="#7a4a28" />
            <stop offset="100%" stopColor="#4a2818" />
          </linearGradient>
          <linearGradient id="lxBranchGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b4423" />
            <stop offset="50%" stopColor="#9a6840" />
            <stop offset="100%" stopColor="#5a3820" />
          </linearGradient>
          <radialGradient id="lxLeafCluster" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#8ef068" />
            <stop offset="55%" stopColor="#52a842" />
            <stop offset="100%" stopColor="#2d6830" />
          </radialGradient>
          <radialGradient id="lxLeafClusterShade" cx="60%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#6ecf58" />
            <stop offset="100%" stopColor="#286830" />
          </radialGradient>
          <filter id="lxTreeShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#1a3018" floodOpacity="0.35" />
          </filter>
        </defs>

        <ellipse cx="100" cy="308" rx="48" ry="10" fill="rgba(20,50,18,0.28)" />

        <path
          d="M88,318 C86,280 84,240 86,200 C88,168 92,140 96,118 C98,108 102,108 104,118 C108,140 112,168 114,200 C116,240 114,280 112,318 Z"
          fill="url(#lxTrunkGrad)"
          filter="url(#lxTreeShadow)"
        />
        <path
          d="M96,200 C94,170 98,140 100,120"
          stroke="rgba(255,220,180,0.15)"
          strokeWidth="2"
          fill="none"
        />

        {BRANCHES.map((b, i) => (
          <path
            key={i}
            d={b.d}
            fill="none"
            stroke="url(#lxBranchGrad)"
            strokeWidth={b.w}
            strokeLinecap="round"
          />
        ))}

        {FOLIAGE.map((f, i) => (
          <ellipse
            key={i}
            cx={f.cx}
            cy={f.cy}
            rx={f.rx}
            ry={f.ry}
            fill={i % 2 === 0 ? 'url(#lxLeafCluster)' : 'url(#lxLeafClusterShade)'}
            opacity={0.92 - (i % 3) * 0.06}
          />
        ))}

        <ellipse cx="100" cy="95" rx="44" ry="38" fill="url(#lxLeafCluster)" opacity="0.88" />
      </svg>

      {leaves.map((leaf) => (
        <motion.span
          key={leaf.id}
          data-leaf-id={leaf.id}
          className={`lx-leaf ${fallen && leaf.id === targetLeafId ? 'is-hit' : ''}`}
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            scale: leaf.size,
            animationDelay: `${leaf.delay}s`,
          }}
          animate={
            fallen && leaf.id === targetLeafId
              ? { opacity: 0, scale: leaf.size * 0.7 }
              : { y: [0, -6, 0], opacity: 1 }
          }
          transition={
            fallen && leaf.id === targetLeafId
              ? { duration: 0.35, ease: 'easeOut' }
              : { duration: 3.2 + leaf.delay, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          ♥
        </motion.span>
      ))}
    </motion.div>
  )
}
