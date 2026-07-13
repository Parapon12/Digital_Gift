import { Outlet } from 'react-router-dom'
import { BackgroundEffects } from './BackgroundEffects'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <>
      <BackgroundEffects />
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
