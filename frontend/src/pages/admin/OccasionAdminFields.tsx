import { AdminMediaField } from '../../components/AdminMediaField'
import type { OccasionContent } from '../../types'

export function OccasionAdminFields({
  value,
  onChange,
}: {
  value: OccasionContent
  onChange: (next: OccasionContent) => void
}) {
  const set = (patch: Partial<OccasionContent>) => onChange({ ...value, ...patch })
  const photos = value.photos?.length ? value.photos : ['']

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">แก้ข้อความหลักและรูปประกอบของเทมเพลตนี้</p>
      <div className="form-group">
        <label>หัวข้อ</label>
        <input
          value={value.headline || ''}
          onChange={(e) => set({ headline: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>ข้อความ</label>
        <textarea
          rows={4}
          value={value.message || ''}
          onChange={(e) => set({ message: e.target.value })}
        />
      </div>
      <h3 className="mp-admin-sub">รูป</h3>
      {photos.map((url, i) => (
        <AdminMediaField
          key={i}
          label={`รูปที่ ${i + 1}`}
          value={url}
          onChange={(next) => {
            const list = photos.map((p, j) => (j === i ? next : p))
            set({ photos: list })
          }}
        />
      ))}
      {photos.length < 8 ? (
        <button
          type="button"
          className="btn-luxury"
          onClick={() => set({ photos: [...photos, ''] })}
        >
          + เพิ่มรูป
        </button>
      ) : null}
    </div>
  )
}
