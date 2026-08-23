export const BLESSING_SUBTITLE = 'แด่เธอคนสำคัญในหัวใจ'
export const BLESSING_INTRO = 'แตะที่พุงเสือ เพื่อเปิดคำอวยพรถึงเธอ'
export const BLESSING_ARTICLE =
  'ถึงเธอคนสำคัญ ขอให้ทุกวันมีรอยยิ้ม สุขภาพแข็งแรง และมีเรื่องดี ๆ เข้ามาหาแบบไม่ทันตั้งตัว ขอให้เธอปลอดภัย ใจสบาย และรู้ไว้ว่ามีคนที่รัก ห่วง และอวยพรเธออยู่ตรงนี้เสมอนะ'
export const BLESSING_CLOSING = 'รักเธอนะ คนสำคัญ ขอให้เราได้เป็นกำลังใจให้กันอีกนาน ๆ'
export const TIGER_PHOTO = 'tiger/tiger.png'
export const TRIBUTE_FIRST = 'รักเธอ'
export const TRIBUTE_SECOND = 'คนสำคัญ'

const PLACEHOLDER_PHOTOS = new Set([
  'love/couple-demo.png',
  'love/memory-10-home.jpg',
  'love/memory-08-sunset.jpg',
])

export function blessingPhoto(value: string | undefined, fallback = TIGER_PHOTO) {
  const v = (value || '').trim()
  if (!v || PLACEHOLDER_PHOTOS.has(v)) return fallback
  return v
}

export function defaultCrocodileBlessingContent() {
  return {
    eyebrow: 'ของขวัญจากใจ',
    title: 'กราดพุงเสืออวยพร',
    subtitle: BLESSING_SUBTITLE,
    intro: BLESSING_INTRO,
    hint: '👆 แตะพุงเสือเลย',
    photo1: TIGER_PHOTO,
    text1: BLESSING_ARTICLE,
    photo2: TIGER_PHOTO,
    photo3: TIGER_PHOTO,
    closing: BLESSING_CLOSING,
  }
}

const LEGACY_COPY: Record<string, string> = {
  'ปากจระเข้แห่งคำอวยพร': 'กราดพุงเสืออวยพร',
  'เสือแห่งคำอวยพร': 'กราดพุงเสืออวยพร',
  'พุงเสือคำอวยพร': 'กราดพุงเสืออวยพร',
  'แตะที่จระเข้ เพื่อเปิดปากดูของขวัญข้างใน!': BLESSING_INTRO,
  'แตะที่เสือ เพื่อดูของขวัญบนพุงกลม ๆ!': BLESSING_INTRO,
  'แตะที่พุงเสือ เพื่อเปิดกรอบของขวัญ': BLESSING_INTRO,
  'แตะที่พุงเสือ เพื่อเปิดกราดพุงเสืออวยพร': BLESSING_INTRO,
  '👆 แตะจระเข้เลย': '👆 แตะพุงเสือเลย',
  '👆 แตะเสือเลย': '👆 แตะพุงเสือเลย',
  'ความเชื่อ ศรัทธา และพลังแห่งการปกป้องคุ้มครอง': BLESSING_SUBTITLE,
  'วันนี้ก็เก่งมากแล้วนะ ภูมิใจในตัวเธอสุดๆ': BLESSING_ARTICLE,
  'วันนี้ก็เก่งมากแล้วนะ ภูมิใจในตัวเธอสุด ๆ': BLESSING_ARTICLE,
  'กราดพุงเสืออวยพร คือความเชื่อดั้งเดิมของชาวบ้าน เชื่อกันว่ามีเสือศักดิ์สิทธิ์คอยปกป้องคุ้มครองชุมชนให้ปลอดภัยจากภยันตราย และนำโชคลาภมาสู่ผู้มีศรัทธา':
    BLESSING_ARTICLE,
  'กราดพุงเสืออวยพร คือความเชื่อดั้งเดิมของชาวบ้าน เชื่อกันว่ามีเสือศักดิ์สิทธิ์คอยปกป้องคุ้มครองชุมชนให้ปลอดภัยจากภยันตราย และนำโชคลาภมาสู่ผู้มีศรัทธา ผู้ที่มากราดด้วยใจบริสุทธิ์จะได้รับการคุ้มครอง เมตตามหานิยม และความเจริญในชีวิต':
    BLESSING_ARTICLE,
  'รักเธอนะ เสมอนะ': BLESSING_CLOSING,
  'ศรัทธา คือพลังแห่งใจ เชื่อมั่นในสิ่งดี ๆ แล้วชีวิตจะพบเจอแต่ความเจริญและความสุข': BLESSING_CLOSING,
  'ถึงเธอคนสำคัญของฉัน ขอให้ทุกวันมีรอยยิ้ม สุขภาพแข็งแรง และมีเรื่องดี ๆ เข้ามาหาแบบไม่ทันตั้งตัว ขอให้เธอปลอดภัย ใจสบาย และรู้ไว้ว่ามีคนที่รัก ห่วง และอวยพรเธออยู่ตรงนี้เสมอนะ':
    BLESSING_ARTICLE,
  'รักเธอนะ คนสำคัญของฉัน ขอให้เราได้เป็นกำลังใจให้กันอีกนาน ๆ': BLESSING_CLOSING,
}

export function displayBlessingCopy(value: string | undefined, fallback: string) {
  const v = (value || '').trim()
  if (!v) return fallback
  return LEGACY_COPY[v] || v
}
