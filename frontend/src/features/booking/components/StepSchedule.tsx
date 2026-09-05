import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import type { Doctor } from '../../doctors/types'
import { formatDayLabel } from '../format'
import { useAvailability } from '../hooks/useAvailability'
import type { ContactDetails, FieldErrors, ScheduleSelection } from '../types'

const WEEKDAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface StepScheduleProps {
  doctor: Doctor
  contact: ContactDetails
  schedule: ScheduleSelection
  errors: FieldErrors
  onContactChange: (field: keyof ContactDetails, value: string) => void
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export function StepSchedule({
  doctor,
  contact,
  schedule,
  errors,
  onContactChange,
  onDateChange,
  onTimeChange,
}: StepScheduleProps) {
  const { data: days, loading, error } = useAvailability(doctor.id)
  const selectedDay = days?.find((day) => day.date === schedule.date) ?? null

  // The summary Doctor has no availableDays, so derive the clinic days from
  // what the availability endpoint actually returned.
  const weekdays = [...new Set(days?.map((day) => day.weekday) ?? [])].sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a) - WEEKDAY_ORDER.indexOf(b),
  )

  return (
    <div className="step">
      <h2 className="step__title">How do we reach you?</h2>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Email</span>
          <input
            type="email"
            className={errors.email ? 'field__input field__input--invalid' : 'field__input'}
            value={contact.email}
            onChange={(event) => onContactChange('email', event.target.value)}
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>

        <label className="field">
          <span className="field__label">Mobile</span>
          <input
            type="tel"
            className={errors.mobile ? 'field__input field__input--invalid' : 'field__input'}
            value={contact.mobile}
            onChange={(event) => onContactChange('mobile', event.target.value)}
          />
          {errors.mobile && <span className="field__error">{errors.mobile}</span>}
        </label>
      </div>

      <h2 className="step__title step__title--spaced">Pick a time with {doctor.name}</h2>
      {weekdays.length > 0 && <p className="step__hint">Consults on {weekdays.join(', ')}.</p>}

      {loading && <LoadingState label="Loading available times…" />}
      {error && <ErrorState message={error.message} />}

      {days && days.length === 0 && (
        <p className="step__hint">No availability in the next four weeks.</p>
      )}

      {days && days.length > 0 && (
        <>
          <div className="field">
            <span className="field__label">Date</span>
            <ul className="date-strip">
              {days.map((day) => (
                <li key={day.date}>
                  <button
                    type="button"
                    className={
                      day.date === schedule.date ? 'date-chip date-chip--selected' : 'date-chip'
                    }
                    aria-pressed={day.date === schedule.date}
                    onClick={() => onDateChange(day.date)}
                  >
                    <span className="date-chip__weekday">{day.weekday}</span>
                    <span className="date-chip__day">{formatDayLabel(day.date)}</span>
                  </button>
                </li>
              ))}
            </ul>
            {errors.date && <span className="field__error">{errors.date}</span>}
          </div>

          {selectedDay && (
            <div className="field">
              <span className="field__label">Time</span>
              <ul className="slot-grid">
                {selectedDay.slots.map((slot) => (
                  <li key={slot.time}>
                    <button
                      type="button"
                      className={
                        slot.time === schedule.time ? 'slot slot--selected' : 'slot'
                      }
                      disabled={!slot.available}
                      aria-pressed={slot.time === schedule.time}
                      title={slot.available ? undefined : 'Already booked'}
                      onClick={() => onTimeChange(slot.time)}
                    >
                      {slot.time}
                    </button>
                  </li>
                ))}
              </ul>
              {errors.time && <span className="field__error">{errors.time}</span>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
