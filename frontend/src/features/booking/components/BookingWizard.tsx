import type { Doctor } from '../../doctors/types'
import { useBookingFlow } from '../hooks/useBookingFlow'
import { PathHeader } from './PathHeader'
import { StepDone } from './StepDone'
import { StepPatientDetails } from './StepPatientDetails'
import { StepPayment } from './StepPayment'
import { StepSchedule } from './StepSchedule'
import { StepSelectDoctor } from './StepSelectDoctor'

interface BookingWizardProps {
  doctors: Doctor[]
  /** Set when arriving from a doctor profile; skips the first step. */
  initialDoctor: Doctor | null
}

export function BookingWizard({ doctors, initialDoctor }: BookingWizardProps) {
  const flow = useBookingFlow(initialDoctor)
  const { draft, errors, currentStep } = flow
  const doctor = draft.doctor

  const isFirst = flow.stepIndex === flow.firstStep
  const isDone = currentStep.id === 'done'

  return (
    <div className="booking">
      <PathHeader
        steps={flow.steps}
        currentIndex={flow.stepIndex}
        firstIndex={flow.firstStep}
        onSelect={flow.goTo}
      />

      <div className="booking__panel">
        {currentStep.id === 'doctor' && (
          <StepSelectDoctor
            doctors={doctors}
            selectedId={doctor?.id ?? null}
            error={errors.doctor}
            onSelect={flow.chooseDoctor}
          />
        )}

        {currentStep.id === 'details' && (
          <StepPatientDetails
            patient={draft.patient}
            errors={errors}
            onChange={flow.setPatientField}
          />
        )}

        {currentStep.id === 'schedule' && doctor && (
          <StepSchedule
            doctor={doctor}
            contact={draft.contact}
            schedule={draft.schedule}
            errors={errors}
            onContactChange={flow.setContactField}
            onDateChange={flow.setDate}
            onTimeChange={flow.setTime}
          />
        )}

        {currentStep.id === 'payment' && doctor && <StepPayment doctor={doctor} />}

        {isDone && doctor && (
          <StepDone draft={draft} doctor={doctor} onBookAnother={flow.reset} />
        )}

        {!isDone && (
          <div className="step__actions">
            {!isFirst && (
              <button type="button" className="button button--ghost" onClick={flow.back}>
                Back
              </button>
            )}
            <button type="button" className="button" onClick={flow.next}>
              {currentStep.id === 'payment' ? 'Confirm booking' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
