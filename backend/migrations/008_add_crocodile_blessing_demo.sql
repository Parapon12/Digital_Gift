-- Seed crocodile blessing demo (upsert-safe; app seed also inserts missing slugs)

INSERT INTO demo_content (demo_slug, template_key, title, recipient_name, sender_name, content)
VALUES (
  'crocodile-blessing',
  'crocodile_blessing',
  'ปากจระเข้แห่งคำอวยพร (ตัวอย่าง)',
  'เธอ',
  'ฉัน',
  '{
    "eyebrow": "ของขวัญจากใจ",
    "title": "ปากจระเข้แห่งคำอวยพร",
    "intro": "แตะที่จระเข้ เพื่อเปิดปากดูของขวัญข้างใน!",
    "hint": "👆 แตะจระเข้เลย",
    "completeMessage": "🎉 ครบทุกซี่แล้ว จ้า!",
    "blessings": [
      {"icon": "🌟", "text": "วันนี้ก็เก่งมากแล้วนะ ภูมิใจในตัวเธอสุดๆ"},
      {"icon": "🍀", "text": "ขอให้เรื่องดีๆ วิ่งเข้ามาหาแบบไม่ทันตั้งตัว"},
      {"icon": "🤗", "text": "เหนื่อยเมื่อไหร่ ให้นึกไว้ว่ามีคนเป็นห่วงอยู่เสมอนะ"},
      {"icon": "🍫", "text": "ของหวานแทนคำขอบคุณ ที่เธอเป็นเธอแบบนี้แหละ"},
      {"icon": "😂", "text": "รู้ไหมว่าจระเข้แลบลิ้นไม่ได้ เหมือนที่เธอหยุดน่ารักไม่ได้เลย"},
      {"icon": "💪", "text": "เรื่องยากแค่ไหนก็ผ่านมาตั้งหลายรอบแล้ว รอบนี้ก็ต้องผ่านเหมือนกัน"},
      {"icon": "🎁", "text": "ของขวัญที่ดีที่สุด คือตอนนี้ที่มีเธออ่านข้อความนี้อยู่"},
      {"icon": "✨", "text": "ขอให้ทุกวันของเธอ มีเรื่องให้ยิ้มอย่างน้อยวันละครั้ง"}
    ]
  }'::jsonb
)
ON CONFLICT (demo_slug) DO NOTHING;
