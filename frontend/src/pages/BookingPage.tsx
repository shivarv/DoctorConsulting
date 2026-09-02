import { useSearchParams } from 'react-router-dom'

import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { BookingWizard } from '../features/booking/components/BookingWizard'
import { useDoctors } from '../features/doctors/hooks/useDoctors'

export function BookingPage() {
  const [params] = useSearchParams()
  const { data: doctors, loading, error } = useDoctors()

  const preselectId = params.get('doctor')
  // An unrecognised id falls through to null, so the wizard starts at step one
  // rather than opening a booking with no doctor attached.
  const initialDoctor = doctors?.find((doctor) => doctor.id === preselectId) ?? null

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Book a consultation</h1>
      </header>

      {loading && <LoadingState label="Loading doctors…" />}
      {error && <ErrorState message={error.message} />}

      {/* Mounted only once doctors are loaded, so the wizard's initial step is
          decided with the preselected doctor already resolved. */}
      {doctors && (
        <BookingWizard
          key={initialDoctor?.id ?? 'none'}
          doctors={doctors}
          initialDoctor={initialDoctor}
        />
      )}
    </main>
  )
}
