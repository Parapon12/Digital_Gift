import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi, setAdminToken } from '../../api/admin'

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@giftlove.studio')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.login(email, password)
      setAdminToken(res.token)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เข้าสู่ระบบไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section container" style={{ maxWidth: 420 }}>
      <h1 className="section-title">Admin</h1>
      <p className="section-subtitle">เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน</p>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>อีเมล</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>รหัสผ่าน</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-luxury btn-luxury-filled" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </section>
  )
}
