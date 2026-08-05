/** Fixed slots — left / right columns, large frames */
export const MEMORY_PHOTO_SLOTS = [
  { side: 'left' as const, top: '5%' },
  { side: 'right' as const, top: '5%' },
  { side: 'left' as const, top: '36%' },
  { side: 'right' as const, top: '36%' },
]

/** Heart-shaped layout points for the ending sequence (normalized -1..1). */
export function generateHeartPoints(count: number) {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    points.push({ x: x / 16, y: y / 16 })
  }
  return points
}
