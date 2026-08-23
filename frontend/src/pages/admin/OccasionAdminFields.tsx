import { AdminMediaField } from '../../components/AdminMediaField'
import { AdminSection } from '../../components/AdminSection'
import type { OccasionContent } from '../../types'

export function OccasionAdminFields({
  value,
  onChange,
  showPhotos = true,
  templateLabel = 'เทมเพลต',
}: {
  value: OccasionContent
  onChange: (next: OccasionContent) => void
  /** ซ่อนรูปเมื่อเทมเพลตยังไม่รองรับ gallery */
  showPhotos?: boolean
  templateLabel?: string
}) {
  const set = (patch: Partial<OccasionContent>) => onChange({ ...value, ...patch })
  const photos = value.photos?.length ? value.photos : ['']

  return (
    <div className="mp-admin">
      <AdminSection
        step={1}
        title="ข้อความหลัก"
        scene={`${templateLabel} — หน้าข้อความ`}
        help="หัวข้อและข้อความแสดงบนหน้าหลักของเทมเพลต"
      >
        <div className="form-group">
          <label>หัวข้อ</label>
          <input value={value.headline || ''} onChange={(e) => set({ headline: e.target.value })} />
        </div>
        <div className="form-group">
          <label>ข้อความ</label>
          <textarea rows={4} value={value.message || ''} onChange={(e) => set({ message: e.target.value })} />
        </div>
      </AdminSection>

      {showPhotos ? (
        <AdminSection
          step={2}
          title="รูปประกอบ"
          scene="Gallery / รูปในหน้า"
          help="รูปที่แสดงประกอบเนื้อหา"
        >
          {photos.map((url, i) => (
            <AdminMediaField
              key={i}
              label={`รูปที่ ${i + 1}`}
              value={url}
              onChange={(next) => set({ photos: photos.map((p, j) => (j === i ? next : p)) })}
            />
          ))}
          {photos.length < 8 ? (
            <button type="button" className="btn-luxury" onClick={() => set({ photos: [...photos, ''] })}>
              + เพิ่มรูป
            </button>
          ) : null}
        </AdminSection>
      ) : null}
    </div>
  )
}
