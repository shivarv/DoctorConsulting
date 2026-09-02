import { Link } from 'react-router-dom'

import type { Doctor } from '../types'

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link className="doctor-card" to={`/doctors/${doctor.id}`}>
      <img className="doctor-card__photo" src={doctor.photoUrl} alt="" loading="lazy" />

      <div className="doctor-card__body">
        <h3 className="doctor-card__name">{doctor.name}</h3>
        <p className="doctor-card__title">{doctor.title}</p>

        <ul className="chip-list">
          {doctor.specialities.map((speciality) => (
            <li key={speciality.slug} className="chip-tag">
              {speciality.label}
            </li>
          ))}
        </ul>

        <p className="doctor-card__meta">
          <span>{doctor.location}</span>
          <span aria-hidden="true">·</span>
          <span>{doctor.experienceYears} yrs</span>
          <span aria-hidden="true">·</span>
          <span className="doctor-card__rating">
            ★ {doctor.rating.toFixed(1)}{' '}
            <span className="doctor-card__reviews">({doctor.reviewCount})</span>
          </span>
        </p>

        <div className="doctor-card__foot">
          <span className="doctor-card__fee">₹{doctor.consultationFee}</span>
          <span className="doctor-card__cta">View profile →</span>
        </div>
      </div>
    </Link>
  )
}
