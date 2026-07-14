import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { adminApi } from '../../api/admin'
import { api } from '../../api/client'
import {
  defaultContent,
  type Gift,
  type MemoryPageContent,
  type TemplateInfo,
  type TemplateKey,
} from '../../types'
import { MemoryPageAdminFields } from './MemoryPageAdminFields'

export function AdminGiftEditorPage() {
  const { id } = useParams<{ id: string }>()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()

  const [templates, setTemplates] = useState<TemplateInfo[]>([])
  const [templateKey, setTemplateKey] = useState<TemplateKey>('love_quiz')
  const [title, setTitle] = useState('')
  const [recipient, setRecipient] = useState('')
  const [sender, setSender] = useState('')
  const [published, setPublished] = useState(true)
  const [contentText, setContentText] = useState(JSON.stringify(defaultContent('love_quiz'), null, 2))
  const [memoryContent, setMemoryContent] = useState<MemoryPageContent>(
    defaultContent('memory_page') as MemoryPageContent,
  )
  const [gift, setGift] = useState<Gift | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const isMemory = templateKey === 'memory_page'

  useEffect(() => {
    api.getTemplates().then(setTemplates).catch(() => {})
  }, [])

  useEffect(() => {
    if (isNew) return
    adminApi.getGift(id!)
      .then((g) => {
        setGift(g)
        setTemplateKey(g.template_key)
        setTitle(g.title)
        setRecipient(g.recipient_name)
        setSender(g.sender_name)
        setPublished(g.is_published)
        setContentText(JSON.stringify(g.content || {}, null, 2))
        if (g.template_key === 'memory_page') {
          setMemoryContent({
            ...(defaultContent('memory_page') as MemoryPageContent),
            ...(g.content as MemoryPageContent),
          })
        }
      })
      .catch(() => navigate('/admin/login'))
  }, [id, isNew, navigate])

  const giftUrl = useMemo(() => {
    if (!gift) return ''
    return `${window.location.origin}/gift/${gift.public_id}`
  }, [gift])

  const onTemplateChange = (key: TemplateKey) => {
    setTemplateKey(key)
    if (!isNew) return
    const base = defaultContent(key)
    setContentText(JSON.stringify(base, null, 2))
    if (key === 'memory_page') {
      setMemoryContent(base as MemoryPageContent)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const content = isMemory
        ? {
            ...memoryContent,
            entries: (memoryContent.entries || [])
              .filter((x) => x.imageUrl?.trim() && x.caption?.trim())
              .map((x) => ({
                id: x.id || crypto.randomUUID(),
                date: x.date?.trim() || undefined,
                caption: x.caption.trim(),
                imageUrl: x.imageUrl.trim(),
                secretNote: x.secretNote?.trim() || undefined,
              })),
          }
        : JSON.parse(contentText)

      if (isNew) {
        const created = await adminApi.createGift({
          template_key: templateKey,
          title,
          recipient_name: recipient,
          sender_name: sender,
          content,
          is_published: published,
        })
        navigate(`/admin/gifts/${created.id}`)
      } else {
        const updated = await adminApi.updateGift(id!, {
          title,
          recipient_name: recipient,
          sender_name: sender,
          content,
          is_published: published,
        })
        setGift(updated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  const copyLink = async () => {
    if (!giftUrl) return
    await navigator.clipboard.writeText(giftUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="container admin-page" style={{ maxWidth: 900 }}>
      <header className="admin-header">
        <div>
          <h1>{isNew ? 'สร้างของขวัญ' : 'แก้ไขของขวัญ'}</h1>
          <p>
            {isMemory
              ? 'Memory page — แอดมินใส่รูป คำบรรยาย โน้ตลับ และเพลง แล้วส่งลิงก์ให้คนรับ'
              : 'เทมเพลตล็อกโครง — กรอกชื่อ ข้อความ และ URL รูป'}
          </p>
        </div>
        <Link to="/admin" className="btn-luxury">กลับรายการ</Link>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit} className="admin-editor">
        <div className="form-group">
          <label>เทมเพลต {!isNew && '(ล็อกแล้ว)'}</label>
          <select
            value={templateKey}
            disabled={!isNew}
            onChange={(e) => onTemplateChange(e.target.value as TemplateKey)}
          >
            {templates.map((t) => (
              <option key={t.key} value={t.key}>
                {t.name_th} ({t.status === 'complete' ? 'ครบ' : 'โครง'})
              </option>
            ))}
          </select>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>ชื่อเรื่อง</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>เผยแพร่</label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              แสดงที่ /gift/[id]
            </label>
          </div>
          <div className="form-group">
            <label>ชื่อผู้รับ</label>
            <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
          </div>
          <div className="form-group">
            <label>ชื่อผู้ส่ง</label>
            <input value={sender} onChange={(e) => setSender(e.target.value)} />
          </div>
        </div>

        {isMemory ? (
          <MemoryPageAdminFields value={memoryContent} onChange={setMemoryContent} />
        ) : (
          <div className="form-group">
            <label>เนื้อหาเทมเพลต (JSON — ข้อความ / URL รูป)</label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={16}
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' }}
            />
          </div>
        )}

        <button type="submit" className="btn-luxury btn-luxury-filled" disabled={saving}>
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </form>

      {!isNew && gift && (
        <div className="delivery-box" style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 12 }}>ส่งมอบ</h2>
          <p className="delivery-url">{giftUrl}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
            <button type="button" className="btn-luxury" onClick={copyLink}>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</button>
            <a href={giftUrl} target="_blank" rel="noopener noreferrer" className="btn-luxury btn-luxury-filled">เปิดดู</a>
          </div>
          <div style={{ background: '#fff', padding: 16, display: 'inline-block', borderRadius: 8 }}>
            <QRCodeSVG value={giftUrl} size={160} />
          </div>
        </div>
      )}
    </div>
  )
}
