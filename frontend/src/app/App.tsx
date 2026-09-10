import { Navigate, Route, Routes } from 'react-router-dom'

import '../features/booking/booking.css'
import '../features/doctors/doctors.css'
import { AboutPage } from '../pages/AboutPage'
import '../pages/about.css'
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
        <Route path="/blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="/book" element={<BookingPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
