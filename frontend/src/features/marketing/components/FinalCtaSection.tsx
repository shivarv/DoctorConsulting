import { ConsultationButton } from './ConsultationButton'
import { SectionHeading } from './SectionHeading'

export function FinalCtaSection() {
  return (
    <section className="kin-section kin-section--accent kin-final" id="final-cta">
      <div className="kin-section__inner">
        <SectionHeading title="Your wellbeing begins with understanding." />
        <p className="kin-lead">You don&apos;t have to change everything at once.</p>
        <p className="kin-refrain">Start with one conversation.</p>

        <div className="kin-actions">
          <ConsultationButton label="Book your KIN consultation" />
        </div>
      </div>
    </section>
  )
}
