import type { LoveCapsule, LoveStoryMemory } from '../types'

const DEMO_CAPSULE_MESSAGES = [
  'เดือนแรกของเรา… ขอบคุณที่เข้ามาเป็นความสุขในทุกวัน',
  'สองเดือนแล้วนะ ยังชอบเธอเหมือนเดิมทุกวัน',
  'สามเดือนผ่านไป ยิ่งรู้สึกว่าเธอคือคนที่อยากเลือก',
  'สี่เดือนแล้ว ขอบคุณที่อดทนกับฉันเสมอ',
  'ห้าเดือนแล้ว ยังอยากเดินต่อไปด้วยกัน',
  'ครึ่งปีแล้วนะ ขอบคุณที่อยู่ด้วยกัน',
  'เจ็ดเดือนแล้ว ทุกวันที่มีเธอคือวันที่ดี',
  'แปดเดือนแล้ว รักเธอมากกว่าเดิมทุกวัน',
  'เก้าเดือนแล้ว ยังคิดถึงเธอเหมือนเดิม',
  'สิบเดือนแล้ว ขอบคุณที่ยังเลือกกัน',
  'สิบเอ็ดเดือนแล้ว ใกล้ครบปีแล้วนะ',
  'หนึ่งปีของเรา… ยังอยากเดินต่อไปด้วยกัน',
]

export const DEMO_CAPSULE_IMAGES = [
  'love/couple-demo.png',
  'love/memory-06-beach.jpg',
  'love/memory-05-cafe.jpg',
  'love/memory-10-home.jpg',
  'love/memory-04-park.jpg',
  'love/memory-08-sunset.jpg',
  'love/memory-07-city.jpg',
  'love/memory-09-forest.jpg',
  'love/couple-demo.png',
  'love/memory-06-beach.jpg',
  'love/memory-08-sunset.jpg',
  'love/memory-09-forest.jpg',
]

export const DEMO_LOVE_MEMORIES: LoveStoryMemory[] = [
  {
    title: 'ทะเลครั้งแรก',
    text: 'วันแรกที่ไปเที่ยวทะเลด้วยกัน 🌊',
    caption: 'ชายหาด · น้ำใสฟ้าเปิด',
    imageUrl: 'love/memory-06-beach.jpg',
  },
  {
    title: 'ชาบูครั้งแรก',
    text: 'ร้านชาบูครั้งแรก 🍲',
    caption: 'คาเฟ่เงียบ · แก้วร้อน ๆ',
    imageUrl: 'love/memory-05-cafe.jpg',
  },
  {
    title: 'วันเกิดปีแรก',
    text: 'วันเกิดปีแรกที่ฉลองด้วยกัน 🎂',
    caption: 'บ้าน · มุมอุ่น ๆ',
    imageUrl: 'love/memory-10-home.jpg',
  },
  {
    title: 'เดินในสวน',
    text: 'เช้าวันว่างที่เดินมือกันในสวน 🌳',
    caption: 'ป่าเล็ก ๆ · ทางเดินใต้ต้นไม้',
    imageUrl: 'love/memory-04-park.jpg',
  },
  {
    title: 'ค่ำเมืองใหญ่',
    text: 'เดินคู่กันในเมืองที่วุ่นวาย 🌃',
    caption: 'ถนนกลางคืน · ไฟเมือง',
    imageUrl: 'love/memory-07-city.jpg',
  },
  {
    title: 'เย็นสีส้ม',
    text: 'ฟ้าเปลี่ยนสีช้า ๆ เหมือนช่วงที่เราเริ่มคุยกันมากขึ้น 🌅',
    caption: 'ขอบฟ้า · แสงก่อนค่ำ',
    imageUrl: 'love/memory-08-sunset.jpg',
  },
]

export function buildMonthlyCapsules(
  count = 12,
  messages = DEMO_CAPSULE_MESSAGES,
  imageUrls = DEMO_CAPSULE_IMAGES,
): LoveCapsule[] {
  return Array.from({ length: count }, (_, i) => {
    const month = i + 1
    return {
      id: `month-${month}`,
      title: `ข้อความเดือนที่ ${month}`,
      unlockRule: 'months' as const,
      unlockValue: month,
      text: messages[i] || `ข้อความลับเดือนที่ ${month}`,
      imageUrl: imageUrls[i % imageUrls.length],
    }
  })
}

export const DEFAULT_MONTHLY_CAPSULES = buildMonthlyCapsules()
