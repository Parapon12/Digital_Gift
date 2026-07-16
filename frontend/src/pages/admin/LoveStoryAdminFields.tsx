import { AdminMediaField } from '../../components/AdminMediaField'
import type { LoveCapsule, LoveStoryContent, LoveStoryMemory } from '../../types'
import { formatMilestoneLabel, capsuleMonthIndex } from '../../utils/anniversary'
import { buildMonthlyCapsules } from '../../utils/loveStoryCapsules'

function blankMemory(): LoveStoryMemory {
  return { title: '', text: '', imageUrl: '', caption: '' }
}

function blankCapsule(month = 1): LoveCapsule {
  return {
    id: crypto.randomUUID(),
    title: `ข้อความเดือนที่ ${month}`,
    unlockRule: 'months',
    unlockValue: month,
    text: '',
  }
}

export function LoveStoryAdminFields({
  value,
  onChange,
}: {
  value: LoveStoryContent
  onChange: (next: LoveStoryContent) => void
}) {
  const set = (patch: Partial<LoveStoryContent>) => onChange({ ...value, ...patch })
  const memories = value.memories?.length ? value.memories : [blankMemory()]
  const capsules = value.capsules?.length ? value.capsules : buildMonthlyCapsules()

  const updateMemory = (index: number, patch: Partial<LoveStoryMemory>) => {
    set({
      memories: memories.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    })
  }

  const updateCapsule = (index: number, patch: Partial<LoveCapsule>) => {
    set({
      capsules: capsules.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    })
  }

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">
        แก้ข้อความและรูปผ่านฟอร์ม — แต่ละของขวัญได้ลิงก์คนละเส้นหลังบันทึก
      </p>

      <div className="grid-2">
        <div className="form-group">
          <label>ชื่อภายในสตอรี่</label>
          <input
            value={value.title || ''}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="ความทรงจำของเรา"
          />
        </div>
        <div className="form-group">
          <label>เป้าวัน (progress)</label>
          <input
            type="number"
            min={1}
            value={value.targetDays ?? 1000}
            onChange={(e) => set({ targetDays: Number(e.target.value) || 1000 })}
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>รหัสเข้า</label>
          <input
            value={value.password || ''}
            onChange={(e) => set({ password: e.target.value })}
            placeholder="14022025"
          />
        </div>
        <div className="form-group">
          <label>คำใบ้รหัส</label>
          <input
            value={value.passwordHint || ''}
            onChange={(e) => set({ passwordHint: e.target.value })}
            placeholder="วันเดือนปีที่เริ่มคบกัน"
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>วันครบรอบ (YYYY-MM-DD)</label>
          <input
            type="date"
            value={value.anniversaryDate || ''}
            onChange={(e) => set({ anniversaryDate: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>ป้ายครบรอบ</label>
          <input
            value={value.anniversaryLabel || ''}
            onChange={(e) => set({ anniversaryLabel: e.target.value })}
            placeholder="วันเริ่มคบกัน"
          />
        </div>
      </div>

      <AdminMediaField
        label="รูปคู่ (หน้าล็อก)"
        value={value.couplePhotoUrl || ''}
        onChange={(url) => set({ couplePhotoUrl: url })}
      />
      <AdminMediaField
        label="เพลงประกอบ"
        value={value.musicUrl || ''}
        onChange={(url) => set({ musicUrl: url })}
        accept="audio/*"
        kind="audio"
        placeholder="อัปโหลด mp3 หรือวาง URL"
      />

      <h3 className="mp-admin-sub">ความทรงจำ</h3>
      {memories.map((m, i) => (
        <div key={i} className="mp-admin-entry">
          <div className="mp-admin-entry-head">
            <strong>ชิ้นที่ {i + 1}</strong>
            {memories.length > 1 ? (
              <button
                type="button"
                className="mp-linkish"
                onClick={() => set({ memories: memories.filter((_, j) => j !== i) })}
              >
                ลบ
              </button>
            ) : null}
          </div>
          <div className="form-group">
            <label>หัวข้อ</label>
            <input value={m.title} onChange={(e) => updateMemory(i, { title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>ข้อความ</label>
            <textarea
              rows={2}
              value={m.text}
              onChange={(e) => updateMemory(i, { text: e.target.value, caption: e.target.value })}
            />
          </div>
          <AdminMediaField
            label="รูป"
            value={m.imageUrl || ''}
            onChange={(url) => updateMemory(i, { imageUrl: url })}
          />
        </div>
      ))}
      {memories.length < 20 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 16 }}
          onClick={() => set({ memories: [...memories, blankMemory()] })}
        >
          + เพิ่มความทรงจำ
        </button>
      ) : null}

      <h3 className="mp-admin-sub">กล่องข้อความลับ (รายเดือน)</h3>
      <p className="mp-admin-help">
        แต่ละซองเปิดได้เมื่อครบรอบตามวันที่ตั้งไว้ — ไม่มีวันครบรอบจะเปิดไม่ได้
      </p>
      {capsules.map((c, i) => {
        const month = capsuleMonthIndex(c.unlockRule, c.unlockValue) || c.unlockValue || i + 1
        const milestone = formatMilestoneLabel(month)
        return (
        <div key={c.id || i} className="mp-admin-entry">
          <div className="mp-admin-entry-head">
            <strong>ซอง {milestone}</strong>
            {capsules.length > 1 ? (
              <button
                type="button"
                className="mp-linkish"
                onClick={() => set({ capsules: capsules.filter((_, j) => j !== i) })}
              >
                ลบ
              </button>
            ) : null}
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>เดือนที่ (จากวันครบรอบ)</label>
              <input
                type="number"
                min={1}
                value={c.unlockValue ?? month}
                onChange={(e) => updateCapsule(i, {
                  unlockValue: Number(e.target.value) || 1,
                  unlockRule: 'months',
                  title: c.title || `ข้อความเดือนที่ ${Number(e.target.value) || 1}`,
                })}
              />
            </div>
            <div className="form-group">
              <label>ป้ายที่แสดง</label>
              <input value={milestone} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label>หัวข้อซอง</label>
            <input value={c.title} onChange={(e) => updateCapsule(i, { title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>ข้อความในซอง</label>
            <textarea
              rows={3}
              value={c.text || ''}
              onChange={(e) => updateCapsule(i, { text: e.target.value })}
            />
          </div>
        </div>
      )})}
      {capsules.length < 24 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 12 }}
          onClick={() => set({ capsules: [...capsules, blankCapsule(capsules.length + 1)] })}
        >
          + เพิ่มซอง
        </button>
      ) : null}
    </div>
  )
}
