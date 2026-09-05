import { useSearchParams } from 'react-router-dom'

import type { Doctor } from '../types'

const QUERY_KEY = 'q'
const CONDITION_KEY = 'condition'
const LOCATION_KEY = 'location'

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface DoctorFiltersState {
  query: string
  conditions: string[]
  locations: string[]
  activeCount: number
  conditionOptions: FilterOption[]
  locationOptions: FilterOption[]
  results: Doctor[]
  setQuery: (value: string) => void
  toggleCondition: (slug: string) => void
  toggleLocation: (location: string) => void
  clearAll: () => void
}

function matchesQuery(doctor: Doctor, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }
  return (
    doctor.name.toLowerCase().includes(needle) ||
    doctor.title.toLowerCase().includes(needle) ||
    doctor.location.toLowerCase().includes(needle) ||
    doctor.specialities.some((speciality) => speciality.label.toLowerCase().includes(needle))
  )
}

function matchesConditions(doctor: Doctor, conditions: string[]): boolean {
  if (conditions.length === 0) {
    return true
  }
  // OR within the group: two conditions ticked means "treats either".
  return doctor.specialities.some((speciality) => conditions.includes(speciality.slug))
}

function matchesLocations(doctor: Doctor, locations: string[]): boolean {
  return locations.length === 0 || locations.includes(doctor.location)
}

function countBy(doctors: Doctor[], value: string, key: 'condition' | 'location'): number {
  return doctors.filter((doctor) =>
    key === 'condition'
      ? doctor.specialities.some((speciality) => speciality.slug === value)
      : doctor.location === value,
  ).length
}

export function useDoctorFilters(doctors: Doctor[] | null): DoctorFiltersState {
  const [params, setParams] = useSearchParams()
  const all = doctors ?? []

  const query = params.get(QUERY_KEY) ?? ''
  const conditions = params.getAll(CONDITION_KEY)
  const locations = params.getAll(LOCATION_KEY)

  const results = all.filter(
    (doctor) =>
      matchesQuery(doctor, query) &&
      matchesConditions(doctor, conditions) &&
      matchesLocations(doctor, locations),
  )

  // Faceted counts: each group's numbers reflect the *other* active filters, so
  // a count tells you what you'd get by ticking that box, not a global total.
  const forConditionCounts = all.filter(
    (doctor) => matchesQuery(doctor, query) && matchesLocations(doctor, locations),
  )
  const forLocationCounts = all.filter(
    (doctor) => matchesQuery(doctor, query) && matchesConditions(doctor, conditions),
  )

  const conditionLabels = new Map<string, string>()
  for (const doctor of all) {
    for (const speciality of doctor.specialities) {
      conditionLabels.set(speciality.slug, speciality.label)
    }
  }

  const conditionOptions: FilterOption[] = [...conditionLabels.entries()]
    .map(([value, label]) => ({ value, label, count: countBy(forConditionCounts, value, 'condition') }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const locationOptions: FilterOption[] = [...new Set(all.map((doctor) => doctor.location))]
    .map((value) => ({ value, label: value, count: countBy(forLocationCounts, value, 'location') }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const update = (mutate: (next: URLSearchParams) => void, replace: boolean) => {
    const next = new URLSearchParams(params)
    mutate(next)
    setParams(next, { replace })
  }

  const toggle = (key: string, value: string) => {
    update((next) => {
      const current = next.getAll(key)
      const updated = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
      next.delete(key)
      for (const entry of updated) {
        next.append(key, entry)
      }
    }, false)
  }

  return {
    query,
    conditions,
    locations,
    activeCount: conditions.length + locations.length + (query.trim() ? 1 : 0),
    conditionOptions,
    locationOptions,
    results,
    // Typing replaces the history entry, so Back doesn't step per keystroke.
    setQuery: (value: string) =>
      update((next) => {
        if (value) {
          next.set(QUERY_KEY, value)
        } else {
          next.delete(QUERY_KEY)
        }
      }, true),
    toggleCondition: (slug: string) => toggle(CONDITION_KEY, slug),
    toggleLocation: (location: string) => toggle(LOCATION_KEY, location),
    clearAll: () => setParams(new URLSearchParams(), { replace: false }),
  }
}
