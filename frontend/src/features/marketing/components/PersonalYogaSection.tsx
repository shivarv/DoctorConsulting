import { ConsultationButton } from './ConsultationButton'
import { SectionHeading } from './SectionHeading'

const FOCUS = [
  'Mobility',
  'Flexibility',
  'Strength',
  'Relaxation',
  'Stress management',
  'Mindful movement',
  'General wellbeing',
]

export function PersonalYogaSection() {
  return (
    <section className="kin-section" id="personal-yoga">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Personal yoga" title="Yoga, personally designed for you." />
        <p className="kin-lead">
          KIN Wellness currently offers one-to-one personal yoga sessions rather than group
          classes.
        </p>
        <p className="kin-body">
          Each session is individually adapted to your needs, experience, physical
          abilities and goals.
        </p>

        <p className="kin-body">Personal yoga may focus on:</p>
        <ul className="kin-checklist">
          {FOCUS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="kin-refrain">Your practice. Your pace. Your space.</p>

        <div className="kin-actions">
          {/* An enquiry is still a consultation booking — there is no separate
              enquiry form, so this goes to the same wizard under its own label
              rather than to a dead route. */}
          <ConsultationButton label="Enquire about personal yoga" variant="ghost" />
        </div>
      </div>
    </section>
  )
}
