import { Navigate, Outlet } from 'react-router-dom'
import { getAdminToken } from '../api/admin'
import { BackgroundEffects } from './BackgroundEffects'

export function AdminLayout() {
  const token = getAdminToken()
  if (!token) return <Navigate to="/admin/login" replace />

  return (
    <>
      <BackgroundEffects />
      <div className="admin-layout">
        <Outlet />
      </div>
    </>
  )
}
