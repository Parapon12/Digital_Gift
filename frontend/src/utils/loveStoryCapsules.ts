import type { LoveCapsule } from '../types'

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

export function buildMonthlyCapsules(count = 12, messages = DEMO_CAPSULE_MESSAGES): LoveCapsule[] {
  return Array.from({ length: count }, (_, i) => {
    const month = i + 1
    return {
      id: `month-${month}`,
      title: `ข้อความเดือนที่ ${month}`,
      unlockRule: 'months' as const,
      unlockValue: month,
      text: messages[i] || `ข้อความลับเดือนที่ ${month}`,
    }
  })
}

export const DEFAULT_MONTHLY_CAPSULES = buildMonthlyCapsules()
