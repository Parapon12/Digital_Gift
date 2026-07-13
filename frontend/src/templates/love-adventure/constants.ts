export const FINALE_X = 20
export const PATH_START = 1.2
/** World units per second — keep in sync with Couple movement */
export const WALK_SPEED = 1.75

/** Evenly spaced stops along the path before the finale */
export function buildStoryStops(count: number): number[] {
  const n = Math.max(1, Math.min(count, 5))
  const start = 3.2
  const end = 16.2
  if (n === 1) return [(start + end) / 2]
  return Array.from({ length: n }, (_, i) => start + ((end - start) * i) / (n - 1))
}

/** Backup duration if onArrive never fires (ms) */
export function walkDurationMs(fromX: number, toX: number): number {
  const dist = Math.abs(toX - fromX)
  return Math.round(Math.min(12000, Math.max(2200, (dist / WALK_SPEED) * 1000 + 600)))
}

export const STOP_PLACES = [
  { label: 'ทุ่งดอกไม้', hint: 'จุดเริ่มต้นของเรา' },
  { label: 'ริมน้ำ', hint: 'เสียงน้ำเบา ๆ' },
  { label: 'สะพานไม้', hint: 'ก้าวข้ามไปด้วยกัน' },
  { label: 'เนินเขา', hint: 'ใกล้จุดหมายแล้ว' },
  { label: 'ปลายทาง', hint: 'ของขวัญรออยู่' },
]

/** @deprecated use buildStoryStops — kept for scene defaults */
export const STORY_STOPS = buildStoryStops(4)
