import { Navigate, Route, Routes, useParams } from 'react-router-dom'

import '../features/booking/booking.css'
import '../features/bundles/bundles.css'
import '../features/doctors/doctors.css'
import { BookingPage } from '../pages/BookingPage'
import { BundleDetailPage } from '../pages/BundleDetailPage'
import { BundleListPage } from '../pages/BundleListPage'
import { DoctorDetailPage } from '../pages/DoctorDetailPage'
import { DoctorsPage } from '../pages/DoctorsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { AppLayout } from './AppLayout'
import './layout.css'

/** The bundle pages used to live at /bundles; keep those URLs working. */
function LegacyBundleRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate replace to={slug ? `/shop/${slug}` : '/shop'} />
}

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/about" />} />

        <Route path="/about" element={<PlaceholderPage title="About" />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/conditions" element={<PlaceholderPage title="Conditions" />} />
        <Route path="/shop" element={<BundleListPage />} />
        <Route path="/shop/:slug" element={<BundleDetailPage />} />
        <Route path="/testimonials" element={<PlaceholderPage title="Testimonials" />} />
        <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="/book" element={<BookingPage />} />

        <Route path="/bundles" element={<LegacyBundleRedirect />} />
        <Route path="/bundles/:slug" element={<LegacyBundleRedirect />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
