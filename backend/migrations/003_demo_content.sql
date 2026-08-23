-- Editable demo / example pages (separate from customer gifts)

CREATE TABLE IF NOT EXISTS demo_content (
    demo_slug       VARCHAR(50) PRIMARY KEY,
    template_key    VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL DEFAULT '',
    recipient_name  VARCHAR(200) NOT NULL DEFAULT 'เธอ',
    sender_name     VARCHAR(200) NOT NULL DEFAULT 'ฉัน',
    content         JSONB NOT NULL DEFAULT '{}',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demo_content_template_key ON demo_content(template_key);
