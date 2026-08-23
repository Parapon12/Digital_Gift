import type { CrocodileBlessingContent } from '../../types'
import { AdminMediaField } from '../../components/AdminMediaField'
import { AdminSection } from '../../components/AdminSection'

export function CrocodileBlessingAdminFields({
  value,
  onChange,
}: {
  value: CrocodileBlessingContent
  onChange: (next: CrocodileBlessingContent) => void
}) {
  const set = (patch: Partial<CrocodileBlessingContent>) => onChange({ ...value, ...patch })

  return (
    <div className="mp-admin">
      <AdminSection step={1} title="หน้าเปิด" scene="แตะพุงเสือเพื่อเปิดคำอวยพรถึงคนสำคัญ">
        <div className="form-group">
          <label>บรรทัดเล็กด้านบน</label>
          <input
            value={value.eyebrow || ''}
            onChange={(e) => set({ eyebrow: e.target.value })}
            placeholder="ของขวัญจากใจ"
          />
        </div>
        <div className="form-group">
          <label>หัวข้อ</label>
          <input
            value={value.title || ''}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="กราดพุงเสืออวยพร"
          />
        </div>
        <div className="form-group">
          <label>คำแนะนำก่อนแตะพุง</label>
          <input
            value={value.intro || ''}
            onChange={(e) => set({ intro: e.target.value })}
            placeholder="แตะที่พุงเสือ เพื่อเปิดคำอวยพรถึงเธอ"
          />
        </div>
        <div className="form-group">
          <label>ข้อความกระตุ้นใต้เสือ</label>
          <input
            value={value.hint || ''}
            onChange={(e) => set({ hint: e.target.value })}
            placeholder="👆 แตะพุงเสือเลย"
          />
        </div>
      </AdminSection>

      <AdminSection step={2} title="คำอวยพร" scene="ข้อความถึงคนสำคัญหรือแฟน">
        <div className="form-group">
          <label>บรรทัดรอง</label>
          <input
            value={value.subtitle || ''}
            onChange={(e) => set({ subtitle: e.target.value })}
            placeholder="แด่เธอคนสำคัญในหัวใจ"
          />
        </div>
        <div className="form-group">
          <label>ข้อความอวยพร</label>
          <textarea
            rows={6}
            value={value.text1 || ''}
            onChange={(e) => set({ text1: e.target.value })}
            placeholder="ถึงเธอคนสำคัญ..."
            required
          />
        </div>
      </AdminSection>

      <AdminSection step={3} title="รูปซ้าย–ขวา">
        <AdminMediaField
          label="รูปซ้าย"
          value={value.photo1 || ''}
          onChange={(url) => set({ photo1: url })}
        />
        <AdminMediaField
          label="รูปขวา"
          value={value.photo2 || ''}
          onChange={(url) => set({ photo2: url })}
        />
      </AdminSection>

      <AdminSection step={4} title="รูปกลาง">
        <AdminMediaField
          label="รูปตรงกลาง"
          value={value.photo3 || ''}
          onChange={(url) => set({ photo3: url })}
        />
      </AdminSection>

      <AdminSection step={5} title="คำตบท้าย">
        <div className="form-group">
          <label>ข้อความปิดท้าย</label>
          <textarea
            rows={3}
            value={value.closing || ''}
            onChange={(e) => set({ closing: e.target.value })}
            placeholder="รักเธอนะ คนสำคัญ..."
            required
          />
        </div>
      </AdminSection>
    </div>
  )
}
