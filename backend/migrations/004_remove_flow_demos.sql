-- Flow steps (love-letter, love-arrow, memory-story) are not standalone homepage demos.

DELETE FROM demo_content
WHERE demo_slug IN ('love-letter', 'love-arrow', 'memory-story');
