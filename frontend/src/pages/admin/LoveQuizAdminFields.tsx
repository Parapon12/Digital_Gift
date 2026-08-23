import { AdminMediaField } from '../../components/AdminMediaField'
import { AdminSection } from '../../components/AdminSection'
import type { LoveQuizContent } from '../../types'

export function LoveQuizAdminFields({
  value,
  onChange,
  showFlowNext = true,
}: {
  value: LoveQuizContent
  onChange: (next: LoveQuizContent) => void
  /** ซ่อน nextSlug เมื่อแก้ใน flow editor รวม (ขั้นถัดไปคือ love-letter อัตโนมัติ) */
  showFlowNext?: boolean
}) {
  const set = (patch: Partial<LoveQuizContent>) => onChange({ ...value, ...patch })
  const photos = value.photos?.length ? value.photos : ['']

  const updatePhoto = (index: number, url: string) => {
    set({ photos: photos.map((p, i) => (i === index ? url : p)) })
  }

  return (
    <div className="mp-admin">
      <AdminSection
        step={1}
        title="พื้นหลัง & แมว"
        scene="Meadow background + แมววิ่งหลังชนะ"
        help="รูปทุ่งด้านหลังทั้งหน้า · แมววิ่งเมื่อกดใช่"
      >
        <AdminMediaField
          label="รูปพื้นหลังทุ่ง (meadow)"
          value={value.backgroundImageUrl || ''}
          onChange={(url) => set({ backgroundImageUrl: url })}
        />
        <AdminMediaField
          label="รูปแมววิ่ง (หลังตอบใช่)"
          value={value.catRunImageUrl || ''}
          onChange={(url) => set({ catRunImageUrl: url })}
        />
      </AdminSection>

      <AdminSection
        step={2}
        title="หน้าคำถาม"
        scene="ชื่อผู้รับ + คำถาม + ปุ่มใช่/ไม่ + แมวยื่นหัวใจ"
        help="ชื่อผู้รับใช้จากช่องด้านบนฟอร์ม"
      >
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
      </AdminSection>

      <AdminSection
        step={3}
        title="หลังตอบ «ใช่»"
        scene="พลุ + confetti + รูปคู่ + ปุ่มต่อไป"
        help="รูปแสดงเรียงลงตามลำดับ พร้อมเอฟเฟกต์พลุด้านข้าง"
      >
        <div className="grid-2">
          <div className="form-group">
            <label>หัวข้อ</label>
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
            <AdminMediaField label="รูปในหน้าชนะ" value={url} onChange={(next) => updatePhoto(i, next)} />
          </div>
        ))}
        {photos.length < 6 ? (
          <button type="button" className="btn-luxury" onClick={() => set({ photos: [...photos, ''] })}>
            + เพิ่มรูป
          </button>
        ) : null}
      </AdminSection>

      {showFlowNext ? (
        <AdminSection step={4} title="ไปหน้าถัดไป" scene="ปุ่ม «ต่อไป» หลังชนะ">
          <div className="form-group">
            <label>หน้าถัดไป (slug)</label>
            <input
              value={value.nextSlug || ''}
              onChange={(e) => set({ nextSlug: e.target.value })}
              placeholder="love-letter"
            />
          </div>
        </AdminSection>
      ) : null}
    </div>
  )
}
