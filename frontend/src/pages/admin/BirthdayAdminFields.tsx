import { AdminMediaField } from '../../components/AdminMediaField'
import type { BirthdayContent } from '../../types'

export function BirthdayAdminFields({
  value,
  onChange,
}: {
  value: BirthdayContent
  onChange: (next: BirthdayContent) => void
}) {
  const set = (patch: Partial<BirthdayContent>) => onChange({ ...value, ...patch })
  const photos = value.photos?.length ? value.photos : ['']

  return (
    <div className="mp-admin">
      <p className="mp-admin-help">
        หน้าวันเกิดมี 4 การ์ดที่กดแล้วเด้งขึ้น — กรอกข้อความและอัปโหลดรูปได้เลย
      </p>

      <div className="form-group">
        <label>หัวข้อ (เช่น สุขสันต์ วันเกิด)</label>
        <input
          value={value.headline || ''}
          onChange={(e) => set({ headline: e.target.value })}
          placeholder="สุขสันต์ วันเกิด"
        />
      </div>
      <div className="form-group">
        <label>ข้อความใต้ชื่อผู้รับ</label>
        <textarea
          rows={3}
          value={value.message || ''}
          onChange={(e) => set({ message: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>ข้อความแถบล่าง (ขอบคุณ)</label>
        <input
          value={value.closingMessage || ''}
          onChange={(e) => set({ closingMessage: e.target.value })}
        />
      </div>

      <AdminMediaField
        label="รูปเค้ก / ฮีโร่ซ้าย"
        value={value.heroImageUrl || ''}
        onChange={(url) => set({ heroImageUrl: url })}
      />

      <h3 className="mp-admin-sub">1) ข้อความพิเศษ (ป๊อปอัป)</h3>
      <div className="form-group">
        <label>เนื้อหา</label>
        <textarea
          rows={5}
          value={value.specialMessage || ''}
          onChange={(e) => set({ specialMessage: e.target.value })}
          placeholder="ข้อความยาว ๆ จากใจ"
        />
      </div>

      <h3 className="mp-admin-sub">2) ความทรงจำ (เลื่อนซ้าย–ขวาได้)</h3>
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
          <AdminMediaField label="รูป" value={url} onChange={(next) => {
            const list = photos.map((p, j) => (j === i ? next : p))
            set({ photos: list })
          }} />
        </div>
      ))}
      {photos.length < 12 ? (
        <button
          type="button"
          className="btn-luxury"
          style={{ marginBottom: 16 }}
          onClick={() => set({ photos: [...photos, ''] })}
        >
          + เพิ่มรูป
        </button>
      ) : null}

      <h3 className="mp-admin-sub">3) เกมวันเกิด</h3>
      <div className="grid-2">
        <div className="form-group">
          <label>ชื่อเกม</label>
          <input
            value={value.gameTitle || ''}
            onChange={(e) => set({ gameTitle: e.target.value })}
            placeholder="เป่าเทียนวันเกิด"
          />
        </div>
        <div className="form-group">
          <label>รางวัลเมื่อชนะ</label>
          <input
            value={value.gameMessage || ''}
            onChange={(e) => set({ gameMessage: e.target.value })}
          />
        </div>
      </div>

      <h3 className="mp-admin-sub">4) ของขวัญให้เธอ</h3>
      <div className="form-group">
        <label>หัวข้อของขวัญ</label>
        <input
          value={value.giftTitle || ''}
          onChange={(e) => set({ giftTitle: e.target.value })}
        />
      </div>
      <div className="form-group">
        <label>ข้อความหลังเปิดกล่อง</label>
        <textarea
          rows={3}
          value={value.giftMessage || ''}
          onChange={(e) => set({ giftMessage: e.target.value })}
        />
      </div>
      <AdminMediaField
        label="รูปร่วมของขวัญ (ไม่บังคับ)"
        value={value.giftImageUrl || ''}
        onChange={(url) => set({ giftImageUrl: url })}
      />
    </div>
  )
}
