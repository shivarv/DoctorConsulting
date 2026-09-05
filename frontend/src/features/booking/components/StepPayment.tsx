import type { Doctor } from '../../doctors/types'

interface StepPaymentProps {
  doctor: Doctor
}

export function StepPayment({ doctor }: StepPaymentProps) {
  return (
    <div className="step">
      <h2 className="step__title">Payment</h2>

      <div className="payment-summary">
        <div className="payment-summary__row">
          <span>Consultation with {doctor.name}</span>
          <span>₹{doctor.consultationFee}</span>
        </div>
        <div className="payment-summary__row payment-summary__row--total">
          <span>Total</span>
          <span>₹{doctor.consultationFee}</span>
        </div>
      </div>

      <p className="step__hint">
        Payment isn’t connected yet — nothing will be charged. Continue to confirm your booking.
      </p>
    </div>
  )
}
