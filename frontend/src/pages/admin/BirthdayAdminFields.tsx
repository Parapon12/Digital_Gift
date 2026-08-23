import { AdminMediaField } from '../../components/AdminMediaField'
import { AdminSection } from '../../components/AdminSection'
import type { BirthdayContent } from '../../types'

export function BirthdayAdminFields({
  value,
  onChange,
}: {
  value: BirthdayContent
  onChange: (next: BirthdayContent) => void
}) {
  const set = (patch: Partial<BirthdayContent>) => onChange({ ...value, ...patch })

  const floatPhotos = value.floatPhotos?.length === 12 ? value.floatPhotos : Array.from({ length: 12 }, (_, i) => value.floatPhotos?.[i] || '')
  const bookPhotos = value.bookPhotos?.length === 10 ? value.bookPhotos : Array.from({ length: 10 }, (_, i) => value.bookPhotos?.[i] || '')
  const captions = value.bookPhotoCaptions?.length === 10 ? value.bookPhotoCaptions : Array.from({ length: 10 }, (_, i) => value.bookPhotoCaptions?.[i] || '')

  return (
    <div className="mp-admin">
      <AdminSection step={1} title="ฝนหัวใจ + นับถอยหลัง" scene="พื้นดำ · หัวใจชมพูตกเป็นสาย · ตัวเลข 3→2→1 ใหญ่มีแสง (ไม่มีข้อความ)">
        {null}
      </AdminSection>

      <AdminSection step={2} title="Happy birthday + รูปลอย" scene="โฟลเดอร์ birthday/part1 · 12 ช่องมุมบนซ้าย–ขวา">
        {floatPhotos.map((url, i) => (
          <div key={`float-${i}`} className="mp-admin-entry">
            <strong>รูปลอยที่ {i + 1}</strong>
            <AdminMediaField
              label="รูป"
              value={url}
              onChange={(next) => {
                const list = floatPhotos.map((p, j) => (j === i ? next : p))
                set({ floatPhotos: list })
              }}
            />
          </div>
        ))}
      </AdminSection>

      <AdminSection step={3} title="ปกสมุด — ก่อนเปิดดูรูป" scene="Happy Birthday · ปุ่มเปิดดูสมุด · ชื่อใช้จากผู้รับ/ผู้ส่ง">
        <div className="form-group">
          <label>ข้อความบนปก (ใต้ Happy Birthday)</label>
          <input
            value={value.coverMessage || ''}
            onChange={(e) => set({ coverMessage: e.target.value })}
            placeholder="แค่เธอคนพิเศษของฉัน"
          />
        </div>
      </AdminSection>

      <AdminSection step={4} title="สมุดรูป 5 หน้าคู่" scene="10 รูป · หน้า 1/3/5 ซ้ายเป็นข้อความ · หน้า 2/4 เป็นภาพทั้งคู่">
        {bookPhotos.map((url, i) => (
          <div key={`book-${i}`} className="mp-admin-entry">
            <strong>
              รูปสมุดที่ {i + 1} (หน้า {Math.floor(i / 2) + 1}
              {i % 2 === 0 ? ' — ขวา/ซ้าย' : ' — ขวา'})
            </strong>
            <AdminMediaField
              label="รูป"
              value={url}
              onChange={(next) => {
                const list = bookPhotos.map((p, j) => (j === i ? next : p))
                set({ bookPhotos: list })
              }}
            />
            <div className="form-group">
              <label>คำบรรยายใต้รูป (ถ้ามี)</label>
              <input
                value={captions[i] || ''}
                onChange={(e) => {
                  const list = captions.map((c, j) => (j === i ? e.target.value : c))
                  set({ bookPhotoCaptions: list })
                }}
                placeholder="ขอให้สดใสเหมือนดอกไม้ช่อนี้นะ :)"
              />
            </div>
          </div>
        ))}
      </AdminSection>

      <AdminSection step={5} title="คำอวยพรบนสมุด" scene="หน้า 1 · 3 · 5 — ข้อความเหนือสมุด + ข้อความยาวหน้าซ้าย">
        <div className="form-group">
          <label>หัวข้อย่อยหน้าข้อความ (ใต้ Happy Birthday)</label>
          <input
            value={value.bookLeftSubtitle || ''}
            onChange={(e) => set({ bookLeftSubtitle: e.target.value })}
            placeholder="แด่เธอคนพิเศษของฉัน"
          />
        </div>
        <div className="form-group">
          <label>หน้า 1 — ข้อความเหนือสมุด</label>
          <textarea rows={2} value={value.blessingSpread1 || ''} onChange={(e) => set({ blessingSpread1: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หน้า 1 — ข้อความยาวหน้าซ้าย</label>
          <textarea rows={3} value={value.bookLeftBody1 || ''} onChange={(e) => set({ bookLeftBody1: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หน้า 3 — ข้อความเหนือสมุด</label>
          <textarea rows={2} value={value.blessingSpread3 || ''} onChange={(e) => set({ blessingSpread3: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หน้า 3 — ข้อความยาวหน้าซ้าย</label>
          <textarea rows={3} value={value.bookLeftBody3 || ''} onChange={(e) => set({ bookLeftBody3: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หน้า 5 — ข้อความเหนือสมุด</label>
          <textarea rows={2} value={value.blessingSpread5 || ''} onChange={(e) => set({ blessingSpread5: e.target.value })} />
        </div>
        <div className="form-group">
          <label>หน้า 5 — ข้อความยาวหน้าซ้าย</label>
          <textarea rows={3} value={value.bookLeftBody5 || ''} onChange={(e) => set({ bookLeftBody5: e.target.value })} />
        </div>
      </AdminSection>
    </div>
  )
}
