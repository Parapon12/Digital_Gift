import { useRef, useState } from 'react'
import { adminApi } from '../api/admin'
import { asset } from '../lib/asset'

/** Text URL + optional file upload for admin media fields. */
export function AdminMediaField({
  label,
  value,
  onChange,
  accept = 'image/*',
  placeholder = 'หรือวาง URL / พาธไฟล์',
  kind = 'image',
}: {
  label: string
  value: string
  onChange: (url: string) => void
  accept?: string
  placeholder?: string
  kind?: 'image' | 'audio' | 'any'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const onPick = async (file: File | null) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      const url = await adminApi.upload(file)
      onChange(url)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const preview = value?.trim()
  const previewSrc =
    !preview ? '' :
    /^https?:\/\//i.test(preview) || preview.startsWith('/uploads/') || preview.startsWith('data:')
      ? preview
      : asset(preview)
  const showImage = kind === 'image' && previewSrc && !preview.match(/\.(mp3|m4a|aac|wav|ogg|mp4|webm)(\?|$)/i)

  return (
    <div className="form-group admin-media">
      <label>{label}</label>
      <div className="admin-media-row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="btn-luxury"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? 'กำลังอัป…' : 'อัปโหลด'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => void onPick(e.target.files?.[0] || null)}
        />
      </div>
      {err ? <p className="admin-media-err">{err}</p> : null}
      {showImage ? <img className="mp-admin-thumb" src={previewSrc} alt="" /> : null}
      {kind === 'audio' && previewSrc ? (
        <audio className="admin-media-audio" controls src={previewSrc} preload="none" />
      ) : null}
    </div>
  )
}
