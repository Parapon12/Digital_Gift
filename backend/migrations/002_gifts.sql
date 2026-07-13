-- GiftLove gift platform (admin-created gifts, no customer order flow)

CREATE TABLE IF NOT EXISTS gifts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_id       VARCHAR(12) UNIQUE NOT NULL,
    template_key    VARCHAR(50) NOT NULL,
    title           VARCHAR(200) NOT NULL DEFAULT '',
    recipient_name  VARCHAR(200) NOT NULL DEFAULT '',
    sender_name     VARCHAR(200) NOT NULL DEFAULT '',
    content         JSONB NOT NULL DEFAULT '{}',
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gifts_public_id ON gifts(public_id);
CREATE INDEX IF NOT EXISTS idx_gifts_template_key ON gifts(template_key);
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts(created_at DESC);

CREATE TABLE IF NOT EXISTS schema_migrations (
    name        VARCHAR(100) PRIMARY KEY,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
