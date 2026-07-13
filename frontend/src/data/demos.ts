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
