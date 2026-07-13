import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../../api/admin'
import type { Gift } from '../../types'

export function AdminDashboardPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      setGifts(await adminApi.listGifts())
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

  return (
    <div className="container admin-page">
      <header className="admin-header">
        <div>
          <h1>ของขวัญทั้งหมด</h1>
          <p>สร้าง แก้ไข ส่งมอบลิงก์ให้ลูกค้า</p>
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
                <th>รหัส</th>
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
                  <td><strong style={{ color: 'var(--gold)' }}>{g.public_id}</strong></td>
                  <td>{g.title || '—'}</td>
                  <td>{g.recipient_name || '—'}</td>
                  <td>{g.template_key}</td>
                  <td>{g.is_published ? 'เผยแพร่' : 'ร่าง'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/admin/gifts/${g.id}`} className="btn-luxury" style={{ padding: '8px 14px', fontSize: '0.65rem' }}>แก้</Link>
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
