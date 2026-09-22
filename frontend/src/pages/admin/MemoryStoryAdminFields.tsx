import { AdminMediaField } from '../../components/AdminMediaField'
import { AdminSection } from '../../components/AdminSection'
import type { MemoryStoryContent } from '../../types'

function chunkPairs<T>(items: T[]): T[][] {
  const pairs: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2))
  }
  return pairs
}

export function MemoryStoryAdminFields({
  value,
  onChange,
}: {
  value: MemoryStoryContent
  onChange: (next: MemoryStoryContent) => void
}) {
  const set = (patch: Partial<MemoryStoryContent>) => onChange({ ...value, ...patch })

  const memoryPhotos = value.memoryPhotos?.length ? [...value.memoryPhotos] : ['', '']
  const galleryPhotos = value.galleryPhotos?.length ? value.galleryPhotos : ['']
  const pairs = chunkPairs(memoryPhotos)

  const setPhotoAt = (index: number, url: string) => {
    const next = [...memoryPhotos]
    next[index] = url
    set({ memoryPhotos: next })
  }

  const addPair = () => {
    if (memoryPhotos.length >= 8) return
    set({ memoryPhotos: [...memoryPhotos, '', ''] })
  }

  const removePair = (pairIndex: number) => {
    if (pairs.length <= 1) return
    const next = memoryPhotos.filter((_, i) => i !== pairIndex * 2 && i !== pairIndex * 2 + 1)
    set({ memoryPhotos: next.length >= 2 ? next : ['', ''] })
  }

  const updateGallery = (index: number, url: string) => {
    onChange({
      ...value,
      galleryPhotos: galleryPhotos.map((p, i) => (i === index ? url : p)),
    })
  }

  return (
    <div className="mp-admin">
      <AdminSection
        step={0}
        title="นับถอยหลัง 3-2-1"
        scene="Countdown overlay"
        help="ข้อความช่วงนี้เป็นค่าเริ่มต้นในเทมเพลต — แก้ได้ในรุ่นถัดไป"
      >
        <p className="mp-admin-help" style={{ marginBottom: 0 }}>
          หลังผู้ชมกดเริ่ม จะเห็นนับ 3 → 2 → 1 แล้วเข้าสู่รูปคู่แรก
        </p>
      </AdminSection>

      <AdminSection
        step={1}
        title="รูปเปิดเรื่อง (ทีละคู่)"
        scene="Opening photo pairs — fade in ทีละชุด"
        help="ใส่เป็นคู่เท่านั้น (2, 4, 6, 8 รูป) — แต่ละคู่จะ fade in พร้อมกัน"
      >
        {pairs.map((pair, pairIndex) => (
          <div key={pairIndex} className="admin-pair-block">
            <div className="admin-pair-block-head">
              <strong>คู่ที่ {pairIndex + 1}</strong>
              {pairs.length > 1 ? (
                <button type="button" className="mp-linkish" onClick={() => removePair(pairIndex)}>
                  ลบคู่นี้
                </button>
              ) : null}
            </div>
            <div className="grid-2">
              {pair.map((url, slot) => {
                const globalIndex = pairIndex * 2 + slot
                return (
                  <AdminMediaField
                    key={globalIndex}
                    label={slot === 0 ? 'รูปซ้าย' : 'รูปขวา'}
                    value={url}
                    onChange={(next) => setPhotoAt(globalIndex, next)}
                  />
                )
              })}
            </div>
          </div>
        ))}
        {memoryPhotos.length < 8 ? (
          <button type="button" className="btn-luxury" onClick={addPair}>
            + เพิ่มคู่รูป (2 รูป)
          </button>
        ) : null}
      </AdminSection>

      <AdminSection
        step={2}
        title="แกลเลอรี่ «ความทรงจำของเรา»"
        scene="Film strip เลื่อนอัตโนมัติ"
        help="รูปทั้งหมดในส strip — แนะนำ 4–8 รูป"
      >
        {galleryPhotos.map((url, i) => (
          <div key={i} className="mp-admin-entry">
            <div className="mp-admin-entry-head">
              <strong>รูปแกลเลอรี่ที่ {i + 1}</strong>
              {galleryPhotos.length > 1 ? (
                <button
                  type="button"
                  className="mp-linkish"
                  onClick={() =>
                    set({ galleryPhotos: galleryPhotos.filter((_, j) => j !== i) })
                  }
                >
                  ลบ
                </button>
              ) : null}
            </div>
            <AdminMediaField
              label="รูปใน film strip"
              value={url}
              onChange={(next) => updateGallery(i, next)}
            />
          </div>
        ))}
        {galleryPhotos.length < 12 ? (
          <button
            type="button"
            className="btn-luxury"
            onClick={() => set({ galleryPhotos: [...galleryPhotos, ''] })}
          >
            + เพิ่มรูปแกลเลอรี่
          </button>
        ) : null}
      </AdminSection>

      <AdminSection
        step={3}
        title="หัวใจท้ายเรื่อง"
        scene="Heart animation + คำว่ารัก"
        help="คำที่แสดงในหัวใจก่อนจบ — ว่างไว้จะใช้ love you"
      >
        <div className="form-group">
          <label>คำในหัวใจ</label>
          <input
            value={value.endingWord || ''}
            onChange={(e) => set({ endingWord: e.target.value })}
            placeholder="love you"
          />
        </div>
      </AdminSection>
    </div>
  )
}
