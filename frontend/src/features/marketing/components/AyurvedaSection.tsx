import { Link } from 'react-router-dom'

import { ConsultationButton } from './ConsultationButton'
import { SectionHeading } from './SectionHeading'

/** What the consultation itself covers. */
const DISCUSSED = [
  'Your current health concerns',
  'Health and lifestyle history',
  'Food and dietary habits',
  'Sleep and daily routine',
  'Stress and emotional wellbeing',
  'Physical activity and movement',
  'Previous treatments',
  'Relevant medical reports',
  'Personal health and wellness goals',
]

/** What comes out of it. */
const PLAN = [
  'Ayurvedic guidance',
  'Diet & nutrition guidance',
  'Lifestyle recommendations',
  'Daily routine',
  'Yoga & movement recommendations',
  'Follow-up care',
]

export function AyurvedaSection() {
  return (
    <section className="kin-section" id="ayurveda">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Ayurveda" title="Begin with understanding." />
        <p className="kin-lead">Ayurveda looks at the individual as a whole.</p>
        <p className="kin-body">
          During your consultation, Dr. Keerthy Saminathan takes time to understand your
          health concerns, lifestyle, food habits, sleep, stress, daily routine and
          overall wellbeing.
        </p>

        <p className="kin-body">Your consultation may include discussion of:</p>
        <ul className="kin-checklist">
          {DISCUSSED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="kin-body">
          Based on your consultation, a personalized Ayurvedic approach is developed
          according to your individual needs.
        </p>

        <h3 className="kin-refrain">Your personalized plan may include:</h3>
        <ul className="kin-tags">
          {PLAN.map((item) => (
            <li key={item} className="kin-tag">
              {item}
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <ConsultationButton label="Book your Ayurvedic consultation" />
          <Link className="button button--ghost" to="/doctors">
            See our physicians
          </Link>
        </div>
      </div>
    </section>
  )
}
