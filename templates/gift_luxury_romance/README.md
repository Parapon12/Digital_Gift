# GiftLove — Luxury Romance Gift Template

เทมเพลตเว็บไซต์ของขวัญดิจิทัลแบบ Interactive อิงธีม `theme_1_luxury_romance_warm.html`

## ฟีเจอร์

1. **เปิดกล่องของขวัญ** — แอนิเมชันกล่องของขวัญก่อนเข้าสู่เนื้อหา
2. **ข้อความอวยพร** — การ์ดข้อความพร้อมชื่อผู้ส่ง
3. **แกลเลอรีรูปภาพ** — สไลด์รูปความทรงจำ
4. **Finale** — หน้าปิดท้ายพร้อมเพลงและวิดีโอ

## วิธีใช้งาน

1. แก้ไข `gift-data.js` ตามข้อมูลลูกค้า
2. เพิ่มรูปภาพในโฟลเดอร์ `assets/` แล้วอ้างอิงใน `photos[]`
3. เปิด `index.html` ในเบราว์เซอร์เพื่อทดสอบ
4. Deploy บน Vercel หรือ Render (static site)
5. อัปเดต `deployed_url` ใน Admin Dashboard

## ตัวอย่าง photos

```js
photos: [
  'assets/photo1.jpg',
  'assets/photo2.jpg',
  'assets/photo3.jpg',
],
```

## Deploy บน Vercel

```bash
cd templates/gift_luxury_romance
npx vercel --prod
```

## โครงสร้าง

```
gift_luxury_romance/
├── index.html      # หน้าหลัก
├── style.css       # สไตล์ธีม luxury warm
├── gift-data.js    # ข้อมูลลูกค้า (แก้ไขไฟล์นี้)
├── app.js          # Logic interactive
├── assets/         # รูปภาพและไฟล์มีเดีย
└── README.md
```
