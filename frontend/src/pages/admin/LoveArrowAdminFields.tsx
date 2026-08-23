import { AdminSection } from '../../components/AdminSection'
import type { LoveArrowContent } from '../../types'

export function LoveArrowAdminFields({
  value,
  onChange,
}: {
  value: LoveArrowContent
  onChange: (next: LoveArrowContent) => void
}) {
  return (
    <div className="mp-admin">
      <AdminSection
        step={1}
        title="มินิเกมยิงลูกศร"
        scene="Cupid bow — ทุ่งหญ้า + ธนู"
        help="ฉากเกมเป็นค่าเริ่มต้น — แก้ copy เกมได้ในรุ่นถัดไป"
      >
        <p className="mp-admin-help" style={{ marginBottom: 0 }}>
          ผู้เล่นยิงลูกศรโดนหัวใจ แล้วจะเห็นข้อความในช่วงถัดไป
        </p>
      </AdminSection>

      <AdminSection
        step={2}
        title="ป๊อปอัปหลังโดนใจ"
        scene="Heart popup — ข้อความรัก"
        help="ถ้าว่างไว้ จะใช้ชื่อผู้รับ/ผู้ส่งแทน"
      >
        <div className="form-group">
          <label>ข้อความรัก</label>
          <textarea
            rows={4}
            value={value.loveMessage || ''}
            onChange={(e) => onChange({ ...value, loveMessage: e.target.value })}
            placeholder="รักเธอมากที่สุดในโลก..."
          />
        </div>
      </AdminSection>

      <AdminSection
        step={3}
        title="Flow ถัดไป"
        scene="Navigation หลังกดต่อ"
      >
        <div className="form-group">
          <label>หน้าถัดไป (slug)</label>
          <input
            value={value.nextSlug || ''}
            onChange={(e) => onChange({ ...value, nextSlug: e.target.value })}
            placeholder="memory-story"
          />
        </div>
      </AdminSection>
    </div>
  )
}
