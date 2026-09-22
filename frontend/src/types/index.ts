import { buildMonthlyCapsules, DEMO_LOVE_MEMORIES } from '../utils/loveStoryCapsules'
import { defaultCrocodileBlessingContent } from '../templates/crocodile/constants'

export type TemplateKey =
  | 'love_adventure_3d'
  | 'love_story'
  | 'love_quiz'
  | 'love_letter'
  | 'love_arrow'
  | 'memory_story'
  | 'memory_page'
  | 'birthday'
  | 'crocodile_blessing'
  | 'graduation'

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

export interface CrocodileBlessingContent {
  eyebrow?: string
  title?: string
  subtitle?: string
  intro?: string
  hint?: string
  photo1?: string
  text1?: string
  photo2?: string
  photo3?: string
  closing?: string
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
  /** รหัส เช่น 16062025 (ววดดปปปป) */
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
  /** รูปพื้นหลังทุ่ง (meadow) */
  backgroundImageUrl?: string
  /** รูปแมววิ่งหลังตอบใช่ */
  catRunImageUrl?: string
  /** รูปในหน้าชนะ (แสดงทีละรูปเรียงลง) */
  photos?: string[]
  /** หน้าถัดไปหลังกดต่อไป */
  nextSlug?: string
}

export interface LoveLetterContent {
  nextSlug?: string
}

export interface LoveArrowContent {
  loveMessage?: string
  nextSlug?: string
}

export interface MemoryStoryContent {
  memoryPhotos?: string[]
  galleryPhotos?: string[]
  endingWord?: string
}

export interface OccasionContent {
  headline?: string
  message?: string
  photos?: string[]
}

/** Birthday — heart rain → Happy birthday → photo book */
export interface BirthdayContent {
  /** รูปลอยมุมบน (12 รูป) */
  floatPhotos?: string[]
  /** รูปในสมุด (10 รูป — 5 หน้าคู่) */
  bookPhotos?: string[]
  /** คำอวยพรหน้า 1, 3, 5 ของสมุด */
  blessingSpread1?: string
  blessingSpread3?: string
  blessingSpread5?: string
  /** ข้อความบนปกสมุด */
  coverMessage?: string
  /** หัวข้อย่อยหน้าข้อความซ้าย (Happy Birthday ใต้) */
  bookLeftSubtitle?: string
  /** ข้อความยาวหน้าซ้าย หน้า 1, 3, 5 */
  bookLeftBody1?: string
  bookLeftBody3?: string
  bookLeftBody5?: string
  /** คำบรรยายใต้รูป polaroid (10 รูป) */
  bookPhotoCaptions?: string[]
}

export interface SiteConfig {
  line_url: string
  frontend_url: string
  /** LAN-reachable origin for phone QR / share (may differ from frontend_url in local dev) */
  share_url?: string
}

/** Persisted demo page editable from admin (maps to demo_content table). */
export interface DemoContent {
  demo_slug: string
  template_key: TemplateKey
  title: string
  recipient_name: string
  sender_name: string
  content: Record<string, unknown>
  updated_at: string
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
  love_quiz: [
    'question',
    'yesLabel',
    'noLabel',
    'successTitle',
    'successMessage',
    'backgroundImageUrl',
    'catRunImageUrl',
    'photos',
    'nextSlug',
  ],
  love_letter: ['nextSlug'],
  love_arrow: ['loveMessage', 'nextSlug'],
  memory_story: ['memoryPhotos', 'galleryPhotos', 'endingWord'],
  memory_page: ['theme', 'title', 'intro', 'musicUrl', 'closingTitle', 'closingMessage', 'entries'],
  birthday: [
    'floatPhotos',
    'bookPhotos',
    'blessingSpread1',
    'blessingSpread3',
    'blessingSpread5',
    'coverMessage',
    'bookLeftSubtitle',
    'bookLeftBody1',
    'bookLeftBody3',
    'bookLeftBody5',
    'bookPhotoCaptions',
  ],
  crocodile_blessing: ['eyebrow', 'title', 'subtitle', 'intro', 'hint', 'photo1', 'text1', 'photo2', 'photo3', 'closing'],
  graduation: ['headline', 'message', 'photos'],
}

export function defaultContent(key: TemplateKey): Record<string, unknown> {
  switch (key) {
    case 'love_adventure_3d':
      return {
        message: '',
        catName: 'Mochi',
        memories: [
          { title: 'จุดเริ่มต้น', text: '', imageUrl: '' },
          { title: 'แรงบันดาลใจ', text: '', imageUrl: '' },
          { title: 'มุมมองใหม่', text: '', imageUrl: '' },
          { title: 'ประสบการณ์มีค่า', text: '', imageUrl: '' },
          { title: 'ความทรงจำงดงาม', text: '', imageUrl: '' },
        ],
        musicUrl: '',
      }
    case 'love_story':
      return {
        title: 'ความทรงจำของเรา',
        password: '16062025',
        passwordHint: 'วัน เดือน ปี ที่เราเริ่มคบกัน',
        anniversaryDate: '2025-06-16',
        couplePhotoUrl: 'love/couple-demo.png',
        anniversaryLabel: 'วันเริ่มคบกัน',
        musicUrl: '',
        targetDays: 1000,
        memories: DEMO_LOVE_MEMORIES,
        capsules: buildMonthlyCapsules(),
      }
    case 'love_quiz':
      return {
        question: 'รักฉันมั้ยที่รัก',
        yesLabel: 'รักที่สุด',
        noLabel: 'ไม่',
        successTitle: 'น่ารัก',
        successMessage: 'ได้ยินแล้วใจฟูเลย 😊',
        backgroundImageUrl: 'love/quiz-bg.png',
        catRunImageUrl: 'love/mochi-cat.png',
        photos: ['love/couple-demo.png'],
        nextSlug: 'love-letter',
      }
    case 'love_letter':
      return { nextSlug: 'love-arrow' }
    case 'love_arrow':
      return {
        loveMessage: '',
        nextSlug: 'memory-story',
      }
    case 'memory_story':
      return {
        memoryPhotos: [
          'love/couple-demo.png',
          'love/memory-10-home.jpg',
          'love/memory-09-forest.jpg',
          'love/memory-07-city.jpg',
        ],
        galleryPhotos: [
          'love/gallery-01-party-dog.png',
          'love/gallery-02-cake-dog.jpg',
          'love/gallery-03-blue-sky.png',
          'love/gallery-04-cloud-face.png',
          'love/gallery-05-sunset.png',
          'love/gallery-06-moon-couple.png',
          'love/gallery-07-starry-couple.png',
          'love/gallery-08-beach-couple.png',
        ],
        endingWord: 'love you',
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
        floatPhotos: [
          'birthday/part1/01.png',
          'birthday/part1/02.png',
          'birthday/part1/01.png',
          'birthday/part1/02.png',
          'birthday/part1/01.png',
          'birthday/part1/02.png',
          'birthday/part1/01.png',
          'birthday/part1/02.png',
          'birthday/part1/01.png',
          'birthday/part1/02.png',
          'birthday/part1/01.png',
          'birthday/part1/02.png',
        ],
        bookPhotos: [
          'birthday/book/01.jpg',
          'birthday/book/02.jpg',
          'birthday/book/03.jpg',
          'birthday/book/04.png',
          'birthday/book/05.png',
          'birthday/book/06.png',
          'birthday/book/07.png',
          'birthday/book/08.png',
          'birthday/book/09.png',
          'birthday/book/10.png',
        ],
        blessingSpread1: 'สุขสันต์วันเกิดนะ — ขอให้วันนี้เต็มไปด้วยรอยยิ้มและความสุข',
        blessingSpread3: 'ขอบคุณที่เข้ามาเป็นแสงสว่างในทุกวันที่ผ่านมา',
        blessingSpread5: 'จากนี้ไป… ขอให้ทุกวันมีความหมายและอบอุ่นเหมือนเดิมเสมอ',
        coverMessage: 'แค่เธอคนพิเศษของฉัน',
        bookLeftSubtitle: 'แด่เธอคนพิเศษของฉัน',
        bookLeftBody1: 'ขอให้วันนี้... และทุกๆ วัน เป็นวันที่ดีของเธอเสมอ มีความสุขมากๆ นะคนเก่งของฉัน',
        bookLeftBody3: 'ขอบคุณที่อยู่เคียงข้างกันเสมอมา ขอให้ทุกวันของเธอเต็มไปด้วยรอยยิ้มและความอบอุ่น',
        bookLeftBody5: 'จากนี้ไป… ไม่ว่าจะไปที่ไหน ขอให้มีความสุขและรู้ว่ามีคนที่รักเธอเสมอ',
        bookPhotoCaptions: ['', 'ขอให้สดใสเหมือนดอกไม้ช่อนี้นะ :)', '', '', '', '', '', '', '', ''],
      }
    case 'crocodile_blessing':
      return defaultCrocodileBlessingContent()
    case 'graduation':
      return {
        headline: 'ยินดีด้วยนะบัณฑิต',
        message: 'ภูมิใจในความพยายามของเธอมาก',
        photos: [],
      }
    default:
      return { headline: '', message: '', photos: [''] }
  }
}
