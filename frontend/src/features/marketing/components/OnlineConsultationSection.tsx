import { ConsultationButton } from './ConsultationButton'
import { SectionHeading } from './SectionHeading'

const STEPS = [
  { title: 'Book', body: 'Choose your consultation and convenient time.' },
  { title: 'Connect', body: 'Meet Dr. Keerthy through a secure online consultation.' },
  {
    title: 'Discuss',
    body: 'Share your health concerns, lifestyle, food habits, routine and wellness goals.',
  },
  { title: 'Personalize', body: 'Receive an Ayurvedic approach tailored to your individual needs.' },
  {
    title: 'Follow up',
    body: 'Continue your journey with follow-up consultations when required.',
  },
]

export function OnlineConsultationSection() {
  return (
    <section className="kin-section" id="online-consultation">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Online consultation" title="Ayurvedic care, wherever you are." />
        <p className="kin-lead">
          KIN Wellness offers personalized online Ayurvedic consultations for clients in
          India and internationally.
        </p>

        <h3 className="kin-refrain">How it works</h3>
        <ol className="kin-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="kin-step">
              <span className="kin-step__number">
                {String(index + 1).padStart(2, '0')} —
              </span>
              <h4 className="kin-step__title">{step.title}</h4>
              <p className="kin-step__body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="kin-actions">
          <ConsultationButton label="Book your consultation" />
        </div>
      </div>
    </section>
  )
}
