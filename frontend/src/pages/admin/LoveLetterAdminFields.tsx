import { AdminSection } from '../../components/AdminSection'
import type { LoveLetterContent } from '../../types'

export function LoveLetterAdminFields({
  value,
  onChange,
}: {
  value: LoveLetterContent
  onChange: (next: LoveLetterContent) => void
}) {
  return (
    <div className="mp-admin">
      <AdminSection
        step={1}
        title="ซองจดหมายรัก"
        scene="Envelope intro — แตะตราประทับเปิด"
        help="ซองและแอนิเมชันเป็นค่าเริ่มต้น — ชื่อผู้รับ/ผู้ส่งใช้จากช่องด้านบน (แสดงในขั้นถัดไปของ flow)"
      >
        <p className="mp-admin-help" style={{ marginBottom: 0 }}>
          หลังเปิดซอง ระบบจะพาไปหน้าถัดไปใน Love Experience
        </p>
      </AdminSection>

      <AdminSection
        step={2}
        title="Flow ถัดไป"
        scene="Navigation หลังเปิดซอง"
      >
        <div className="form-group">
          <label>หน้าถัดไป (slug)</label>
          <input
            value={value.nextSlug || ''}
            onChange={(e) => onChange({ ...value, nextSlug: e.target.value })}
            placeholder="love-arrow"
          />
        </div>
      </AdminSection>
    </div>
  )
}
