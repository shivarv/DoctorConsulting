import { useState } from 'react'

import type { Doctor } from '../../doctors/types'
import { DoctorPickerRow } from './DoctorPickerRow'

interface StepSelectDoctorProps {
  doctors: Doctor[]
  selectedId: string | null
  error?: string
  onSelect: (doctor: Doctor) => void
}

export function StepSelectDoctor({ doctors, selectedId, error, onSelect }: StepSelectDoctorProps) {
  const [query, setQuery] = useState('')

  const needle = query.trim().toLowerCase()
  const results = needle
    ? doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(needle) ||
          doctor.title.toLowerCase().includes(needle) ||
          doctor.location.toLowerCase().includes(needle) ||
          doctor.specialities.some((speciality) =>
            speciality.label.toLowerCase().includes(needle),
          ),
      )
    : doctors

  return (
    <div className="step">
      <h2 className="step__title">Who would you like to see?</h2>
      <p className="step__hint">Search by name, speciality or city.</p>

      <label className="field">
        <span className="field__label">Search</span>
        <input
          type="search"
          className="field__input"
          placeholder="Diabetes, Chennai, Dr. Menon…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {error && <p className="field__error">{error}</p>}

      {results.length === 0 ? (
        <p className="step__hint">No doctors match “{query}”.</p>
      ) : (
        <ul className="picker-list">
          {results.map((doctor) => (
            <li key={doctor.id}>
              <DoctorPickerRow
                doctor={doctor}
                selected={doctor.id === selectedId}
                onSelect={() => onSelect(doctor)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
