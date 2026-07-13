-- GiftLove Platform Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE order_status AS ENUM (
    'pending',
    'paid',
    'in_progress',
    'review',
    'completed',
    'delivered',
    'cancelled'
);

CREATE TYPE payment_status AS ENUM (
    'unpaid',
    'pending_verification',
    'paid',
    'refunded'
);

CREATE TYPE gift_category AS ENUM (
    'anniversary',
    'birthday',
    'surprise',
    'graduation',
    'congratulations'
);

CREATE TABLE packages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug        VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    name_th     VARCHAR(100) NOT NULL,
    description TEXT,
    description_th TEXT,
    price       DECIMAL(10,2) NOT NULL,
    features    JSONB DEFAULT '[]',
    features_th JSONB DEFAULT '[]',
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE portfolio_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(200) NOT NULL,
    title_th    VARCHAR(200),
    description TEXT,
    category    gift_category NOT NULL,
    image_url   TEXT,
    demo_url    TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number    VARCHAR(20) UNIQUE NOT NULL,
    customer_name   VARCHAR(200) NOT NULL,
    customer_email  VARCHAR(200) NOT NULL,
    customer_phone  VARCHAR(50),
    recipient_name  VARCHAR(200),
    gift_category   gift_category NOT NULL,
    package_id      UUID REFERENCES packages(id),
    special_date    DATE,
    message         TEXT,
    additional_notes TEXT,
    music_url       TEXT,
    video_url       TEXT,
    status          order_status DEFAULT 'pending',
    payment_status  payment_status DEFAULT 'unpaid',
    payment_ref     VARCHAR(100),
    total_amount    DECIMAL(10,2) NOT NULL,
    deployed_url    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_files (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_type   VARCHAR(20) NOT NULL,
    file_name   VARCHAR(255) NOT NULL,
    file_url    TEXT NOT NULL,
    file_size   BIGINT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(200) NOT NULL,
    email       VARCHAR(200) NOT NULL,
    subject     VARCHAR(300),
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_files_order_id ON order_files(order_id);

-- Seed packages
INSERT INTO packages (slug, name, name_th, description, description_th, price, features, features_th, sort_order) VALUES
('essential', 'Essential', 'แพ็กเกจพื้นฐาน',
 'A beautiful personalized gift website with core features.',
 'เว็บไซต์ของขวัญส่วนตัวพร้อมฟีเจอร์หลัก',
 990.00,
 '["Custom design", "Up to 5 photos", "Background music", "1 revision"]',
 '["ออกแบบเฉพาะบุคคล", "รูปภาพสูงสุด 5 รูป", "เพลงประกอบ", "แก้ไข 1 ครั้ง"]',
 1),
('premium', 'Premium', 'แพ็กเกจพรีเมียม',
 'Enhanced experience with animations and video support.',
 'ประสบการณ์พิเศษพร้อมแอนิเมชันและวิดีโอ',
 1990.00,
 '["Everything in Essential", "Up to 15 photos", "Video integration", "Interactive animations", "2 revisions"]',
 '["ทุกอย่างในแพ็กเกจพื้นฐาน", "รูปภาพสูงสุด 15 รูป", "รองรับวิดีโอ", "แอนิเมชันอินเทอร์แอคทีฟ", "แก้ไข 2 ครั้ง"]',
 2),
('luxury', 'Luxury', 'แพ็กเกจลักซ์ชูรี่',
 'The ultimate digital gift experience with premium effects.',
 'ประสบการณ์ของขวัญดิจิทัลระดับพรีเมียมสุด',
 3490.00,
 '["Everything in Premium", "Unlimited photos", "Custom animations", "Gift box reveal", "Priority delivery", "Unlimited revisions"]',
 '["ทุกอย่างในแพ็กเกจพรีเมียม", "รูปภาพไม่จำกัด", "แอนิเมชันตามสั่ง", "เปิดกล่องของขวัญ", "จัดส่งด่วน", "แก้ไขไม่จำกัด"]',
 3);

-- Seed portfolio
INSERT INTO portfolio_items (title, title_th, description, category, image_url, is_featured, sort_order) VALUES
('Anniversary Love Story', 'เรื่องราวความรักครบรอบ', 'A romantic journey through years of love', 'anniversary', '/portfolio/anniversary.jpg', TRUE, 1),
('Birthday Surprise Box', 'กล่องเซอร์ไพรส์วันเกิด', 'Interactive gift box reveal for a special birthday', 'birthday', '/portfolio/birthday.jpg', TRUE, 2),
('Graduation Celebration', 'ฉลองรับปริญญา', 'Proud moments captured in a digital tribute', 'graduation', '/portfolio/graduation.jpg', TRUE, 3);
