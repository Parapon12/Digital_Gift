import type { Gift, TemplateInfo } from '../types'
import { defaultContent } from '../types'
import { buildMonthlyCapsules } from '../utils/loveStoryCapsules'

/** Template catalog used when API is offline (e.g. GitHub Pages demos). */
export const LOCAL_TEMPLATES: TemplateInfo[] = [
  {
    key: 'love_adventure_3d',
    name: '3D Love Adventure',
    name_th: 'ผจญภัยความรัก 3D',
    description: 'เดินในฉาก 3D + ความทรงจำ + แมว + ข้อความ',
    status: 'complete',
    demo_slug: 'love-adventure',
  },
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
    description: 'ปุ่มไม่วิ่งหนี · พลุ · แมวถือดอกไม้',
    status: 'complete',
    demo_slug: 'love-quiz',
  },
  {
    key: 'memory_page',
    name: 'Memory Page',
    name_th: 'หน้าความทรงจำ',
    description: 'scrapbook เลื่อนลงดูรูป แคปชัน และโน้ตลับ',
    status: 'complete',
    demo_slug: 'memory-page',
  },
  {
    key: 'birthday',
    name: 'Birthday',
    name_th: 'วันเกิด',
    description: 'เค้ก · ข้อความพิเศษ · ความทรงจำ · เกม · ของขวัญ',
    status: 'complete',
    demo_slug: 'birthday',
  },
  {
    key: 'graduation',
    name: 'Graduation',
    name_th: 'รับปริญญา',
    description: 'โครง 3D + ข้อความ',
    status: 'skeleton',
    demo_slug: 'graduation',
  },
  {
    key: 'proposal',
    name: 'Proposal',
    name_th: 'ขอแต่งงาน',
    description: 'โครง 3D + ข้อความ',
    status: 'skeleton',
    demo_slug: 'proposal',
  },
]

const DEMO_CONTENT: Record<string, Record<string, unknown>> = {
  'love-adventure': {
    message: 'ทุกก้าวที่เราเดินด้วยกันคือความทรงจำที่ฉันเก็บไว้ และอยากเก็บต่อไปอีกนานแสนนาน',
    catName: 'Mochi',
    memories: [
      { title: 'วันแรกที่เจอ', text: 'ยิ้มของเธอทำให้โลกช้าลง ทุกอย่างดูสว่างขึ้นทันที', imageUrl: '' },
      { title: 'ทริปทะเล', text: 'เสียงคลื่นกับเสียงหัวเราะของเรา ยังก้องอยู่ในใจ', imageUrl: '' },
      { title: 'วันที่เหนื่อย', text: 'แค่ได้อยู่ข้างกัน ก็รู้สึกว่าโลกเบาลง', imageUrl: '' },
      { title: 'วันนี้', text: 'ยังเลือกเธอเหมือนเดิม และอยากเดินต่อไปด้วยกัน', imageUrl: '' },
    ],
  },
  'love-story': {
    title: 'ความทรงจำของเรา',
    password: '14022025',
    passwordHint: 'วัน เดือน ปี ที่เราเริ่มคบกัน',
    anniversaryDate: '2026-06-16',
    couplePhotoUrl: 'love/couple-demo.png',
    anniversaryLabel: 'วันเริ่มคบกัน',
    musicUrl: '',
    targetDays: 1000,
    memories: [
      { title: 'ทะเลครั้งแรก', text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊', caption: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊' },
      { title: 'ชาบูครั้งแรก', text: 'ร้านชาบูครั้งแรก 🍲', caption: 'ร้านชาบูครั้งแรก 🍲' },
      { title: 'วันเกิดปีแรก', text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂', caption: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂' },
    ],
    capsules: buildMonthlyCapsules(),
  },
  'love-quiz': {
    question: 'รักฉันมั้ยที่รัก',
    yesLabel: 'รักที่สุด',
    noLabel: 'ไม่',
    successTitle: 'น่ารัก',
    successMessage: 'ได้ยินแล้วใจฟูเลย 😊',
    photos: [],
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
  },
  graduation: { headline: 'ยินดีด้วยนะบัณฑิต', message: 'ภูมิใจในความพยายามของเธอมาก', photos: [] },
  proposal: { headline: 'แต่งงานกับฉันนะ', message: 'อยากเดินไปด้วยกันตลอดชีวิต', photos: [] },
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
