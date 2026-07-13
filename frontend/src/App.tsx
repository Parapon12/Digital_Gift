import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import { Layout } from './components/Layout'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminGiftEditorPage } from './pages/admin/AdminGiftEditorPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { DemoPage, GiftPage } from './pages/GiftPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
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
