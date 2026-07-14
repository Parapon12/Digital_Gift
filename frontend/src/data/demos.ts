import type { Gift, TemplateInfo } from '../types'
import { defaultContent } from '../types'

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
    name_th: 'หน้ารำลึกความทรงจำ',
    description: 'scrapbook เลื่อนลงดูรูป แคปชัน และโน้ตลับ',
    status: 'complete',
    demo_slug: 'memory-page',
  },
  {
    key: 'birthday',
    name: 'Birthday',
    name_th: 'วันเกิด',
    description: 'โครง 3D + ข้อความ',
    status: 'skeleton',
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
    anniversaryDate: '2025-02-14',
    couplePhotoUrl: 'love/couple-demo.png',
    anniversaryLabel: 'วันเริ่มคบกัน',
    musicUrl: '',
    targetDays: 1000,
    memories: [
      { title: 'ทะเลครั้งแรก', text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊', caption: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊' },
      { title: 'ชาบูครั้งแรก', text: 'ร้านชาบูครั้งแรก 🍲', caption: 'ร้านชาบูครั้งแรก 🍲' },
      { title: 'วันเกิดปีแรก', text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂', caption: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂' },
    ],
    capsules: [
      { title: 'เปิดได้เมื่อครบ 6 เดือน', unlockRule: 'months', unlockValue: 6, text: 'ผ่านมาครึ่งปีแล้วนะ ขอบคุณที่อยู่ด้วยกัน' },
      { title: 'เปิดได้เมื่อครบ 1 ปี', unlockRule: 'years', unlockValue: 1, text: 'หนึ่งปีของเรา… ยังอยากเดินต่อไปด้วยกัน' },
      { title: 'เปิดได้เมื่อทะเลาะกัน', unlockRule: 'manual', unlocked: true, text: 'แม้ทะเลาะก็ยังเลือกกันอยู่ รักนะ' },
      { title: 'เปิดได้เมื่อคิดถึงกันมาก ๆ', unlockRule: 'always', text: 'คิดถึงแล้วเปิดซองนี้ได้นะ — ฉันก็คิดถึงเหมือนกัน' },
    ],
  },
  'love-quiz': {
    question: 'จะเป็นแฟนกันไหม?',
    yesLabel: 'ได้เลย!',
    noLabel: 'ไม่',
    successTitle: 'เย้!',
    successMessage: 'จากนี้ไปเราเป็นของกันและกันแล้วนะ',
    photos: [],
  },
  'memory-page': {
    theme: 'couple',
    title: 'สมุดความทรงจำของเรา',
    intro: 'ใต้รูปบอกแค่ที่ไหน — เปิดซองเพื่ออ่านความรู้สึกที่เก็บไว้',
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
        date: 'วันธรรมดา',
        caption: 'ม้านั่งริมทาง · หน้าบ้าน',
        imageUrl: 'brand/gift-hero-banner.png',
        secretNote:
          'ไม่ได้สวยอลังการ ไม่มีเหตุการณ์ใหญ่ แค่ได้อยู่ข้างกันหลังวันเหนื่อย ๆ ก็พอทำให้โลกเบาลงแล้ว',
      },
      {
        id: '5',
        date: 'วันแฮปปี้',
        caption: 'มุมห้อง · ที่นั่งโปรด',
        imageUrl: 'love/mochi-cat.png',
        secretNote:
          'บางวันไม่ต้องพูดอะไรเลย แค่หัวเราะเพราะเรื่องเล็ก ๆ ก็รู้สึกว่าบ้านนี้มีเธอจริง ๆ',
      },
      {
        id: '6',
        date: 'ของขวัญเล็ก ๆ',
        caption: 'โต๊ะทำงาน · กล่องใบนั้น',
        imageUrl: 'brand/gift-box-a.png',
        secretNote:
          'ของไม่ได้แพง แต่ฉันคิดถึงเธอทุกขั้นตั้งแต่เลือกรibbon จนผูกโบว์ — อยากให้รู้ว่าคิดถึงจริง',
      },
      {
        id: '7',
        date: 'วันที่เปิดใจ',
        caption: 'สวนสาธารณะ · ม้านั่งใต้ต้นไม้',
        imageUrl: 'love/calico-cat.png',
        secretNote:
          'พูดเรื่องที่เก็บมานานด้วยเสียงสั่น แต่เธอฟังจนจบ ช่วงนั้นฉันขอบคุณมากจนพูดไม่ออก',
      },
      {
        id: '8',
        date: 'วันอุ่น ๆ',
        caption: 'บ้าน · โต๊ะกินข้าว',
        imageUrl: 'brand/gift-box-b.png',
        secretNote:
          'กลิ่นข้าว เสียงช้อนจาน และการได้มองหน้าเธอตอนกิน — ความสุขแบบเรียบง่ายที่อยากมีต่อไป',
      },
      {
        id: '9',
        date: 'วันที่คิดถึง',
        caption: 'ทุ่งหญ้า · ฟ้าหลังฝน',
        imageUrl: 'love/quiz-meadow.png',
        secretNote:
          'ลมผ่านแล้วคิดถึงเธอทันที ถึงอยู่คนเดียวก็ยังรู้สึกอุ่น เพราะรู้ว่ามีที่กลับไปในใจ',
      },
      {
        id: '10',
        date: 'วันนี้',
        caption: 'ตรงนี้ · ที่เรายืนด้วยกัน',
        imageUrl: 'love/couple-demo.png',
        secretNote:
          'ยังเลือกเธออยู่ในทุกเช้า และยังอยากเลือกต่อไปในทุกพรุ่งนี้ — ถึงหน้าสุดท้ายของสมุด เรื่องของเรายังไม่จบ',
      },
    ],
  },
  birthday: { headline: 'สุขสันต์วันเกิด', message: 'ขอให้ปีนี้เต็มไปด้วยรอยยิ้ม', photos: [] },
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
