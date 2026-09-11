import { Outlet } from 'react-router-dom'

import { ScrollToHash } from './ScrollToHash'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppLayout() {
  return (
    <div className="app">
      <ScrollToHash />
      <SiteHeader />
      <div className="app__body">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  )
}
