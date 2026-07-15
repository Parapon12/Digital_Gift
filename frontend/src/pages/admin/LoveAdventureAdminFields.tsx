import { AdminMediaField } from '../../components/AdminMediaField'
import type { LoveAdventureContent, MemoryItem } from '../../types'

const STOP_HINTS = [
  'ทุ่งดอกไม้ — จุดเริ่มต้น',
  'ริมน้ำ — จุดที่ 2',
  'สะพานไม้ — จุดที่ 3',
  'เนินเขา — จุดที่ 4',
  'ปลายทาง — จุดที่ 5',
]

function blankMemory(): MemoryItem {
  return { title: '', text: '', imageUrl: '' }
}

export function LoveAdventureAdminFields({
  value,
  onChange,
}: {
  value: LoveAdventureContent
  onChange: (next: LoveAdventureContent) => void
}) {
  const set = (patch: Partial<LoveAdventureContent>) => onChange({ ...value, ...patch })
  const memories = value.memories?.length ? value.memories : [blankMemory(), blankMemory(), blankMemory(), blankMemory()]

  const updateMemory = (index: number, patch: Partial<MemoryItem>) => {
    set({
      memories: memories.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    })
  }

  const removeMemory = (index: number) => {
    if (memories.length <= 3) return
    set({ memories: memories.filter((_, i) => i !== index) })
  }

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">
        เดิน 3D ผ่าน <strong>{memories.length} จุด</strong> แล้วเจอแมวตอนจบ — กรอกเฉพาะช่องด้านล่าง
        ไม่ต้องแตะ JSON
      </p>

      <div className="grid-2">
        <div className="form-group">
          <label>ชื่อแมว (ตอนจบ)</label>
          <input
            value={value.catName || ''}
            onChange={(e) => set({ catName: e.target.value })}
            placeholder="Mochi"
          />
        </div>
      </div>

      <div className="form-group">
        <label>ข้อความปิดท้าย (หลังแตะแมว)</label>
        <textarea
          rows={3}
          value={value.message || ''}
          onChange={(e) => set({ message: e.target.value })}
          placeholder="รักนะ / ข้อความจากใจที่อยากให้คนรับอ่านตอนจบ"
        />
      </div>

      <AdminMediaField
        label="เพลงประกอบ — ว่างได้"
        value={value.musicUrl || ''}
        onChange={(url) => set({ musicUrl: url })}
        accept="audio/*"
        kind="audio"
        placeholder="อัปโหลด mp3 หรือวาง URL"
      />

      <h3 className="mp-admin-sub">จุดความทรงจำระหว่างเดิน (อย่างน้อย 3 จุด สูงสุด 5)</h3>
      {memories.map((m, i) => (
        <div key={i} className="mp-admin-entry">
          <div className="mp-admin-entry-head">
            <strong>
              จุดที่ {i + 1}
              <span style={{ fontWeight: 400, opacity: 0.75 }}> · {STOP_HINTS[i] || 'จุดถัดไป'}</span>
            </strong>
            {memories.length > 3 ? (
              <button type="button" className="mp-linkish" onClick={() => removeMemory(i)}>
                ลบ
              </button>
            ) : null}
          </div>
          <div className="form-group">
            <label>หัวข้อการ์ด</label>
            <input
              value={m.title}
              onChange={(e) => updateMemory(i, { title: e.target.value })}
              placeholder="วันแรกที่เจอ"
              required
            />
          </div>
          <div className="form-group">
            <label>ข้อความในการ์ด</label>
            <textarea
              rows={3}
              value={m.text}
              onChange={(e) => updateMemory(i, { text: e.target.value })}
              placeholder="เล่าเรื่องสั้น ๆ ของจุดนี้"
              required
            />
          </div>
          <AdminMediaField
            label="รูปประกอบ (ไม่บังคับ)"
            value={m.imageUrl || ''}
            onChange={(url) => updateMemory(i, { imageUrl: url })}
          />
        </div>
      ))}

      {memories.length < 5 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 16 }}
          onClick={() => set({ memories: [...memories, blankMemory()] })}
        >
          + เพิ่มจุดความทรงจำ
        </button>
      ) : null}
    </div>
  )
}
