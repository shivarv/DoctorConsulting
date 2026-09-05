import type { FilterOption } from '../hooks/useDoctorFilters'

interface FilterGroupProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}

export function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  return (
    <fieldset className="filter-group">
      <legend className="filter-group__title">{title}</legend>
      <ul className="filter-group__list">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          // Dim options that would return nothing, but keep ticked ones bright
          // so you can always see and undo what you selected.
          const isDead = option.count === 0 && !isSelected

          return (
            <li key={option.value}>
              <label className={isDead ? 'filter-option filter-option--empty' : 'filter-option'}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(option.value)}
                />
                <span className="filter-option__label">{option.label}</span>
                <span className="filter-option__count">{option.count}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}
