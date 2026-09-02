import { useState } from 'react'

import type { DoctorFiltersState } from '../hooks/useDoctorFilters'
import { FilterGroup } from './FilterGroup'

interface DoctorFiltersProps {
  filters: DoctorFiltersState
  totalCount: number
}

export function DoctorFilters({ filters, totalCount }: DoctorFiltersProps) {
  const [open, setOpen] = useState(false)
  const {
    query,
    conditions,
    locations,
    activeCount,
    conditionOptions,
    locationOptions,
    results,
  } = filters

  return (
    <aside className="doctor-filters">
      {/* Only rendered on narrow screens; CSS hides it on desktop. */}
      <button
        type="button"
        className="doctor-filters__toggle"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        Filters
        {activeCount > 0 && <span className="doctor-filters__badge">{activeCount}</span>}
      </button>

      <div className={open ? 'doctor-filters__panel doctor-filters__panel--open' : 'doctor-filters__panel'}>
        <div className="doctor-filters__head">
          <h2 className="doctor-filters__title">Find a doctor</h2>
          {activeCount > 0 && (
            <button type="button" className="link-button" onClick={filters.clearAll}>
              Clear all
            </button>
          )}
        </div>

        <label className="field">
          <span className="field__label">Search</span>
          <input
            type="search"
            className="field__input"
            placeholder="Name, speciality or city"
            value={query}
            onChange={(event) => filters.setQuery(event.target.value)}
          />
        </label>

        <FilterGroup
          title="Conditions"
          options={conditionOptions}
          selected={conditions}
          onToggle={filters.toggleCondition}
        />

        <FilterGroup
          title="Location"
          options={locationOptions}
          selected={locations}
          onToggle={filters.toggleLocation}
        />

        <p className="doctor-filters__count">
          Showing <strong>{results.length}</strong> of {totalCount} doctors
        </p>
      </div>
    </aside>
  )
}
