UPDATE demo_content
SET
  content = jsonb_set(
    jsonb_set(
      jsonb_set(content, '{photo1}', '"tiger/tiger.png"'),
      '{photo2}', '"tiger/tiger.png"'
    ),
    '{photo3}', '"tiger/tiger.png"'
  )
WHERE demo_slug = 'crocodile-blessing';
