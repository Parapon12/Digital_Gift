UPDATE demo_content
SET
  title = 'เสือแห่งคำอวยพร (ตัวอย่าง)',
  content = '{
    "eyebrow": "ของขวัญจากใจ",
    "title": "เสือแห่งคำอวยพร",
    "intro": "แตะที่พุงเสือ เพื่อเปิดกรอบของขวัญ",
    "hint": "👆 แตะพุงเสือเลย",
    "photo1": "love/couple-demo.png",
    "text1": "วันนี้ก็เก่งมากแล้วนะ ภูมิใจในตัวเธอสุด ๆ",
    "photo2": "love/memory-10-home.jpg",
    "text2": "ขอบคุณที่เป็นเธอแบบนี้ — ทุกวันที่มีเธอเลยอบอุ่นกว่าเดิม",
    "photo3": "love/memory-08-sunset.jpg",
    "closing": "รักเธอนะ เสมอนะ"
  }'::jsonb
WHERE demo_slug = 'crocodile-blessing';
