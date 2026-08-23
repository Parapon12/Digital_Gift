UPDATE demo_content
SET
  title = 'พุงเสือคำอวยพร (ตัวอย่าง)',
  content = jsonb_set(content, '{title}', '"พุงเสือคำอวยพร"')
WHERE demo_slug = 'crocodile-blessing';
