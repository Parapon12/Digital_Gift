import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import { asset } from '../../lib/asset'

type BowHandlers = {
  bowRef: RefObject<HTMLDivElement | null>
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void
}

/** Reference art + interactive bow hit zone overlaid on the bow limbs. */
export function CupidWithBow({ bowRef, onPointerDown, onPointerMove, onPointerUp }: BowHandlers) {
  return (
    <motion.div
      className="lx-cupid-figure"
      aria-hidden
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img
        className="lx-cupid-figure-img"
        src={asset('love/cupid-with-bow.png')}
        alt=""
        draggable={false}
        decoding="async"
      />

      <div
        ref={bowRef}
        className="lx-bow-hit"
        aria-label="ทนู — กดค้าง ดึง แล้วปล่อย"
        style={{ touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <span className="lx-bow-anchor lx-bow-top" />
        <span className="lx-bow-anchor lx-bow-mid" />
        <span className="lx-bow-anchor lx-bow-bot" />
      </div>
    </motion.div>
  )
}
