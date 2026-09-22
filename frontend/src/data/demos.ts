import type { DemoContent, Gift, TemplateInfo, TemplateKey } from '../types'
import { defaultContent } from '../types'
import { defaultCrocodileBlessingContent } from '../templates/crocodile/constants'
import { buildMonthlyCapsules, DEMO_LOVE_MEMORIES } from '../utils/loveStoryCapsules'

/** Hidden from homepage / admin picker — legacy gifts still render via direct link. */
export const HIDDEN_TEMPLATE_KEYS = new Set<TemplateKey>(['graduation', 'love_adventure_3d'])

/** ขั้นต่อใน Love Experience — เปิดจาก flow ไม่โชว์เป็น pill หน้าแรก */
export const FLOW_TEMPLATE_KEYS = new Set<TemplateKey>(['love_letter', 'love_arrow', 'memory_story'])

export function visibleTemplates(templates: TemplateInfo[]): TemplateInfo[] {
  return templates.filter((t) => !HIDDEN_TEMPLATE_KEYS.has(t.key))
}

export function homepageFeatured(templates: TemplateInfo[]) {
  return templates.filter((t) => t.status === 'complete')
}

export function homepageOccasions(templates: TemplateInfo[]) {
  return templates.filter((t) => t.status === 'skeleton' && !FLOW_TEMPLATE_KEYS.has(t.key))
}

/** ลำดับการ์ดบนหน้าแรก */
export const HOMEPAGE_DEMO_ORDER: TemplateKey[] = [
  'love_story',
  'love_quiz',
  'memory_page',
  'birthday',
  'crocodile_blessing',
]

/** ตัวอย่างทั้งหมดในระบบ (แก้ในแอดมินได้) */
export const CATALOG_DEMO_SLUGS = [
  'love-story',
  'love-quiz',
  'memory-page',
  'birthday',
  'crocodile-blessing',
  'love-letter',
  'love-arrow',
  'memory-story',
] as const

export type CatalogDemoSlug = (typeof CATALOG_DEMO_SLUGS)[number]

export interface DemoAdminGroup {
  id: string
  title: string
  help: string
  slugs: CatalogDemoSlug[]
}

export const DEMO_ADMIN_GROUPS: DemoAdminGroup[] = [
  {
    id: 'homepage',
    title: 'หน้าแรก — การ์ดตัวอย่าง',
    help: 'แต่ละการ์ดแก้ทีละช่วงตามหน้าจอ (รูป + ข้อความ) — Love Quiz รวม 4 หน้า flow',
    slugs: ['love-story', 'love-quiz', 'memory-page', 'birthday', 'crocodile-blessing'],
  },
  {
    id: 'flow',
    title: 'Love Experience — ขั้นต่อหลัง Love Quiz',
    help: 'Love Quiz → จดหมาย → ลูกศร → Memory Story (ไม่โชว์การ์ดหน้าแรก แต่แก้เนื้อหาได้)',
    slugs: ['love-letter', 'love-arrow', 'memory-story'],
  },
]

export function mergeTemplateCatalog(remote: TemplateInfo[]): TemplateInfo[] {
  const byKey = new Map<TemplateKey, TemplateInfo>()
  for (const t of LOCAL_TEMPLATES) byKey.set(t.key, t)
  for (const t of remote) byKey.set(t.key, t)
  return visibleTemplates([...byKey.values()])
}

export function homepageDemos(templates: TemplateInfo[]): TemplateInfo[] {
  const catalog = templates.length ? mergeTemplateCatalog(templates) : LOCAL_TEMPLATES
  const byKey = new Map(catalog.map((t) => [t.key, t]))
  return HOMEPAGE_DEMO_ORDER.map((key) => byKey.get(key)).filter(Boolean) as TemplateInfo[]
}

export function catalogDemos(demos: DemoContent[]): DemoContent[] {
  const order = new Map<string, number>(CATALOG_DEMO_SLUGS.map((slug, index) => [slug, index]))
  return demos
    .filter((d) => order.has(d.demo_slug))
    .sort((a, b) => (order.get(a.demo_slug) ?? 0) - (order.get(b.demo_slug) ?? 0))
}

export function groupCatalogDemos(demos: DemoContent[]): { group: DemoAdminGroup; items: DemoContent[] }[] {
  const bySlug = new Map(demos.map((d) => [d.demo_slug, d]))
  return DEMO_ADMIN_GROUPS.map((group) => ({
    group,
    items: group.slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as DemoContent[],
  }))
}

/** Template catalog used when API is offline (e.g. GitHub Pages demos). */
export const LOCAL_TEMPLATES: TemplateInfo[] = visibleTemplates([
  {
    key: 'love_story',
    name: 'Love Story',
    name_th: 'เรื่องราวความรัก',
    description: 'กล่องของขวัญ · รหัส · นับวัน · ความทรงจำ · ซองลับ',
    status: 'complete',
    demo_slug: 'love-story',
  },
  {
    key: 'love_quiz',
    name: 'Love Quiz',
    name_th: 'ควิซความรัก',
    description: 'ปุ่มไม่วิ่งหนี · พลุ · แมว · ต่อเนื่อง Experience Flow',
    status: 'complete',
    demo_slug: 'love-quiz',
  },
  {
    key: 'love_letter',
    name: 'Love Letter',
    name_th: 'จดหมายรัก',
    description: 'ซองจดหมาย · เปิดแล้วไปต่อ',
    status: 'skeleton',
    demo_slug: 'love-letter',
  },
  {
    key: 'love_arrow',
    name: 'Cupid Arrow',
    name_th: 'คupid ยิงลูกศร',
    description: 'มินิเกมธนู · ใบไม้หัวใจ',
    status: 'skeleton',
    demo_slug: 'love-arrow',
  },
  {
    key: 'memory_story',
    name: 'Memory Story',
    name_th: 'เรื่องราวความทรงจำ',
    description: 'Animation Timeline · Countdown · Gallery · หัวใจคำว่ารัก',
    status: 'skeleton',
    demo_slug: 'memory-story',
  },
  {
    key: 'memory_page',
    name: 'Memory Page',
    name_th: 'หน้ารำลึกความทรงจำ',
    description: 'scrapbook เลื่อนลงดูรูป แคปชัน และโน้ตลับ',
    status: 'complete',
    demo_slug: 'memory-page',
  },
  {
    key: 'birthday',
    name: 'Birthday',
    name_th: 'วันเกิด',
    description: 'ฝนหัวใจ · Happy birthday · สมุดรูป 5 หน้า',
    status: 'complete',
    demo_slug: 'birthday',
  },
  {
    key: 'crocodile_blessing',
    name: 'Tiger Blessing',
    name_th: 'กราดพุงเสืออวยพร',
    description: 'แตะพุงเสือ · คำอวยพรถึงคนสำคัญหรือแฟน',
    status: 'complete',
    demo_slug: 'crocodile-blessing',
  },
])

const DEMO_CONTENT: Record<string, Record<string, unknown>> = {
  'love-story': {
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
  },
  'love-quiz': {
    question: 'รักฉันมั้ยที่รัก',
    yesLabel: 'รักที่สุด',
    noLabel: 'ไม่',
    successTitle: 'น่ารัก',
    successMessage: 'ได้ยินแล้วใจฟูเลย 😊',
    backgroundImageUrl: 'love/quiz-bg.png',
    catRunImageUrl: 'love/mochi-cat.png',
    photos: ['love/couple-demo.png'],
    nextSlug: 'love-letter',
  },
  'love-letter': { nextSlug: 'love-arrow' },
  'love-arrow': {
    loveMessage: 'รักเธอมากที่สุดในโลก — ทุกวัน ทุกนาที ทุกลมหายใจ',
    nextSlug: 'memory-story',
  },
  'memory-story': {
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
    endingWord: 'I love you',
  },
  'memory-page': {
    theme: 'couple',
    title: 'สมุดความทรงจำของเรา',
    intro: 'ข้อความใต้รูปบอกแค่ที่ไหน — เปิดซองเพื่ออ่านความรู้สึกที่เก็บไว้',
    musicUrl: '',
    letterTitle: 'ขอบคุณที่เป็นเธอ',
    letterBody:
      'ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้\n\nทุกภาพที่ผ่านมา อาจดูเป็นแค่ที่ไหนสักแห่ง — แต่สำหรับฉัน มันคือเหตุผลที่ยังยิ้มได้ในวันที่เหนื่อย\n\nขอบคุณที่ฟัง ขอบคุณที่อยู่ และขอบคุณที่ยังเลือกกันอยู่\n\nจากนี้ไป… ฉันยังอยากสร้างความทรงจำต่อไปด้วยกัน',
    closingTitle: 'ขอบคุณที่เป็นเธอ',
    closingMessage:
      'ขอบคุณที่เดินมาด้วยกันจนถึงหน้านี้\n\nทุกภาพที่ผ่านมา อาจดูเป็นแค่ที่ไหนสักแห่ง — แต่สำหรับฉัน มันคือเหตุผลที่ยังยิ้มได้ในวันที่เหนื่อย\n\nขอบคุณที่ฟัง ขอบคุณที่อยู่ และขอบคุณที่ยังเลือกกันอยู่\n\nจากนี้ไป… ฉันยังอยากสร้างความทรงจำต่อไปด้วยกัน',
    entries: [
      {
        id: '1',
        date: 'วันแรก',
        caption: 'คาเฟ่มุมเงียบ · ย่านเก่า',
        imageUrl: 'love/couple-demo.png',
        secretNote:
          'วันนั้นหัวใจเต้นแรงกว่าที่แสดงออก แค่ได้มานั่งตรงข้ามเธอ ก็รู้สึกว่าโลกช้าลง และอยากเก็บช่วงเวลานั้นไว้นาน ๆ',
      },
      {
        id: '2',
        date: 'คืนที่คุยยาว',
        caption: 'ห้องพัก · หน้าต่างเล็ก ๆ',
        imageUrl: 'love/memory-lock-ref.png',
        secretNote:
          'ข้อความยาว ๆ ในมือถือ แต่ฉันไม่เคยเบื่อ ยิ้มคนเดียวหลายรอบ เพราะรู้ว่าอีกฝั่งก็ยังไม่อยากนอนเหมือนกัน',
      },
      {
        id: '3',
        date: 'ทริปแรก',
        caption: 'ชายหาด · ตอนเย็นลมแรง',
        imageUrl: 'love/quiz-meadow.png',
        secretNote:
          'เสียงคลื่นกลบความเขินไปบางส่วน แต่ความรู้สึกยังดังมาก อยากบอกเธอตอนนั้นเลยว่า “ดีใจที่มาด้วยกัน”',
      },
      {
        id: '4',
        date: 'วันเดินเขา',
        caption: 'ยอดเขา · หมอกบาง ๆ',
        imageUrl: 'love/memory-04-park.jpg',
        secretNote:
          'เหนื่อยขึ้นไปด้วยกัน แต่ตอนเห็นวิวแล้วรู้เลยว่าคุ้ม — เพราะมีเธอข้าง ๆ',
      },
      {
        id: '5',
        date: 'เช้าวันว่าง',
        caption: 'คาเฟ่เงียบ · แก้วร้อน ๆ',
        imageUrl: 'love/memory-05-cafe.jpg',
        secretNote:
          'กลิ่นกาแฟกับเสียงหัวเราะเบา ๆ ทำให้เช้าธรรมดา กลายเป็นวันที่อยากจำ',
      },
      {
        id: '6',
        date: 'ทริปทะเล',
        caption: 'ชายหาด · น้ำใสฟ้าเปิด',
        imageUrl: 'love/memory-06-beach.jpg',
        secretNote:
          'เสียงคลื่นกลบความเขินไปได้บ้าง แต่ความรู้สึกยังดังมาก ดีใจที่มาด้วยกัน',
      },
      {
        id: '7',
        date: 'ค่ำเมืองใหญ่',
        caption: 'ถนนกลางคืน · ไฟเมือง',
        imageUrl: 'love/memory-07-city.jpg',
        secretNote:
          'คนเยอะแค่ไหนก็ไม่เหงา เพราะเดินคู่กันในเมืองที่วุ่นวาย',
      },
      {
        id: '8',
        date: 'เย็นสีส้ม',
        caption: 'ขอบฟ้า · แสงก่อนค่ำ',
        imageUrl: 'love/memory-08-sunset.jpg',
        secretNote:
          'ฟ้าเปลี่ยนสีช้า ๆ เหมือนช่วงที่เราเริ่มคุยกันมากขึ้นทุกวัน',
      },
      {
        id: '9',
        date: 'วันที่เปิดใจ',
        caption: 'ป่าเล็ก ๆ · ทางเดินใต้ต้นไม้',
        imageUrl: 'love/memory-09-forest.jpg',
        secretNote:
          'พูดเรื่องที่เก็บมานานด้วยเสียงสั่น แต่เธอฟังจนจบ — ขอบคุณมากจนพูดไม่ออก',
      },
      {
        id: '10',
        date: 'วันนี้',
        caption: 'บ้าน · มุมอุ่น ๆ',
        imageUrl: 'love/memory-10-home.jpg',
        secretNote:
          'ยังเลือกเธออยู่ในทุกเช้า และยังอยากเลือกต่อไปในทุกพรุ่งนี้',
      },
    ],
  },
  birthday: {
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
  },
  'crocodile-blessing': defaultCrocodileBlessingContent(),
}

export function getLocalDemo(slug: string): Gift | null {
  const template = LOCAL_TEMPLATES.find((t) => t.demo_slug === slug)
  if (!template) return null

  const now = new Date().toISOString()
  return {
    id: '00000000-0000-0000-0000-000000000000',
    public_id: `demo-${slug}`,
    template_key: template.key,
    title: `${template.name_th} (ตัวอย่าง)`,
    recipient_name: 'เธอ',
    sender_name: 'ฉัน',
    content: DEMO_CONTENT[slug] ?? defaultContent(template.key),
    is_published: true,
    created_at: now,
    updated_at: now,
  }
}
