import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { adminApi } from '../../api/admin'
import { api } from '../../api/client'
import { giftShareUrl } from '../../lib/shareUrl'
import {
  defaultContent,
  type BirthdayContent,
  type Gift,
  type LoveAdventureContent,
  type LoveQuizContent,
  type LoveStoryContent,
  type MemoryPageContent,
  type OccasionContent,
  type TemplateInfo,
  type TemplateKey,
} from '../../types'
import { BirthdayAdminFields } from './BirthdayAdminFields'
import { LoveAdventureAdminFields } from './LoveAdventureAdminFields'
import { LoveQuizAdminFields } from './LoveQuizAdminFields'
import { LoveStoryAdminFields } from './LoveStoryAdminFields'
import { MemoryPageAdminFields } from './MemoryPageAdminFields'
import { OccasionAdminFields } from './OccasionAdminFields'

function isOccasion(key: TemplateKey) {
  return key === 'graduation' || key === 'proposal'
}

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
  const [contentText, setContentText] = useState(JSON.stringify(defaultContent('love_adventure_3d'), null, 2))
  const [memoryContent, setMemoryContent] = useState<MemoryPageContent>(
    defaultContent('memory_page') as MemoryPageContent,
  )
  const [quizContent, setQuizContent] = useState<LoveQuizContent>(
    defaultContent('love_quiz') as LoveQuizContent,
  )
  const [storyContent, setStoryContent] = useState<LoveStoryContent>(
    defaultContent('love_story') as LoveStoryContent,
  )
  const [occasionContent, setOccasionContent] = useState<OccasionContent>(
    defaultContent('graduation') as OccasionContent,
  )
  const [birthdayContent, setBirthdayContent] = useState<BirthdayContent>(
    defaultContent('birthday') as BirthdayContent,
  )
  const [adventureContent, setAdventureContent] = useState<LoveAdventureContent>(
    defaultContent('love_adventure_3d') as LoveAdventureContent,
  )
  const [gift, setGift] = useState<Gift | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [giftUrl, setGiftUrl] = useState('')

  const useForm =
    templateKey === 'memory_page' ||
    templateKey === 'love_quiz' ||
    templateKey === 'love_story' ||
    templateKey === 'love_adventure_3d' ||
    templateKey === 'birthday' ||
    isOccasion(templateKey)

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
        const raw = (g.content || {}) as Record<string, unknown>
        setContentText(JSON.stringify(raw, null, 2))
        if (g.template_key === 'memory_page') {
          setMemoryContent({
            ...(defaultContent('memory_page') as MemoryPageContent),
            ...(raw as MemoryPageContent),
          })
        } else if (g.template_key === 'love_quiz') {
          setQuizContent({
            ...(defaultContent('love_quiz') as LoveQuizContent),
            ...(raw as LoveQuizContent),
          })
        } else if (g.template_key === 'love_story') {
          setStoryContent({
            ...(defaultContent('love_story') as LoveStoryContent),
            ...(raw as LoveStoryContent),
          })
        } else if (g.template_key === 'birthday') {
          setBirthdayContent({
            ...(defaultContent('birthday') as BirthdayContent),
            ...(raw as BirthdayContent),
          })
        } else if (isOccasion(g.template_key)) {
          setOccasionContent({
            ...(defaultContent(g.template_key) as OccasionContent),
            ...(raw as OccasionContent),
          })
        } else if (g.template_key === 'love_adventure_3d') {
          setAdventureContent({
            ...(defaultContent('love_adventure_3d') as LoveAdventureContent),
            ...(raw as LoveAdventureContent),
          })
        }
      })
      .catch(() => navigate('/admin/login'))
  }, [id, isNew, navigate])

  useEffect(() => {
    if (!gift?.public_id) {
      setGiftUrl('')
      return
    }
    let alive = true
    giftShareUrl(gift.public_id).then((url) => {
      if (alive) setGiftUrl(url)
    })
    return () => {
      alive = false
    }
  }, [gift?.public_id])

  const shareHint = useMemo(() => {
    if (!giftUrl) return ''
    if (/localhost|127\.0\.0\.1/i.test(giftUrl)) {
      return 'ลิงก์นี้เป็น localhost — มือถือสแกนไม่ได้ ตรวจสอบว่าคอมกับมือถืออยู่ Wi‑Fi เดียวกัน แล้วรีเฟรชหน้านี้'
    }
    return 'ลิงก์นี้ใช้ IP ในเครือข่าย — สแกน QR หรือคัดลอกส่งมือถือได้ (อยู่ Wi‑Fi เดียวกัน)'
  }, [giftUrl])

  const onTemplateChange = (key: TemplateKey) => {
    setTemplateKey(key)
    if (!isNew) return
    const base = defaultContent(key)
    setContentText(JSON.stringify(base, null, 2))
    if (key === 'memory_page') setMemoryContent(base as MemoryPageContent)
    if (key === 'love_quiz') setQuizContent(base as LoveQuizContent)
    if (key === 'love_story') setStoryContent(base as LoveStoryContent)
    if (isOccasion(key)) setOccasionContent(base as OccasionContent)
    if (key === 'birthday') setBirthdayContent(base as BirthdayContent)
    if (key === 'love_adventure_3d') setAdventureContent(base as LoveAdventureContent)
  }

  const buildContent = (): Record<string, unknown> => {
    if (templateKey === 'memory_page') {
      return {
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
    }
    if (templateKey === 'love_quiz') {
      return {
        ...quizContent,
        photos: (quizContent.photos || []).map((p) => p.trim()).filter(Boolean),
      }
    }
    if (templateKey === 'love_story') {
      return {
        ...storyContent,
        memories: (storyContent.memories || [])
          .filter((m) => m.title.trim() || m.text.trim())
          .map((m) => ({
            ...m,
            title: m.title.trim(),
            text: m.text.trim(),
            imageUrl: m.imageUrl?.trim() || undefined,
          })),
        capsules: (storyContent.capsules || [])
          .filter((c) => c.title.trim() || (c.text || '').trim())
          .map((c) => ({
            ...c,
            id: c.id || crypto.randomUUID(),
            title: c.title.trim(),
            text: c.text?.trim() || '',
          })),
      }
    }
    if (templateKey === 'love_adventure_3d') {
      const memories = (adventureContent.memories || [])
        .map((m) => ({
          title: m.title.trim(),
          text: m.text.trim(),
          imageUrl: m.imageUrl?.trim() || undefined,
        }))
        .filter((m) => m.title && m.text)
        .slice(0, 5)
      if (memories.length < 3) {
        throw new Error('ผจญภัย 3D ต้องมีความทรงจำอย่างน้อย 3 จุด (หัวข้อ + ข้อความ)')
      }
      return {
        message: adventureContent.message?.trim() || '',
        catName: adventureContent.catName?.trim() || 'Mochi',
        musicUrl: adventureContent.musicUrl?.trim() || undefined,
        memories,
      }
    }
    if (templateKey === 'birthday') {
      return {
        ...birthdayContent,
        photos: (birthdayContent.photos || []).map((p) => p.trim()).filter(Boolean),
        headline: birthdayContent.headline?.trim() || '',
        message: birthdayContent.message?.trim() || '',
        closingMessage: birthdayContent.closingMessage?.trim() || '',
        specialMessage: birthdayContent.specialMessage?.trim() || '',
        heroImageUrl: birthdayContent.heroImageUrl?.trim() || undefined,
        giftImageUrl: birthdayContent.giftImageUrl?.trim() || undefined,
      }
    }
    if (isOccasion(templateKey)) {
      return {
        ...occasionContent,
        photos: (occasionContent.photos || []).map((p) => p.trim()).filter(Boolean),
      }
    }
    return JSON.parse(contentText) as Record<string, unknown>
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const content = buildContent()

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
            กรอกข้อความและอัปโหลดรูปได้เลย — แต่ละลูกค้าได้ลิงก์เฉพาะตัว ไม่ใช้ร่วมกัน
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
            <label>ชื่อเรื่อง (ภายในแอดมิน)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ของขวัญคุณมิ้นต์"
              required
            />
          </div>
          <div className="form-group">
            <label>เผยแพร่</label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              เปิดลิงก์ให้คนรับเข้าได้
            </label>
          </div>
          <div className="form-group">
            <label>ชื่อผู้รับ</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="เธอ"
              required
            />
          </div>
          <div className="form-group">
            <label>ชื่อผู้ส่ง</label>
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="ฉัน"
            />
          </div>
        </div>

        {templateKey === 'memory_page' ? (
          <MemoryPageAdminFields value={memoryContent} onChange={setMemoryContent} />
        ) : null}
        {templateKey === 'love_quiz' ? (
          <LoveQuizAdminFields value={quizContent} onChange={setQuizContent} />
        ) : null}
        {templateKey === 'love_story' ? (
          <LoveStoryAdminFields value={storyContent} onChange={setStoryContent} />
        ) : null}
        {templateKey === 'love_adventure_3d' ? (
          <LoveAdventureAdminFields value={adventureContent} onChange={setAdventureContent} />
        ) : null}
        {templateKey === 'birthday' ? (
          <BirthdayAdminFields value={birthdayContent} onChange={setBirthdayContent} />
        ) : null}
        {isOccasion(templateKey) ? (
          <OccasionAdminFields value={occasionContent} onChange={setOccasionContent} />
        ) : null}
        {!useForm ? (
          <div className="form-group">
            <label>เนื้อหาเทมเพลต (JSON — สำหรับ {templateKey})</label>
            <textarea
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={16}
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.85rem' }}
            />
          </div>
        ) : null}

        <button type="submit" className="btn-luxury btn-luxury-filled" disabled={saving}>
          {saving ? 'กำลังบันทึก...' : isNew ? 'สร้างและได้ลิงก์เฉพาะ' : 'บันทึก'}
        </button>
      </form>

      {!isNew && gift && (
        <div className="delivery-box" style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 8 }}>ส่งมอบให้ลูกค้านี้เท่านั้น</h2>
          <p style={{ opacity: 0.8, marginBottom: 12, fontSize: '0.95rem' }}>
            รหัสลิงก์ <strong>{gift.public_id}</strong> สร้างเฉพาะของขวัญนี้ — คนละลูกค้า = คนละลิงก์
          </p>
          <p className="delivery-url">{giftUrl || 'กำลังสร้างลิงก์สำหรับมือถือ…'}</p>
          {shareHint ? (
            <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: 8, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
              {shareHint}
            </p>
          ) : null}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
            <button type="button" className="btn-luxury" onClick={copyLink} disabled={!giftUrl}>
              {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
            </button>
            {giftUrl ? (
              <a href={giftUrl} target="_blank" rel="noopener noreferrer" className="btn-luxury btn-luxury-filled">
                เปิดดู
              </a>
            ) : null}
          </div>
          {giftUrl ? (
            <div style={{ background: '#fff', padding: 16, display: 'inline-block', borderRadius: 8 }}>
              <QRCodeSVG value={giftUrl} size={160} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
