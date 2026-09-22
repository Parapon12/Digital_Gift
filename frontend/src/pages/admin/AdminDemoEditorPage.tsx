import { Link, useNavigate, useParams } from 'react-router-dom'
import { LoveExperienceFlowAdmin } from './LoveExperienceFlowAdmin'
import { SingleDemoExperienceAdmin } from './SingleDemoExperienceAdmin'

const FLOW_SLUGS = new Set(['love-quiz', 'love-letter', 'love-arrow', 'memory-story'])
const EXPERIENCE_SLUGS = new Set(['love-story', 'memory-page', 'birthday', 'crocodile-blessing'])

export function AdminDemoEditorPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  if (!slug) {
    navigate('/admin/demos')
    return null
  }

  if (FLOW_SLUGS.has(slug) && slug !== 'love-quiz') {
    navigate('/admin/demos/love-quiz', { replace: true })
    return null
  }

  if (slug === 'love-quiz') {
    return (
      <div className="container admin-page" style={{ maxWidth: 900 }}>
        <header className="admin-header">
          <div>
            <h1>Love Experience — ทั้ง flow</h1>
            <p>ควิซความรัก → จดหมาย → ลูกศร → Memory Story (4 หน้าต่อเนื่อง)</p>
          </div>
          <Link to="/admin/demos" className="btn-luxury">กลับรายการ</Link>
        </header>
        <LoveExperienceFlowAdmin />
      </div>
    )
  }

  if (EXPERIENCE_SLUGS.has(slug)) {
    const titles: Record<string, { h1: string; p: string }> = {
      'love-story': {
        h1: 'เรื่องราวความรัก',
        p: 'ล็อกรหัส · แดชบอร์ด · ความทรงจำ · ซองลับ',
      },
      'memory-page': {
        h1: 'หน้ารำลึกความทรงจำ',
        p: 'หัวหน้า · ไทม์ไลน์รูป · จดหมายท้าย',
      },
      birthday: {
        h1: 'วันเกิด',
        p: 'ฝนหัวใจ · Happy birthday · สมุดรูป 5 หน้า',
      },
      'crocodile-blessing': {
        h1: 'การ์ดพุงเสืออวยพร',
        p: 'แตะพุงเสือ · คำอวยพรถึงคนสำคัญหรือแฟน',
      },
    }
    const head = titles[slug]
    return (
      <div className="container admin-page" style={{ maxWidth: 900 }}>
        <header className="admin-header">
          <div>
            <h1>{head.h1}</h1>
            <p>{head.p}</p>
          </div>
          <Link to="/admin/demos" className="btn-luxury">กลับรายการ</Link>
        </header>
        <SingleDemoExperienceAdmin slug={slug} />
      </div>
    )
  }

  navigate('/admin/demos')
  return null
}
