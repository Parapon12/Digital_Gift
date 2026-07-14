import { Suspense, lazy, type ReactElement } from 'react'
import type { Gift, TemplateKey } from '../types'
import { BirthdayGift } from './BirthdayGift'
import { GraduationGift } from './GraduationGift'
import { LoveQuiz } from './LoveQuiz'
import { LoveStory } from './LoveStory'
import { MemoryPage } from './MemoryPage'
import { ProposalGift } from './ProposalGift'

const LoveAdventure3D = lazy(() =>
  import('./LoveAdventure3D').then((m) => ({ default: m.LoveAdventure3D })),
)

function AdventureFallback() {
  return (
    <div className="adv-webgl-fallback">
      <p>กำลังโหลดฉาก 3D…</p>
      <small>ใช้เวลาสักครู่บนมือถือ</small>
    </div>
  )
}

const MAP: Record<TemplateKey, (gift: Gift) => ReactElement> = {
  love_adventure_3d: (g) => (
    <Suspense fallback={<AdventureFallback />}>
      <LoveAdventure3D gift={g} />
    </Suspense>
  ),
  love_story: (g) => <LoveStory gift={g} />,
  love_quiz: (g) => <LoveQuiz gift={g} />,
  memory_page: (g) => <MemoryPage gift={g} />,
  birthday: (g) => <BirthdayGift gift={g} />,
  graduation: (g) => <GraduationGift gift={g} />,
  proposal: (g) => <ProposalGift gift={g} />,
}

export function GiftRenderer({ gift }: { gift: Gift }) {
  const render = MAP[gift.template_key]
  if (!render) {
    return <div className="gift-fallback">ไม่รองรับเทมเพลตนี้</div>
  }
  return <div className="gift-runtime">{render(gift)}</div>
}
