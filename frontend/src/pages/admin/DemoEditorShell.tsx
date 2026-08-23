import type { FormEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function DemoEditorShell({
  subtitle,
  demoSlug,
  loading,
  saving,
  saved,
  error,
  onSubmit,
  children,
  saveLabel = 'บันทึกตัวอย่าง',
}: {
  subtitle: string
  demoSlug?: string
  loading?: boolean
  saving?: boolean
  saved?: boolean
  error?: string
  onSubmit: (e: FormEvent) => void
  children: ReactNode
  saveLabel?: string
}) {
  if (loading) {
    return <p className="admin-loading">กำลังโหลด…</p>
  }

  return (
    <>
      <div className="admin-demo-intro">
        <p>{subtitle}</p>
      </div>

      {error ? <div className="alert alert-error">{error}</div> : null}
      {saved ? <div className="alert alert-success">บันทึกแล้ว</div> : null}

      <form onSubmit={onSubmit} className="admin-editor">
        {children}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
          <button type="submit" className="btn-luxury btn-luxury-filled" disabled={saving}>
            {saving ? 'กำลังบันทึก…' : saveLabel}
          </button>
          {demoSlug ? (
            <a
              href={`/demo/${demoSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury"
            >
              เปิดดูตัวอย่าง
            </a>
          ) : null}
          <Link to="/admin/demos" className="btn-luxury">
            กลับรายการ
          </Link>
        </div>
      </form>
    </>
  )
}

export function DemoFlowBlock({
  step,
  title,
  path,
  children,
}: {
  step: number | string
  title: string
  path: string
  children: ReactNode
}) {
  return (
    <div className="admin-flow-block">
      <header className="admin-flow-block-head">
        <span className="admin-section-step">{step}</span>
        <div>
          <h3>{title}</h3>
          <p>{path}</p>
        </div>
        <a
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury"
          style={{ fontSize: '0.65rem', padding: '8px 12px' }}
        >
          ดูหน้านี้
        </a>
      </header>
      {children}
    </div>
  )
}

export function DemoMetaFields({
  title,
  recipient,
  sender,
  onTitle,
  onRecipient,
  onSender,
  showTitle = true,
}: {
  title: string
  recipient: string
  sender: string
  onTitle: (v: string) => void
  onRecipient: (v: string) => void
  onSender: (v: string) => void
  showTitle?: boolean
}) {
  return (
    <div className="admin-flow-block">
      <header className="admin-flow-block-head">
        <span className="admin-section-step">✦</span>
        <div>
          <h3>ข้อมูลร่วม</h3>
          <p>ชื่อผู้รับ / ผู้ส่ง — แสดงบนหน้า demo</p>
        </div>
      </header>
      <div className="grid-2">
        {showTitle ? (
          <div className="form-group">
            <label>ชื่อเรื่อง (ภายในแอดมิน)</label>
            <input value={title} onChange={(e) => onTitle(e.target.value)} required />
          </div>
        ) : null}
        <div className="form-group">
          <label>ชื่อผู้รับ</label>
          <input value={recipient} onChange={(e) => onRecipient(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>ชื่อผู้ส่ง</label>
          <input value={sender} onChange={(e) => onSender(e.target.value)} />
        </div>
      </div>
    </div>
  )
}
