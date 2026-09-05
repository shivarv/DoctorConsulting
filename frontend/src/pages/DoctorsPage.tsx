import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { DoctorCard } from '../features/doctors/components/DoctorCard'
import { DoctorFilters } from '../features/doctors/components/DoctorFilters'
import { useDoctorFilters } from '../features/doctors/hooks/useDoctorFilters'
import { useDoctors } from '../features/doctors/hooks/useDoctors'

export function DoctorsPage() {
  const { data: doctors, loading, error } = useDoctors()
  const filters = useDoctorFilters(doctors)

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Our Doctors</h1>
        <p className="page__subtitle">
          Find a specialist by condition or location, and book a consultation.
        </p>
      </header>

      {loading && <LoadingState label="Loading doctors…" />}

      {error && <ErrorState message={error.message} />}

      {doctors && (
        <div className="doctors-layout">
          <DoctorFilters filters={filters} totalCount={doctors.length} />

          <section className="doctors-results" aria-label="Doctors">
            {filters.results.length === 0 ? (
              <EmptyState title="No doctors match those filters">
                <p>Try removing a condition or widening the location.</p>
                <button type="button" className="button" onClick={filters.clearAll}>
                  Clear all filters
                </button>
              </EmptyState>
            ) : (
              <ul className="doctor-grid">
                {filters.results.map((doctor) => (
                  <li key={doctor.id}>
                    <DoctorCard doctor={doctor} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
