import type { Gift } from '../types'
import { LoveLetterScene } from './love-experience/LoveLetterScene'

export function LoveLetter({ gift }: { gift: Gift }) {
  return <LoveLetterScene gift={gift} />
}
