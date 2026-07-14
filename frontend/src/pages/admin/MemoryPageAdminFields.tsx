import type { MemoryPageContent, MemoryPageEntry, MemoryTheme } from '../../types'

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
        ใส่รูปเป็น URL (เช่น <code>/love/couple-demo.png</code> หรือลิงก์รูปเต็ม)
        · โน้ตลับจะปลดล็อกตอนคนรับเลื่อนถึงรูปนั้น
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

      <div className="form-group">
        <label>URL เพลงประกอบ (mp3) — ว่างได้</label>
        <input
          value={value.musicUrl || ''}
          onChange={(e) => set({ musicUrl: e.target.value })}
          placeholder="https://…/song.mp3"
        />
      </div>

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
            <div className="form-group">
              <label>URL รูป</label>
              <input
                value={entry.imageUrl || ''}
                onChange={(e) => updateEntry(i, { imageUrl: e.target.value })}
                placeholder="/love/couple-demo.png"
              />
            </div>
            {entry.imageUrl ? (
              <img className="mp-admin-thumb" src={entry.imageUrl} alt="" />
            ) : null}
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
                <label>คำบรรยาย</label>
                <input
                  value={entry.caption || ''}
                  onChange={(e) => updateEntry(i, { caption: e.target.value })}
                  placeholder="วันแรกที่…"
                />
              </div>
            </div>
            <div className="form-group">
              <label>โน้ตลับ (ไม่บังคับ)</label>
              <textarea
                value={entry.secretNote || ''}
                onChange={(e) => updateEntry(i, { secretNote: e.target.value })}
                rows={2}
                placeholder="ข้อความที่คนรับจะเห็นเมื่อเลื่อนมาถึง"
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

      <h3 className="mp-admin-sub">บทสรุปท้ายหน้า</h3>
      <div className="form-group">
        <label>หัวข้อสรุป</label>
        <input
          value={value.closingTitle || ''}
          onChange={(e) => set({ closingTitle: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>ข้อความสรุป</label>
        <textarea
          value={value.closingMessage || ''}
          onChange={(e) => set({ closingMessage: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  )
}
