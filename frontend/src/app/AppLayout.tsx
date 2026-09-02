import { Outlet } from 'react-router-dom'

import { SiteHeader } from './SiteHeader'

export function AppLayout() {
  return (
    <div className="app">
      <SiteHeader />
      <div className="app__body">
        <Outlet />
      </div>
      <footer className="app__footer">
        <p>© {new Date().getFullYear()} DoctorConsulting</p>
      </footer>
    </div>
  )
}
