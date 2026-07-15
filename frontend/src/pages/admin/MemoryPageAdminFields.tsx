import type { MemoryPageContent, MemoryPageEntry, MemoryTheme } from '../../types'
import { AdminMediaField } from '../../components/AdminMediaField'

function blankEntry(): MemoryPageEntry {
  return {
    id: crypto.randomUUID(),
    date: '',
    caption: '',
    imageUrl: '',
    secretNote: '',
  }
}

export function MemoryPageAdminFields({
  value,
  onChange,
}: {
  value: MemoryPageContent
  onChange: (next: MemoryPageContent) => void
}) {
  const entries = value.entries?.length ? value.entries : [blankEntry()]

  const set = (patch: Partial<MemoryPageContent>) => onChange({ ...value, ...patch })

  const updateEntry = (index: number, patch: Partial<MemoryPageEntry>) => {
    const next = entries.map((e, i) => (i === index ? { ...e, ...patch } : e))
    set({ entries: next })
  }

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return
    set({ entries: entries.filter((_, i) => i !== index) })
  }

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">
        ใต้รูปใส่แค่ <strong>สถานที่</strong> · โน้ตลับใส่ <strong>ความรู้สึก</strong> ·
        ท้ายหน้าเป็น <strong>จดหมายขอบคุณ</strong> — อัปโหลดรูปจากเครื่องได้
      </p>

      <div className="grid-2">
        <div className="form-group">
          <label>สไตล์</label>
          <select
            value={value.theme || 'couple'}
            onChange={(e) => set({ theme: e.target.value as MemoryTheme })}
          >
            <option value="couple">คู่รัก</option>
            <option value="friends">เพื่อน</option>
            <option value="family">ครอบครัว</option>
          </select>
        </div>
        <div className="form-group">
          <label>ชื่อหน้า Memory</label>
          <input
            value={value.title || ''}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="สมุดความทรงจำของเรา"
          />
        </div>
      </div>

      <div className="form-group">
        <label>ประโยคนำ</label>
        <textarea
          value={value.intro || ''}
          onChange={(e) => set({ intro: e.target.value })}
          rows={2}
          placeholder="เลื่อนลงช้า ๆ…"
        />
      </div>

      <AdminMediaField
        label="เพลงประกอบ (mp3) — ว่างได้"
        value={value.musicUrl || ''}
        onChange={(url) => set({ musicUrl: url })}
        accept="audio/*"
        kind="audio"
        placeholder="อัปโหลด หรือวาง URL"
      />

      <h3 className="mp-admin-sub">รูปตามลำดับเวลา</h3>
      <div className="mp-admin-entries">
        {entries.map((entry, i) => (
          <div key={entry.id || i} className="mp-admin-entry">
            <div className="mp-admin-entry-head">
              <strong>รูปที่ {i + 1}</strong>
              {entries.length > 1 ? (
                <button type="button" className="mp-linkish" onClick={() => removeEntry(i)}>
                  ลบ
                </button>
              ) : null}
            </div>
            <AdminMediaField
              label="รูป"
              value={entry.imageUrl || ''}
              onChange={(url) => updateEntry(i, { imageUrl: url })}
            />
            <div className="grid-2">
              <div className="form-group">
                <label>วันที่ / ช่วงเวลา</label>
                <input
                  value={entry.date || ''}
                  onChange={(e) => updateEntry(i, { date: e.target.value })}
                  placeholder="มี.ค. 2024"
                />
              </div>
              <div className="form-group">
                <label>สถานที่ (ใต้รูป)</label>
                <input
                  value={entry.caption || ''}
                  onChange={(e) => updateEntry(i, { caption: e.target.value })}
                  placeholder="ชายหาด · ตอนเย็น"
                />
              </div>
            </div>
            <div className="form-group">
              <label>ความรู้สึก (เปิดอ่าน)</label>
              <textarea
                value={entry.secretNote || ''}
                onChange={(e) => updateEntry(i, { secretNote: e.target.value })}
                rows={3}
                placeholder="เล่าความในใจให้ยาวและลึกกว่าใต้รูป"
              />
            </div>
          </div>
        ))}
      </div>

      {entries.length < 20 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 20 }}
          onClick={() => set({ entries: [...entries, blankEntry()] })}
        >
          + เพิ่มรูป
        </button>
      ) : null}

      <h3 className="mp-admin-sub">จดหมายขอบคุณท้ายหน้า</h3>
      <div className="form-group">
        <label>หัวข้อจดหมาย</label>
        <input
          value={value.letterTitle || value.closingTitle || ''}
          onChange={(e) => set({ letterTitle: e.target.value, closingTitle: e.target.value })}
          placeholder="ขอบคุณที่เป็นเธอ"
        />
      </div>
      <div className="form-group">
        <label>เนื้อหาจดหมาย (เว้นบรรทัดได้)</label>
        <textarea
          value={value.letterBody || value.closingMessage || ''}
          onChange={(e) => set({ letterBody: e.target.value, closingMessage: e.target.value })}
          rows={6}
          placeholder="ข้อความขอบคุณยาว ๆ…"
        />
      </div>
    </div>
  )
}
