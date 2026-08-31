import { Navigate, Route, Routes } from 'react-router-dom'

import '../features/bundles/bundles.css'
import { BundleDetailPage } from '../pages/BundleDetailPage'
import { BundleListPage } from '../pages/BundleListPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/bundles" />} />
      <Route path="/bundles" element={<BundleListPage />} />
      <Route path="/bundles/:slug" element={<BundleDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
