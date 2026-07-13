export type TemplateKey =
  | 'love_adventure_3d'
  | 'love_story'
  | 'love_quiz'
  | 'birthday'
  | 'graduation'
  | 'proposal'

export type TemplateStatus = 'complete' | 'skeleton'

export interface TemplateInfo {
  key: TemplateKey
  name: string
  name_th: string
  description: string
  status: TemplateStatus
  demo_slug: string
}

export interface Gift {
  id: string
  public_id: string
  template_key: TemplateKey
  title: string
  recipient_name: string
  sender_name: string
  content: Record<string, unknown>
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface MemoryItem {
  title: string
  text: string
  imageUrl?: string
}

export interface StoryChapter {
  heading: string
  body: string
}

export interface LoveAdventureContent {
  message?: string
  catName?: string
  memories?: MemoryItem[]
  musicUrl?: string
}

export interface LoveStoryMemory {
  date?: string
  title: string
  text: string
  imageUrl?: string
  caption?: string
}

export type CapsuleUnlock = 'months' | 'years' | 'always' | 'manual'

export interface LoveCapsule {
  id?: string
  title: string
  unlockRule: CapsuleUnlock
  /** จำนวนเดือน/ปี ตาม unlockRule */
  unlockValue?: number
  unlockLabel?: string
  /** สำหรับ manual — true = เปิดได้แล้ว */
  unlocked?: boolean
  text?: string
  imageUrl?: string
  videoUrl?: string
  audioUrl?: string
}

export interface LoveAchievement {
  id?: string
  title: string
  description?: string
  unlocked: boolean
}

export interface LoveStoryContent {
  title?: string
  /** รหัส เช่น 14022025 */
  password?: string
  passwordHint?: string
  anniversaryDate?: string
  couplePhotoUrl?: string
  anniversaryLabel?: string
  musicUrl?: string
  /** เป้าวันสำหรับ progress เช่น 1000 */
  targetDays?: number
  memories?: LoveStoryMemory[]
  capsules?: LoveCapsule[]
  chapters?: StoryChapter[]
  letterTitle?: string
  letterBody?: string
  videoUrl?: string
  endingMessage?: string
  photos?: string[]
}

export interface LoveQuizContent {
  question?: string
  yesLabel?: string
  noLabel?: string
  successTitle?: string
  successMessage?: string
  photos?: string[]
}

export interface OccasionContent {
  headline?: string
  message?: string
  photos?: string[]
}

export interface SiteConfig {
  line_url: string
  frontend_url: string
}

export const TEMPLATE_FIELDS: Record<TemplateKey, string[]> = {
  love_adventure_3d: ['message', 'catName', 'memories', 'musicUrl'],
  love_story: [
    'title',
    'password',
    'passwordHint',
    'anniversaryDate',
    'couplePhotoUrl',
    'musicUrl',
    'targetDays',
    'memories',
    'capsules',
  ],
  love_quiz: ['question', 'yesLabel', 'noLabel', 'successTitle', 'successMessage', 'photos'],
  birthday: ['headline', 'message', 'photos'],
  graduation: ['headline', 'message', 'photos'],
  proposal: ['headline', 'message', 'photos'],
}

export function defaultContent(key: TemplateKey): Record<string, unknown> {
  switch (key) {
    case 'love_adventure_3d':
      return {
        message: '',
        catName: 'Mochi',
        memories: [
          { title: 'วันแรกที่เจอ', text: '', imageUrl: '' },
          { title: 'ทริปด้วยกัน', text: '', imageUrl: '' },
          { title: 'วันที่เหนื่อย', text: '', imageUrl: '' },
          { title: 'วันนี้', text: '', imageUrl: '' },
        ],
        musicUrl: '',
      }
    case 'love_story':
      return {
        title: 'ความทรงจำของเรา',
        password: '14022025',
        passwordHint: 'วัน เดือน ปี ที่เราเริ่มคบกัน · ตัวอย่าง 14022025',
        anniversaryDate: '2025-02-14',
        couplePhotoUrl: 'love/couple-demo.png',
        anniversaryLabel: 'วันเริ่มคบกัน',
        musicUrl: '',
        targetDays: 1000,
        memories: [
          { title: 'ทะเลครั้งแรก', text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊', imageUrl: '', caption: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊' },
          { title: 'ชาบูครั้งแรก', text: 'ร้านชาบูครั้งแรก 🍲', imageUrl: '', caption: 'ร้านชาบูครั้งแรก 🍲' },
          { title: 'วันเกิดปีแรก', text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂', imageUrl: '', caption: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂' },
        ],
        capsules: [
          { title: 'เปิดได้เมื่อครบ 6 เดือน', unlockRule: 'months', unlockValue: 6, text: 'ผ่านมาครึ่งปีแล้วนะ ขอบคุณที่อยู่ด้วยกัน' },
          { title: 'เปิดได้เมื่อครบ 1 ปี', unlockRule: 'years', unlockValue: 1, text: 'หนึ่งปีของเรา… ยังอยากเดินต่อไปด้วยกัน' },
          { title: 'เปิดได้เมื่อทะเลาะกัน', unlockRule: 'manual', unlocked: true, text: 'แม้ทะเลาะก็ยังเลือกกันอยู่ รักนะ' },
          { title: 'เปิดได้เมื่อคิดถึงกันมาก ๆ', unlockRule: 'always', text: 'คิดถึงแล้วเปิดซองนี้ได้นะ — ฉันก็คิดถึงเหมือนกัน' },
        ],
      }
    case 'love_quiz':
      return {
        question: 'จะเป็นแฟนกันไหม?',
        yesLabel: 'ได้เลย!',
        noLabel: 'ไม่',
        successTitle: 'เย้!',
        successMessage: '',
        photos: [],
      }
    default:
      return { headline: '', message: '', photos: [''] }
  }
}
