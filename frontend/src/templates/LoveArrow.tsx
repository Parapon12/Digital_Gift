import { LoveArrowScene } from './love-experience/LoveArrowScene'
import type { Gift } from '../types'

export function LoveArrow({ gift }: { gift: Gift }) {
  return <LoveArrowScene gift={gift} />
}
