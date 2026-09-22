import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'

const AdminLayout = lazy(() =>
  import('./components/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminLoginPage = lazy(() =>
  import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
)
const AdminDashboardPage = lazy(() =>
  import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminDemoListPage = lazy(() =>
  import('./pages/admin/AdminDemoListPage').then((m) => ({ default: m.AdminDemoListPage })),
)
const AdminDemoEditorPage = lazy(() =>
  import('./pages/admin/AdminDemoEditorPage').then((m) => ({ default: m.AdminDemoEditorPage })),
)
const AdminGiftEditorPage = lazy(() =>
  import('./pages/admin/AdminGiftEditorPage').then((m) => ({ default: m.AdminGiftEditorPage })),
)
const DemoPage = lazy(() => import('./pages/GiftPage').then((m) => ({ default: m.DemoPage })))
const GiftPage = lazy(() => import('./pages/GiftPage').then((m) => ({ default: m.GiftPage })))

const routerBasename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

function RouteFallback() {
  return (
    <p className="section container" style={{ textAlign: 'center', padding: 48 }}>
      กำลังโหลด...
    </p>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename === '/' ? undefined : routerBasename}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="demos" element={<AdminDemoListPage />} />
            <Route path="demos/:slug" element={<AdminDemoEditorPage />} />
            <Route path="gifts/new" element={<AdminGiftEditorPage />} />
            <Route path="gifts/:id" element={<AdminGiftEditorPage />} />
          </Route>

          <Route path="/gift/:id" element={<GiftPage />} />
          <Route path="/demo/:slug" element={<DemoPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
