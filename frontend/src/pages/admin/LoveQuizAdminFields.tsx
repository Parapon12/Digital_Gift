import { AdminMediaField } from '../../components/AdminMediaField'
import type { LoveQuizContent } from '../../types'

export function LoveQuizAdminFields({
  value,
  onChange,
}: {
  value: LoveQuizContent
  onChange: (next: LoveQuizContent) => void
}) {
  const set = (patch: Partial<LoveQuizContent>) => onChange({ ...value, ...patch })
  const photos = value.photos?.length ? value.photos : ['']

  const updatePhoto = (index: number, url: string) => {
    const next = photos.map((p, i) => (i === index ? url : p))
    set({ photos: next })
  }

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">
        กรอกข้อความบนหน้า Love Quiz — กดอัปโหลดรูปได้ หรือวาง URL ก็ได้
      </p>

      <div className="form-group">
        <label>คำถาม</label>
        <input
          value={value.question || ''}
          onChange={(e) => set({ question: e.target.value })}
          placeholder="รักฉันมั้ยที่รัก"
        />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>ปุ่มใช่</label>
          <input
            value={value.yesLabel || ''}
            onChange={(e) => set({ yesLabel: e.target.value })}
            placeholder="รักที่สุด"
          />
        </div>
        <div className="form-group">
          <label>ปุ่มไม่</label>
          <input
            value={value.noLabel || ''}
            onChange={(e) => set({ noLabel: e.target.value })}
            placeholder="ไม่"
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>หัวข้อตอนตอบใช่</label>
          <input
            value={value.successTitle || ''}
            onChange={(e) => set({ successTitle: e.target.value })}
            placeholder="น่ารัก"
          />
        </div>
        <div className="form-group">
          <label>ข้อความด้านล่าง</label>
          <input
            value={value.successMessage || ''}
            onChange={(e) => set({ successMessage: e.target.value })}
            placeholder="ได้ยินแล้วใจฟูเลย 😊"
          />
        </div>
      </div>

      <h3 className="mp-admin-sub">รูปหลังตอบใช่ (ถ้ามี)</h3>
      {photos.map((url, i) => (
        <div key={i} className="mp-admin-entry">
          <div className="mp-admin-entry-head">
            <strong>รูปที่ {i + 1}</strong>
            {photos.length > 1 ? (
              <button
                type="button"
                className="mp-linkish"
                onClick={() => set({ photos: photos.filter((_, j) => j !== i) })}
              >
                ลบ
              </button>
            ) : null}
          </div>
          <AdminMediaField
            label="รูป"
            value={url}
            onChange={(next) => updatePhoto(i, next)}
          />
        </div>
      ))}
      {photos.length < 6 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 12 }}
          onClick={() => set({ photos: [...photos, ''] })}
        >
          + เพิ่มรูป
        </button>
      ) : null}
    </div>
  )
}
