import { Link } from 'react-router-dom'

interface ConsultationButtonProps {
  /** Defaults to the wording used in the hero. */
  label?: string
  /** `ghost` for the outlined variant, on tinted bands where solid is heavy. */
  variant?: 'solid' | 'ghost'
}

/**
 * The booking call to action, in one place.
 *
 * Four sections of the landing page end in "book a consultation" under four
 * different labels, and all four have to arrive at the same screen. Keeping
 * the destination here means the wizard's route is written once — if `/book`
 * ever moves, or booking gains a query parameter, this is the only edit.
 */
export function ConsultationButton({ label = 'Book an online consultation', variant = 'solid' }: ConsultationButtonProps) {
  return (
    <Link className={variant === 'ghost' ? 'button button--ghost' : 'button'} to="/book">
      {label}
    </Link>
  )
}
