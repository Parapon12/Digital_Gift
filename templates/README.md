# GiftLove — Gift Templates

เทมเพลตเว็บไซต์ของขวัญดิจิทัลแบบ Interactive สำหรับ Deploy แยกต่อออเดอร์

| Template | ประเภท | ลูกเล่นเปิดต้น | โทนสี |
|----------|--------|---------------|-------|
| `gift_luxury_romance` | วันครบรอบ / ความรัก | เปิดกล่องของขวัญ | ทอง-ส้ม บนพื้นเข้ม |
| `gift_birthday` | วันเกิด | เป่าเทียนเค้ก + confetti | ชมพู-ทอง |
| `gift_graduation` | รับปริญญา | โยนหมวกบัณฑิต | น้ำเงิน-ทอง |
| `gift_surprise` | เซอร์ไพรส์ | เปิดซองจดหมาย | ม่วง-ชมพู |

## วิธีใช้

1. เลือกเทมเพลตตามประเภทของขวัญ
2. แก้ไข `gift-data.js` ตามข้อมูลลูกค้า
3. ใส่รูปใน `assets/` แล้วอ้างอิงใน `photos[]`
4. เปิด `index.html` ทดสอบ
5. Deploy บน Vercel: `npx vercel --prod`
6. อัปเดต URL ใน Admin Dashboard

## โครงสร้างแต่ละเทมเพลต

```
gift_xxx/
├── index.html
├── style.css
├── gift-data.js   ← แก้ไขไฟล์นี้
├── app.js
└── assets/        ← รูปภาพลูกค้า
```
