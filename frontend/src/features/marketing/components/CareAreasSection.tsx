import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

const AREAS = [
  {
    title: 'Skin wellness',
    body: 'Ayurvedic and lifestyle-focused care for concerns such as psoriasis, eczema, acne and other recurring skin concerns.',
  },
  {
    title: 'Fertility & reproductive wellness',
    body: 'Personalized Ayurvedic and lifestyle guidance for individuals and couples seeking support for reproductive wellbeing, including fertility concerns and PCOS.',
  },
  {
    title: "Women's wellness",
    body: "Personalized support for menstrual health, PCOS and other women's wellness concerns.",
  },
  {
    title: 'Digestive wellness',
    body: 'Guidance focused on digestion, food habits, daily routine and overall digestive wellbeing.',
  },
  {
    title: 'Weight & metabolic wellness',
    body: 'Personalized Ayurvedic, dietary and lifestyle approaches to support healthier weight management and metabolic wellbeing.',
  },
  {
    title: 'Stress & sleep',
    body: 'Ayurvedic and lifestyle guidance to support better sleep, relaxation and everyday resilience.',
  },
  {
    title: 'Musculoskeletal wellness',
    body: 'Personalized guidance incorporating Ayurveda, lifestyle and appropriate movement practices to support mobility and everyday physical wellbeing.',
  },
  {
    title: 'General wellness',
    body: 'For individuals looking to improve their energy, daily routine, food habits, sleep and overall wellbeing.',
  },
]

export function CareAreasSection() {
  return (
    <section className="kin-section kin-section--tinted" id="care-areas">
      <div className="kin-section__inner">
        <SectionHeading
          eyebrow="Areas of Ayurvedic care"
          title="Personalized support for modern lifestyle concerns."
        />
        <p className="kin-lead">
          KIN Wellness offers personalized Ayurvedic guidance across a range of health and
          lifestyle concerns.
        </p>

        <ul className="kin-cards">
          {AREAS.map((area) => (
            <li key={area.title} className="kin-card">
              <h3 className="kin-card__title">{area.title}</h3>
              <p className="kin-card__body">{area.body}</p>
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <Link className="button button--ghost" to="/conditions">
            Explore Ayurvedic care
          </Link>
        </div>
      </div>
    </section>
  )
}
