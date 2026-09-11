import { Navigate, Route, Routes } from 'react-router-dom'

import '../features/booking/booking.css'
import '../features/doctors/doctors.css'
import '../features/marketing/marketing.css'
import { AboutPage } from '../pages/AboutPage'
import { BookingPage } from '../pages/BookingPage'
import { DoctorDetailPage } from '../pages/DoctorDetailPage'
import { DoctorsPage } from '../pages/DoctorsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { AppLayout } from './AppLayout'
import './layout.css'

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/about" />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:doctorId" element={<DoctorDetailPage />} />
        <Route path="/conditions" element={<PlaceholderPage title="Conditions" />} />
        <Route path="/shop" element={<PlaceholderPage title="Shop" />} />
        <Route path="/testimonials" element={<PlaceholderPage title="Testimonials" />} />
        <Route path="/blog" element={<PlaceholderPage title="KIN Journal" />} />
        <Route path="/book" element={<BookingPage />} />

        {/* Destinations for the landing page's CTAs and the footer's links.
            Placeholders on purpose — a link that lands on "content coming
            soon" is honest, where a link to a route that does not exist lands
            on the 404 page and reads as a broken site. */}
        <Route path="/programs" element={<PlaceholderPage title="Wellness Programs" />} />
        <Route path="/videos" element={<PlaceholderPage title="KIN Video Library" />} />
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
        <Route path="/medical-disclaimer" element={<PlaceholderPage title="Medical Disclaimer" />} />
        <Route path="/refund-policy" element={<PlaceholderPage title="Refund & Cancellation Policy" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
