import type { Doctor } from '../../doctors/types'

interface DoctorPickerRowProps {
  doctor: Doctor
  selected: boolean
  onSelect: () => void
}

export function DoctorPickerRow({ doctor, selected, onSelect }: DoctorPickerRowProps) {
  return (
    <button
      type="button"
      className={selected ? 'picker-row picker-row--selected' : 'picker-row'}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <img className="picker-row__photo" src={doctor.photoUrl} alt="" loading="lazy" />

      <span className="picker-row__main">
        <span className="picker-row__name">{doctor.name}</span>
        <span className="picker-row__title">{doctor.title}</span>
        <span className="chip-list">
          {doctor.specialities.map((speciality) => (
            <span key={speciality.slug} className="chip-tag">
              {speciality.label}
            </span>
          ))}
        </span>
      </span>

      <span className="picker-row__end">
        <span className="picker-row__fee">₹{doctor.consultationFee}</span>
        <span className="picker-row__location">{doctor.location}</span>
      </span>
    </button>
  )
}
