import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

const SERIES = [
  {
    title: 'Ayurveda explained',
    body: 'Simple explanations of Ayurvedic concepts and principles.',
  },
  { title: 'Food & lifestyle', body: 'Practical guidance for everyday wellness.' },
  {
    title: 'Wellness minutes',
    body: 'Short insights into food, sleep, stress, routine and wellbeing.',
  },
  { title: 'KIN Movement', body: 'Simple yoga, breathing and movement practices.' },
]

export function VideoLibrarySection() {
  return (
    <section className="kin-section" id="kin-videos">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="KIN Video Library" title="Watch. Learn. Practise." />
        <p className="kin-lead">
          Short, practical videos to help you understand Ayurveda and make better everyday
          choices.
        </p>

        <ul className="kin-cards">
          {SERIES.map((item) => (
            <li key={item.title} className="kin-card">
              <h3 className="kin-card__title">{item.title}</h3>
              <p className="kin-card__body">{item.body}</p>
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <Link className="button button--ghost" to="/videos">
            Watch KIN Wellness
          </Link>
        </div>
      </div>
    </section>
  )
}
