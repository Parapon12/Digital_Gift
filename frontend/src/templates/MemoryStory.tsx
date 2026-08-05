import { MemoryStoryScene } from './love-experience/MemoryStoryScene'
import type { Gift } from '../types'

export function MemoryStory({ gift }: { gift: Gift }) {
  return <MemoryStoryScene gift={gift} />
}
