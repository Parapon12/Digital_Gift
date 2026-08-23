import type { ReactElement } from 'react'
import type { Gift, TemplateKey } from '../types'
import { BirthdayGift } from './BirthdayGift'
import { CrocodileBlessing } from './CrocodileBlessing'
import { GraduationGift } from './GraduationGift'
import { LoveArrow } from './LoveArrow'
import { LoveLetter } from './LoveLetter'
import { LoveQuiz } from './LoveQuiz'
import { LoveStory } from './LoveStory'
import { MemoryPage } from './MemoryPage'
import { MemoryStory } from './MemoryStory'

const MAP: Record<TemplateKey, (gift: Gift) => ReactElement> = {
  love_adventure_3d: () => (
    <div className="gift-fallback">เทมเพลตเส้นทางผจญภัยถูกถอดออกแล้ว</div>
  ),
  love_story: (g) => <LoveStory gift={g} />,
  love_quiz: (g) => <LoveQuiz gift={g} />,
  love_letter: (g) => <LoveLetter gift={g} />,
  love_arrow: (g) => <LoveArrow gift={g} />,
  memory_story: (g) => <MemoryStory gift={g} />,
  memory_page: (g) => <MemoryPage gift={g} />,
  birthday: (g) => <BirthdayGift gift={g} />,
  crocodile_blessing: (g) => <CrocodileBlessing gift={g} />,
  graduation: (g) => <GraduationGift gift={g} />,
}

export function GiftRenderer({ gift }: { gift: Gift }) {
  const render = MAP[gift.template_key]
  if (!render) {
    return <div className="gift-fallback">ไม่รองรับเทมเพลตนี้</div>
  }
  return <div className="gift-runtime">{render(gift)}</div>
}
