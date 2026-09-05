import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { useDoctor } from '../features/doctors/hooks/useDoctor'

export function DoctorDetailPage() {
  const { doctorId = '' } = useParams<{ doctorId: string }>()
  const { data: doctor, loading, error } = useDoctor(doctorId)

  if (loading) {
    return (
      <main className="page">
        <LoadingState label="Loading profile…" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <Link className="back-link" to="/doctors">
          ← All doctors
        </Link>
        {error.status === 404 ? (
          <EmptyState title="Doctor not found">
            <p>
              There is no doctor with the id <code>{doctorId}</code>.
            </p>
          </EmptyState>
        ) : (
          <ErrorState message={error.message} />
        )}
      </main>
    )
  }

  if (!doctor) {
    return null
  }

  return (
    <main className="page">
      <Link className="back-link" to="/doctors">
        ← All doctors
      </Link>

      <div className="doctor-profile">
        <div className="doctor-profile__aside">
          <img className="doctor-profile__photo" src={doctor.photoUrl} alt={doctor.name} />

          <div className="doctor-profile__booking">
            <p className="doctor-profile__fee">
              ₹{doctor.consultationFee}
              <span className="doctor-profile__fee-unit"> / consultation</span>
            </p>
            <Link className="button button--cta button--block" to={`/book?doctor=${doctor.id}`}>
              Book Consultation
            </Link>
            <p className="doctor-profile__availability">
              Available {doctor.availableDays.join(', ')}
            </p>
          </div>
        </div>

        <div className="doctor-profile__main">
          <h1 className="page__title">{doctor.name}</h1>
          <p className="page__subtitle">{doctor.title}</p>

          <p className="doctor-profile__rating">
            ★ {doctor.rating.toFixed(1)}
            <span className="doctor-card__reviews"> ({doctor.reviewCount} reviews)</span>
          </p>

          <ul className="chip-list">
            {doctor.specialities.map((speciality) => (
              <li key={speciality.slug} className="chip-tag">
                {speciality.label}
              </li>
            ))}
          </ul>

          <section className="doctor-profile__section">
            <h2 className="doctor-profile__heading">About</h2>
            <p>{doctor.bio}</p>
          </section>

          <section className="doctor-profile__section">
            <h2 className="doctor-profile__heading">Details</h2>
            <dl className="detail-list">
              <div>
                <dt>Location</dt>
                <dd>{doctor.location}</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>{doctor.experienceYears} years</dd>
              </div>
              <div>
                <dt>Languages</dt>
                <dd>{doctor.languages.join(', ')}</dd>
              </div>
              <div>
                <dt>Consults on</dt>
                <dd>{doctor.availableDays.join(', ')}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  )
}
