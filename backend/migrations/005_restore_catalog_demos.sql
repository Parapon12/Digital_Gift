-- Restore flow demos removed by 004 (app seed also upserts missing rows on startup)

INSERT INTO demo_content (demo_slug, template_key, title, recipient_name, sender_name, content)
VALUES
  ('love-letter', 'love_letter', 'จดหมายรัก (ตัวอย่าง)', 'เธอ', 'ฉัน', '{"nextSlug":"love-arrow"}'::jsonb),
  ('love-arrow', 'love_arrow', 'คupid ยิงลูกศร (ตัวอย่าง)', 'เธอ', 'ฉัน', '{"loveMessage":"รักเธอมากที่สุดในโลก — ทุกวัน ทุกนาที ทุกลมหายใจ","nextSlug":"memory-story"}'::jsonb),
  ('memory-story', 'memory_story', 'เรื่องราวความทรงจำ (ตัวอย่าง)', 'เธอ', 'ฉัน', '{"memoryPhotos":["love/couple-demo.png","love/memory-10-home.jpg","love/memory-09-forest.jpg","love/memory-07-city.jpg"],"galleryPhotos":["love/memory-06-beach.jpg","love/memory-08-sunset.jpg","love/memory-05-cafe.jpg","love/adventure-scene-landscape.png","love/heart-tree.png","love/memory-04-park.jpg"],"endingWord":"I love you"}'::jsonb)
ON CONFLICT (demo_slug) DO NOTHING;
