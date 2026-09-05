import { useState } from 'react'

import type { Doctor } from '../../doctors/types'
import {
  STEPS,
  type BookingDraft,
  type ContactDetails,
  type FieldErrors,
  type PatientDetails,
  type StepId,
} from '../types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MIN_MOBILE_DIGITS = 8

function emptyDraft(doctor: Doctor | null): BookingDraft {
  return {
    doctor,
    patient: { name: '', age: '', gender: '', reason: '' },
    contact: { email: '', mobile: '' },
    schedule: { date: null, time: null },
  }
}

function validateDetails(draft: BookingDraft): FieldErrors {
  const errors: FieldErrors = {}
  const { name, age, gender, reason } = draft.patient

  if (!name.trim()) {
    errors.name = 'Please enter the patient name.'
  }

  if (!age.trim()) {
    errors.age = 'Please enter an age.'
  } else {
    const parsed = Number(age)
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 120) {
      errors.age = 'Enter a whole number between 0 and 120.'
    }
  }

  if (!gender) {
    errors.gender = 'Please select a gender.'
  }

  if (!reason.trim()) {
    errors.reason = 'Tell the doctor what this is about.'
  }

  return errors
}

function validateSchedule(draft: BookingDraft): FieldErrors {
  const errors: FieldErrors = {}

  if (!EMAIL_PATTERN.test(draft.contact.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (draft.contact.mobile.replace(/\D/g, '').length < MIN_MOBILE_DIGITS) {
    errors.mobile = 'Enter a valid mobile number.'
  }

  if (!draft.schedule.date) {
    errors.date = 'Pick a date.'
  } else if (!draft.schedule.time) {
    errors.time = 'Pick a time.'
  }

  return errors
}

function validate(stepId: StepId, draft: BookingDraft): FieldErrors {
  switch (stepId) {
    case 'doctor':
      return draft.doctor ? {} : { doctor: 'Please choose a doctor.' }
    case 'details':
      return validateDetails(draft)
    case 'schedule':
      return validateSchedule(draft)
    default:
      return {}
  }
}

export function useBookingFlow(initialDoctor: Doctor | null) {
  // Arriving from a doctor profile skips Select Doctor.
  const firstStep = initialDoctor ? 1 : 0

  const [stepIndex, setStepIndex] = useState(firstStep)
  const [furthestIndex, setFurthestIndex] = useState(firstStep)
  const [draft, setDraft] = useState<BookingDraft>(() => emptyDraft(initialDoctor))
  const [errors, setErrors] = useState<FieldErrors>({})

  const currentStep = STEPS[stepIndex]

  const advance = () => {
    const target = Math.min(stepIndex + 1, STEPS.length - 1)
    setStepIndex(target)
    setFurthestIndex((furthest) => Math.max(furthest, target))
  }

  const next = () => {
    const found = validate(currentStep.id, draft)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      return
    }
    advance()
  }

  const back = () => {
    setErrors({})
    setStepIndex((index) => Math.max(index - 1, firstStep))
  }

  const goTo = (target: number) => {
    // Only backwards, and never out of the terminal step.
    if (target >= stepIndex || target < firstStep || currentStep.id === 'done') {
      return
    }
    setErrors({})
    setStepIndex(target)
  }

  const reset = () => {
    setDraft(emptyDraft(initialDoctor))
    setStepIndex(firstStep)
    setFurthestIndex(firstStep)
    setErrors({})
  }

  return {
    steps: STEPS,
    stepIndex,
    furthestIndex,
    currentStep,
    firstStep,
    draft,
    errors,
    next,
    back,
    goTo,
    reset,
    // Picking a doctor is the whole of step one, so the click carries straight
    // on rather than asking for a second confirmation of a choice just made.
    // It advances directly instead of going through `next`, which would
    // validate the draft from before this update and find no doctor on it.
    chooseDoctor: (doctor: Doctor) => {
      setDraft((current) => ({ ...current, doctor }))
      setErrors({})
      advance()
    },
    setPatientField: (field: keyof PatientDetails, value: string) =>
      setDraft((current) => ({ ...current, patient: { ...current.patient, [field]: value } })),
    setContactField: (field: keyof ContactDetails, value: string) =>
      setDraft((current) => ({ ...current, contact: { ...current.contact, [field]: value } })),
    // Changing the date clears the time — a slot from another day may not exist.
    setDate: (date: string) => setDraft((current) => ({ ...current, schedule: { date, time: null } })),
    setTime: (time: string) =>
      setDraft((current) => ({ ...current, schedule: { ...current.schedule, time } })),
  }
}
