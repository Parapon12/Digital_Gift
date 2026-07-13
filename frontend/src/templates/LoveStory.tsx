import { useMemo, useState } from 'react'
import type { Gift, LoveCapsule, LoveStoryContent, LoveStoryMemory } from '../types'
import { GiftBoxIntro } from './love-story/GiftBoxIntro'
import { PasswordLock } from './love-story/PasswordLock'
import { LoveDashboard } from './love-story/LoveDashboard'

type Stage = 'gift' | 'lock' | 'dash'

const DEFAULT_MEMORIES: LoveStoryMemory[] = [
  { title: 'ทะเลครั้งแรก', text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊', caption: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊' },
  { title: 'ชาบูครั้งแรก', text: 'ร้านชาบูครั้งแรก 🍲', caption: 'ร้านชาบูครั้งแรก 🍲' },
  { title: 'วันเกิดปีแรก', text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂', caption: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂' },
]

const DEFAULT_CAPSULES: LoveCapsule[] = [
  { title: 'เปิดได้เมื่อครบ 6 เดือน', unlockRule: 'months', unlockValue: 6, text: 'ผ่านมาครึ่งปีแล้วนะ ขอบคุณที่อยู่ด้วยกัน' },
  { title: 'เปิดได้เมื่อครบ 1 ปี', unlockRule: 'years', unlockValue: 1, text: 'หนึ่งปีของเรา… ยังอยากเดินต่อไปด้วยกัน' },
  { title: 'เปิดได้เมื่อทะเลาะกัน', unlockRule: 'manual', unlocked: true, text: 'แม้ทะเลาะก็ยังเลือกกันอยู่ รักนะ' },
  { title: 'เปิดได้เมื่อคิดถึงกันมาก ๆ', unlockRule: 'always', text: 'คิดถึงแล้วเปิดซองนี้ได้นะ — ฉันก็คิดถึงเหมือนกัน' },
]

export function LoveStory({ gift }: { gift: Gift }) {
  const content = gift.content as LoveStoryContent
  const [stage, setStage] = useState<Stage>('gift')

  const memories = useMemo(() => {
    if (content.memories?.length) return content.memories
    if (content.chapters?.length) {
      return content.chapters.map((c) => ({
        title: c.heading,
        text: c.body,
        caption: c.body,
      }))
    }
    return DEFAULT_MEMORIES
  }, [content.memories, content.chapters])

  const capsules = content.capsules?.length ? content.capsules : DEFAULT_CAPSULES

  return (
    <div className={`ls-root ld-root ls-theme stage-${stage}`}>
      <div className="ls-theme-glow" aria-hidden />
      <div className="ls-floaters" aria-hidden>
        <span className="ls-floater">♥</span>
        <span className="ls-floater">♡</span>
        <span className="ls-floater">♥</span>
        <span className="ls-floater">✧</span>
        <span className="ls-floater">♥</span>
        <span className="ls-floater">♡</span>
      </div>

      {stage === 'gift' && <GiftBoxIntro onOpen={() => setStage('lock')} />}

      {stage === 'lock' && (
        <PasswordLock
          password={content.password}
          passwordHint={content.passwordHint}
          anniversaryDate={content.anniversaryDate}
          couplePhotoUrl={content.couplePhotoUrl}
          musicUrl={content.musicUrl}
          recipientName={gift.recipient_name}
          senderName={gift.sender_name}
          onUnlock={() => setStage('dash')}
        />
      )}

      {stage === 'dash' && (
        <LoveDashboard
          title={content.title || gift.title}
          anniversaryDate={content.anniversaryDate}
          targetDays={content.targetDays}
          memories={memories}
          capsules={capsules}
          onBackHome={() => setStage('gift')}
        />
      )}
    </div>
  )
}
