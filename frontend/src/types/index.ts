import { buildMonthlyCapsules } from '../utils/loveStoryCapsules'

export type TemplateKey =
  | 'love_adventure_3d'
  | 'love_story'
  | 'love_quiz'
  | 'memory_page'
  | 'birthday'
  | 'graduation'
  | 'proposal'

export type MemoryTheme = 'couple' | 'friends' | 'family'

export interface MemoryPageEntry {
  id?: string
  date?: string
  caption: string
  imageUrl: string
  /** ปลดล็อกเมื่อเลื่อนถึง / คลิก */
  secretNote?: string
}

export interface MemoryPageContent {
  theme?: MemoryTheme
  title?: string
  intro?: string
  musicUrl?: string
  closingTitle?: string
  closingMessage?: string
  /** จดหมายขอบคุณท้ายหน้า */
  letterTitle?: string
  letterBody?: string
  entries?: MemoryPageEntry[]
}

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

/** Birthday page — hero + 4 popup cards */
export interface BirthdayContent {
  /** หัวข้อเช่น สุขสันต์วันเกิด */
  headline?: string
  /** ข้อความใต้ชื่อผู้รับ */
  message?: string
  /** แถบล่างขอบคุณ */
  closingMessage?: string
  /** รูปฮีโร่ซ้าย */
  heroImageUrl?: string
  /** การ์ด: ข้อความพิเศษ */
  specialMessage?: string
  /** การ์ด: ความทรงจำ (เลื่อนได้) */
  photos?: string[]
  /** การ์ด: เกมวันเกิด */
  gameTitle?: string
  gameMessage?: string
  /** การ์ด: ของขวัญ */
  giftTitle?: string
  giftMessage?: string
  giftImageUrl?: string
}

export interface SiteConfig {
  line_url: string
  frontend_url: string
  /** LAN-reachable origin for phone QR / share (may differ from frontend_url in local dev) */
  share_url?: string
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
  memory_page: ['theme', 'title', 'intro', 'musicUrl', 'closingTitle', 'closingMessage', 'entries'],
  birthday: [
    'headline',
    'message',
    'closingMessage',
    'heroImageUrl',
    'specialMessage',
    'photos',
    'gameTitle',
    'gameMessage',
    'giftTitle',
    'giftMessage',
    'giftImageUrl',
  ],
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
        password: '16062026',
        passwordHint: 'วัน เดือน ปี ที่เราเริ่มคบกัน · ตัวอย่าง 16062026',
        anniversaryDate: '2026-06-16',
        couplePhotoUrl: 'love/couple-demo.png',
        anniversaryLabel: 'วันเริ่มคบกัน',
        musicUrl: '',
        targetDays: 1000,
        memories: [
          { title: 'ทะเลครั้งแรก', text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊', imageUrl: '', caption: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊' },
          { title: 'ชาบูครั้งแรก', text: 'ร้านชาบูครั้งแรก 🍲', imageUrl: '', caption: 'ร้านชาบูครั้งแรก 🍲' },
          { title: 'วันเกิดปีแรก', text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂', imageUrl: '', caption: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂' },
        ],
        capsules: buildMonthlyCapsules(),
      }
    case 'love_quiz':
      return {
        question: 'รักฉันมั้ยที่รัก',
        yesLabel: 'รักที่สุด',
        noLabel: 'ไม่',
        successTitle: 'น่ารัก',
        successMessage: 'ได้ยินแล้วใจฟูเลย 😊',
        photos: [],
      }
    case 'memory_page':
      return {
        theme: 'couple',
        title: 'สมุดความทรงจำของเรา',
        intro: 'ใต้รูปบอกแค่ที่ไหน — เปิดซองเพื่ออ่านความรู้สึกที่เก็บไว้',
        musicUrl: '',
        letterTitle: 'ขอบคุณที่เป็นเธอ',
        letterBody:
          'ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้\n\nทุกภาพที่ผ่านมา อาจดูเป็นแค่ที่ไหนสักแห่ง — แต่สำหรับฉัน มันคือเหตุผลที่ยังยิ้มได้ในวันที่เหนื่อย\n\nขอบคุณที่ฟัง ขอบคุณที่อยู่ และขอบคุณที่ยังเลือกกันอยู่',
        closingTitle: 'ขอบคุณที่เป็นเธอ',
        closingMessage:
          'ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้\n\nทุกภาพที่ผ่านมา อาจดูเป็นแค่ที่ไหนสักแห่ง — แต่สำหรับฉัน มันคือเหตุผลที่ยังยิ้มได้ในวันที่เหนื่อย',
        entries: [
          {
            id: '1',
            date: 'วันแรก',
            caption: 'คาเฟ่มุมเงียบ · ย่านเก่า',
            imageUrl: '/love/couple-demo.png',
            secretNote: 'วันนั้นหัวใจเต้นแรงกว่าที่แสดงออก แค่ได้มานั่งตรงข้ามเธอ ก็รู้สึกว่าโลกช้าลง',
          },
          {
            id: '2',
            date: 'ทริปแรก',
            caption: 'ชายหาด · ตอนเย็นลมแรง',
            imageUrl: '/love/quiz-meadow.png',
            secretNote: 'เสียงคลื่นกลบความเขิน แต่ความรู้สึกยังดังมาก อยากบอกเลยว่าดีใจที่มาด้วยกัน',
          },
          {
            id: '3',
            date: 'วันนี้',
            caption: 'ตรงนี้ · ที่เรายืนด้วยกัน',
            imageUrl: '/love/couple-demo.png',
            secretNote: 'ยังเลือกเธออยู่ในทุกเช้า และยังอยากเลือกต่อไปในทุกพรุ่งนี้',
          },
        ],
      }
    case 'birthday':
      return {
        headline: 'สุขสันต์ วันเกิด',
        message: 'ขอให้เป็นวันที่เต็มไปด้วยรอยยิ้ม ความสุข และสิ่งดี ๆ ในทุก ๆ วันนะ',
        closingMessage: 'ขอบคุณที่เข้ามาเป็นความสุขในชีวิตฉันนะ',
        heroImageUrl: 'birthday/cake-hero.png',
        specialMessage:
          'สุขสันต์วันเกิดนะ\n\nขอบคุณที่เป็นแสงสว่างในทุกวันที่ผ่านมา ขอให้ปีนี้เต็มไปด้วยรอยยิ้ม สุขภาพแข็งแรง และเรื่องดี ๆ ที่ทำให้หัวใจเต้นแรงอย่างมีความสุข',
        photos: [
          'love/couple-demo.png',
          'love/memory-05-cafe.jpg',
          'love/memory-06-beach.jpg',
          'love/memory-08-sunset.jpg',
        ],
        gameTitle: 'เป่าเทียนวันเกิด',
        gameMessage: 'คำอวยพรพิเศษปลดล็อกแล้ว — ขอให้ทุกคำอธิษฐานเป็นจริงนะ',
        giftTitle: 'ของขวัญให้เธอ',
        giftMessage: 'เปิดกล่องนี้แล้ว… ของขวัญจริงคือเธอที่อยู่ในชีวิตฉันทุกวัน',
        giftImageUrl: 'brand/gift-box-a.png',
      }
    case 'graduation':
      return {
        headline: 'ยินดีด้วยนะบัณฑิต',
        message: 'ภูมิใจในความพยายามของเธอมาก',
        photos: [],
      }
    case 'proposal':
      return {
        headline: 'แต่งงานกับฉันนะ',
        message: 'อยากเดินไปด้วยกันตลอดชีวิต',
        photos: [],
      }
    default:
      return { headline: '', message: '', photos: [''] }
  }
}
