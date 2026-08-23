import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi, clearAdminToken } from '../../api/admin'
import { groupCatalogDemos } from '../../data/demos'
import type { DemoContent } from '../../types'

function DemoRow({ d }: { d: DemoContent }) {
  const isFlow = d.demo_slug === 'love-quiz'
  const editTo = isFlow ? '/admin/demos/love-quiz' : `/admin/demos/${d.demo_slug}`
  const editLabel = isFlow ? 'แก้ flow (4 หน้า)' : 'แก้ทั้งเทมเพลต'

  return (
    <tr>
      <td>
        <strong style={{ color: 'var(--gold)' }}>{d.demo_slug}</strong>
      </td>
      <td>{d.template_key}</td>
      <td>{d.title || '—'}</td>
      <td>{new Date(d.updated_at).toLocaleString('th-TH')}</td>
      <td style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link
          to={editTo}
          className="btn-luxury btn-luxury-filled"
          style={{ padding: '8px 14px', fontSize: '0.65rem' }}
        >
          {editLabel}
        </Link>
        <a
          href={`/demo/${d.demo_slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury"
          style={{ padding: '8px 14px', fontSize: '0.65rem' }}
        >
          ดูตัวอย่าง
        </a>
      </td>
    </tr>
  )
}

export function AdminDemoListPage() {
  const [demos, setDemos] = useState<DemoContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const sections = useMemo(() => groupCatalogDemos(demos), [demos])

  useEffect(() => {
    adminApi
      .listDemos()
      .then(setDemos)
      .catch((err) => {
        if (err instanceof Error && err.message === 'unauthorized') {
          navigate('/admin/login')
          return
        }
        setError(err instanceof Error ? err.message : 'โหลดรายการ demo ไม่สำเร็จ — ลองรีสตาร์ท backend')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  return (
    <div className="container admin-page">
      <header className="admin-header">
        <div>
          <h1>แก้ไขตัวอย่าง</h1>
          <p>
            แก้ทีละช่วงตามหน้าจอ — รูปและข้อความ · ไม่กระทบของขวัญลูกค้า
          </p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin" className="btn-luxury">ของขวัญลูกค้า</Link>
          <Link to="/" className="btn-luxury">หน้าเว็บ</Link>
          <button
            type="button"
            className="btn-luxury"
            onClick={() => {
              clearAdminToken()
              navigate('/admin/login')
            }}
          >
            ออก
          </button>
        </div>
      </header>

      <div className="admin-demo-intro">
        <p>
          ทุกเทมเพลตแก้แบบ <strong>ทีละช่วง</strong> เหมือน Love Experience ·
          บันทึกแล้วมีผลที่ <code>/demo/...</code> ทันที
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="admin-loading">กำลังโหลด...</p>
      ) : demos.length === 0 ? (
        <p className="admin-loading">ยังไม่มีข้อมูล — รีสตาร์ท backend เพื่อ seed ตัวอย่าง</p>
      ) : (
        sections.map(({ group, items }) => (
          <div key={group.id} className="admin-demo-section">
            <header className="admin-demo-section-head">
              <h2>{group.title}</h2>
              <p>{group.help}</p>
              {group.id === 'flow' ? (
                <Link to="/admin/demos/love-quiz" className="btn-luxury btn-luxury-filled" style={{ marginTop: 10, display: 'inline-block' }}>
                  แก้ทั้ง flow (4 หน้า)
                </Link>
              ) : null}
            </header>
            {group.id === 'flow' ? (
              <p className="mp-admin-help" style={{ marginBottom: 12 }}>
                แก้ครบทุกหน้าใน flow ได้ที่ปุ่มด้านบน — รวมรูปพื้นหลังควิซ รูปชนะ จดหมาย ลูกศร และ Memory Story
              </p>
            ) : null}
            {group.id !== 'flow' ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Demo</th>
                    <th>เทมเพลต</th>
                    <th>ชื่อเรื่อง</th>
                    <th>อัปเดตล่าสุด</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 24 }}>
                        ยังไม่มีข้อมูลในกลุ่มนี้ — รีสตาร์ท backend
                      </td>
                    </tr>
                  ) : (
                    items.map((d) => <DemoRow key={d.demo_slug} d={d} />)
                  )}
                </tbody>
              </table>
            </div>
            ) : null}
          </div>
        ))
      )}
    </div>
  )
}
