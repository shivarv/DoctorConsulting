import type { FieldErrors, PatientDetails } from '../types'

const GENDERS = ['Female', 'Male', 'Other', 'Prefer not to say']

interface StepPatientDetailsProps {
  patient: PatientDetails
  errors: FieldErrors
  onChange: (field: keyof PatientDetails, value: string) => void
}

export function StepPatientDetails({ patient, errors, onChange }: StepPatientDetailsProps) {
  return (
    <div className="step">
      <h2 className="step__title">Patient details</h2>
      <p className="step__hint">This is shared with the doctor before your consultation.</p>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Full name</span>
          <input
            type="text"
            className={errors.name ? 'field__input field__input--invalid' : 'field__input'}
            value={patient.name}
            onChange={(event) => onChange('name', event.target.value)}
          />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>

        <label className="field">
          <span className="field__label">Age</span>
          <input
            type="number"
            min={0}
            max={120}
            className={errors.age ? 'field__input field__input--invalid' : 'field__input'}
            value={patient.age}
            onChange={(event) => onChange('age', event.target.value)}
          />
          {errors.age && <span className="field__error">{errors.age}</span>}
        </label>
      </div>

      <fieldset className="field">
        <legend className="field__label">Gender</legend>
        <div className="radio-row">
          {GENDERS.map((gender) => (
            <label key={gender} className="radio-chip">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={patient.gender === gender}
                onChange={() => onChange('gender', gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
        {errors.gender && <span className="field__error">{errors.gender}</span>}
      </fieldset>

      <label className="field">
        <span className="field__label">Reason for consultation</span>
        <textarea
          className={errors.reason ? 'field__textarea field__textarea--invalid' : 'field__textarea'}
          placeholder="Symptoms, how long they've been going on, anything you've already tried."
          value={patient.reason}
          onChange={(event) => onChange('reason', event.target.value)}
        />
        {errors.reason && <span className="field__error">{errors.reason}</span>}
      </label>
    </div>
  )
}
