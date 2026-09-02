import type { Doctor } from '../doctors/types'

export const STEPS = [
  { id: 'doctor', label: 'Select Doctor' },
  { id: 'details', label: 'Patient Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'payment', label: 'Payment' },
  { id: 'done', label: 'Done' },
] as const

export type StepId = (typeof STEPS)[number]['id']

export interface PatientDetails {
  name: string
  age: string
  gender: string
  reason: string
}

export interface ContactDetails {
  email: string
  mobile: string
}

export interface ScheduleSelection {
  date: string | null
  time: string | null
}

export interface BookingDraft {
  doctor: Doctor | null
  patient: PatientDetails
  contact: ContactDetails
  schedule: ScheduleSelection
}

export type FieldErrors = Record<string, string>

export interface TimeSlot {
  time: string
  available: boolean
}

export interface DaySlots {
  /** ISO date, e.g. "2026-09-03". */
  date: string
  weekday: string
  slots: TimeSlot[]
}
