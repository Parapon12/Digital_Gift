import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { Layout } from './components/Layout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminDemoEditorPage } from './pages/admin/AdminDemoEditorPage'
import { AdminDemoListPage } from './pages/admin/AdminDemoListPage'
import { AdminGiftEditorPage } from './pages/admin/AdminGiftEditorPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { DemoPage, GiftPage } from './pages/GiftPage'
import { HomePage } from './pages/HomePage'

const routerBasename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={routerBasename === '/' ? undefined : routerBasename}>
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
    </BrowserRouter>
  )
}
