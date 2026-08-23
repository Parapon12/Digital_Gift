-- Seed birthday demo (upsert-safe via app seed; this helps existing DBs)

INSERT INTO demo_content (demo_slug, template_key, title, recipient_name, sender_name, content)
VALUES (
  'birthday',
  'birthday',
  'วันเกิด (ตัวอย่าง)',
  'เธอ',
  'ฉัน',
  '{
    "countdownMessage": "สุขสันต์วันเกิด\nเธอ",
    "floatPhotos": [
      "birthday/part1/01.png","birthday/part1/02.png","birthday/part1/01.png","birthday/part1/02.png",
      "birthday/part1/01.png","birthday/part1/02.png","birthday/part1/01.png","birthday/part1/02.png",
      "birthday/part1/01.png","birthday/part1/02.png","birthday/part1/01.png","birthday/part1/02.png"
    ],
    "bookPhotos": [
      "birthday/book/01.jpg","birthday/book/02.jpg","birthday/book/03.jpg",
      "birthday/book/04.png","birthday/book/05.png","birthday/book/06.png",
      "birthday/book/07.png","birthday/book/08.png","birthday/book/09.png",
      "birthday/book/10.png"
    ],
    "blessingSpread1": "สุขสันต์วันเกิดนะ — ขอให้วันนี้เต็มไปด้วยรอยยิ้มและความสุข",
    "blessingSpread3": "ขอบคุณที่เข้ามาเป็นแสงสว่างในทุกวันที่ผ่านมา",
    "blessingSpread5": "จากนี้ไป… ขอให้ทุกวันมีความหมายและอบอุ่นเหมือนเดิมเสมอ",
    "coverMessage": "แค่เธอคนพิเศษของฉัน"
  }'::jsonb
)
ON CONFLICT (demo_slug) DO NOTHING;
