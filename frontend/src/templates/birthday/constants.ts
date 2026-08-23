/** ส่วนที่ 1 — รูปลอยตอน Happy birthday (public/birthday/part1) */
export const DEFAULT_PART1_PHOTOS = Array.from({ length: 12 }, (_, i) => {
  const n = (i % 2) + 1
  return `birthday/part1/${String(n).padStart(2, '0')}.png`
})

/** รูปในสมุด (public/birthday/book) */
export const DEFAULT_BOOK_PHOTOS = [
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
] as const

export const DEFAULT_BLESSINGS = {
  spread1: 'สุขสันต์วันเกิดนะ — ขอให้วันนี้เต็มไปด้วยรอยยิ้มและความสุข',
  spread3: 'ขอบคุณที่เข้ามาเป็นแสงสว่างในทุกวันที่ผ่านมา',
  spread5: 'จากนี้ไป… ขอให้ทุกวันมีความหมายและอบอุ่นเหมือนเดิมเสมอ',
} as const

export const DEFAULT_LEFT_BODIES = {
  spread1: 'ขอให้วันนี้... และทุกๆ วัน เป็นวันที่ดีของเธอเสมอ มีความสุขมากๆ นะคนเก่งของฉัน',
  spread3: 'ขอบคุณที่อยู่เคียงข้างกันเสมอมา ขอให้ทุกวันของเธอเต็มไปด้วยรอยยิ้มและความอบอุ่น',
  spread5: 'จากนี้ไป… ไม่ว่าจะไปที่ไหน ขอให้มีความสุขและรู้ว่ามีคนที่รักเธอเสมอ',
} as const

export const DEFAULT_BOOK_LEFT_SUBTITLE = 'แด่เธอคนพิเศษของฉัน'

export const DEFAULT_BOOK_CAPTIONS = [
  '',
  'ขอให้สดใสเหมือนดอกไม้ช่อนี้นะ :)',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
] as const
