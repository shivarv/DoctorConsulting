interface PathStep {
  id: string
  label: string
}

interface PathHeaderProps {
  steps: readonly PathStep[]
  currentIndex: number
  /** Steps before this are reachable; the terminal step locks the path. */
  firstIndex: number
  onSelect: (index: number) => void
}

export function PathHeader({ steps, currentIndex, firstIndex, onSelect }: PathHeaderProps) {
  const isTerminal = currentIndex === steps.length - 1
  const progress = (currentIndex / (steps.length - 1)) * 100

  return (
    <div className="path">
      <ol className="path__list">
        {steps.map((step, index) => {
          const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo'
          const canJump = !isTerminal && index < currentIndex && index >= firstIndex

          return (
            <li key={step.id} className={`path__step path__step--${state}`}>
              {canJump ? (
                <button type="button" className="path__label" onClick={() => onSelect(index)}>
                  <span aria-hidden="true">✓</span> {step.label}
                </button>
              ) : (
                // Upcoming steps are not focusable — there's nowhere to go yet.
                <span
                  className="path__label"
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  {state === 'done' && <span aria-hidden="true">✓ </span>}
                  {step.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>

      {/* Five chevrons don't fit a phone; CSS swaps to this below ~48rem. */}
      <div className="path__compact">
        <p className="path__compact-label">
          Step {currentIndex + 1} of {steps.length} · <strong>{steps[currentIndex].label}</strong>
        </p>
        <div className="path__bar">
          <span className="path__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
