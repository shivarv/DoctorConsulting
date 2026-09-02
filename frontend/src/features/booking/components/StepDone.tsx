import { useState } from 'react'
import { Link } from 'react-router-dom'

import type { Doctor } from '../../doctors/types'
import { formatDayLabel } from '../format'
import type { BookingDraft } from '../types'

function makeReference(): string {
  return `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

interface StepDoneProps {
  draft: BookingDraft
  doctor: Doctor
  onBookAnother: () => void
}

export function StepDone({ draft, doctor, onBookAnother }: StepDoneProps) {
  // Generated once when this step mounts, not on every re-render.
  const [reference] = useState(makeReference)

  const { patient, contact, schedule } = draft

  return (
    <div className="step">
      <div className="done-banner">
        <span className="done-banner__tick" aria-hidden="true">
          ✓
        </span>
        <div>
          <h2 className="step__title">Booking confirmed</h2>
          <p className="step__hint">
            Reference <strong>{reference}</strong>
          </p>
        </div>
      </div>

      <dl className="detail-list done-summary">
        <div>
          <dt>Doctor</dt>
          <dd>
            {doctor.name}
            <br />
            <span className="done-summary__muted">{doctor.title}</span>
          </dd>
        </div>
        <div>
          <dt>When</dt>
          <dd>
            {schedule.date ? formatDayLabel(schedule.date) : '—'} at {schedule.time ?? '—'}
          </dd>
        </div>
        <div>
          <dt>Patient</dt>
          <dd>
            {patient.name}
            <br />
            <span className="done-summary__muted">
              {patient.age} · {patient.gender}
            </span>
          </dd>
        </div>
        <div>
          <dt>Contact</dt>
          <dd>
            {contact.email}
            <br />
            <span className="done-summary__muted">{contact.mobile}</span>
          </dd>
        </div>
        <div className="done-summary__wide">
          <dt>Reason</dt>
          <dd>{patient.reason}</dd>
        </div>
        <div>
          <dt>Fee</dt>
          <dd>₹{doctor.consultationFee} — not charged</dd>
        </div>
      </dl>

      <p className="done-note">
        This booking isn’t saved to a server yet, so it won’t appear anywhere else.
      </p>

      <div className="step__actions">
        <button type="button" className="button" onClick={onBookAnother}>
          Book another
        </button>
        <Link className="button button--ghost" to="/doctors">
          Back to doctors
        </Link>
      </div>
    </div>
  )
}
