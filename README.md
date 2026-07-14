# GiftLove — Personalized Digital Gift Platform

แพลตฟอร์มของขวัญดิจิทัลเฉพาะบุคคล — ลูกค้าดูตัวอย่างแล้วสั่งผ่าน LINE ส่วนแอดมินสร้างของขวัญจากเทมเพลตแล้วส่งลิงก์ให้

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Three.js |
| Backend | Go (chi) + JWT |
| Database | PostgreSQL |
| Hosting | Render.com |

## Customer site

- `/` — แนะนำบริการ + ตัวอย่างเทมเพลต + ปุ่ม LINE
- `/demo/:slug` — ตัวอย่างเทมเพลต
- `/gift/:id` — ของขวัญจริงจากฐานข้อมูล

ไม่มีระบบให้ลูกค้าสร้าง/แก้ไขของขวัญเอง

## Templates

| Key | ชื่อ | สถานะ |
|-----|------|--------|
| `love_adventure_3d` | 3D Love Adventure | ครบ |
| `love_story` | Love Story | ครบ |
| `love_quiz` | Love Quiz | ครบ |
| `memory_page` | Memory Page (scrapbook) | ครบ |
| `birthday` | วันเกิด | โครง 3D |
| `graduation` | รับปริญญา | โครง 3D |
| `proposal` | ขอแต่งงาน | โครง 3D |

## Admin

- `/admin/login` — JWT (อีเมล + รหัสผ่าน)
- สร้าง / แก้ / ลบ ของขวัญ
- เลือกเทมเพลต (ล็อกโครงหลังสร้าง)
- กรอกชื่อ ข้อความ รูป (URL ใน JSON)
- ส่งมอบ: ลิงก์ + QR + คัดลอก + เปิดดู

Default login (dev):

- Email: `admin@giftlove.studio`
- Password: `giftlove-admin`

## API

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/site` | public |
| GET | `/api/templates` | public |
| GET | `/api/demos/:slug` | public |
| GET | `/api/gifts/:publicId` | public |
| POST | `/api/admin/login` | public |
| GET/POST | `/api/admin/gifts` | JWT |
| GET/PUT/DELETE | `/api/admin/gifts/:id` | JWT |

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
go run ./cmd/server

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8080
- Admin: http://localhost:5173/admin/login

## Workflow

```
ลูกค้าดูหน้าแรก / demo → สั่งผ่าน LINE
→ แอดมินสร้างของขวัญใน Admin → ส่งลิงก์ /gift/[id] (+ QR)
→ ผู้รับเปิดลิงก์
```
