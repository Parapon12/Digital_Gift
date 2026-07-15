import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../../api/admin'
import { giftShareUrl } from '../../lib/shareUrl'
import type { Gift } from '../../types'

export function AdminDashboardPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState('')
  const [shareUrls, setShareUrls] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const list = await adminApi.listGifts()
      setGifts(list)
      const entries = await Promise.all(
        list.map(async (g) => [g.id, await giftShareUrl(g.public_id)] as const),
      )
      setShareUrls(Object.fromEntries(entries))
    } catch {
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id: string) => {
    if (!confirm('ลบของขวัญนี้?')) return
    await adminApi.deleteGift(id)
    load()
  }

  const urlFor = (g: Gift) => shareUrls[g.id] || ''

  const copyLink = async (g: Gift) => {
    const url = urlFor(g) || (await giftShareUrl(g.public_id))
    await navigator.clipboard.writeText(url)
    setCopiedId(g.id)
    setTimeout(() => setCopiedId(''), 1500)
  }

  return (
    <div className="container admin-page">
      <header className="admin-header">
        <div>
          <h1>ของขวัญทั้งหมด</h1>
          <p>สร้างเฉพาะลูกค้า · ลิงก์ไม่ซ้ำ · สแกน QR / คัดลอกลิงก์เปิดบนมือถือได้ (Wi‑Fi เดียวกัน)</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/gifts/new" className="btn-luxury btn-luxury-filled">สร้างของขวัญ</Link>
          <Link to="/" className="btn-luxury">หน้าเว็บ</Link>
          <button className="btn-luxury" onClick={() => { clearAdminToken(); navigate('/admin/login') }}>ออก</button>
        </div>
      </header>

      {loading ? (
        <p className="admin-loading">กำลังโหลด...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ลิงก์เฉพาะ</th>
                <th>ชื่อ</th>
                <th>ผู้รับ</th>
                <th>เทมเพลต</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gifts.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32 }}>ยังไม่มีของขวัญ — กดสร้างของขวัญ</td></tr>
              ) : gifts.map((g) => (
                <tr key={g.id}>
                  <td>
                    <strong style={{ color: 'var(--gold)' }}>{g.public_id}</strong>
                    <div style={{ marginTop: 6 }}>
                      <button
                        type="button"
                        className="btn-luxury"
                        style={{ padding: '6px 10px', fontSize: '0.65rem' }}
                        onClick={() => void copyLink(g)}
                      >
                        {copiedId === g.id ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                      </button>
                    </div>
                  </td>
                  <td>{g.title || '—'}</td>
                  <td>{g.recipient_name || '—'}</td>
                  <td>{g.template_key}</td>
                  <td>{g.is_published ? 'เผยแพร่' : 'ร่าง'}</td>
                  <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <Link to={`/admin/gifts/${g.id}`} className="btn-luxury" style={{ padding: '8px 14px', fontSize: '0.65rem' }}>แก้</Link>
                    {urlFor(g) ? (
                      <a
                        href={urlFor(g)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-luxury"
                        style={{ padding: '8px 14px', fontSize: '0.65rem' }}
                      >
                        เปิด
                      </a>
                    ) : null}
                    <button className="btn-luxury" style={{ padding: '8px 14px', fontSize: '0.65rem' }} onClick={() => remove(g.id)}>ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
