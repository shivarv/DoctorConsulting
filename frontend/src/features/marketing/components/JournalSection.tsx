import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

const TOPICS = [
  {
    title: 'Ayurveda',
    body: 'Understanding Ayurvedic principles and their relevance to modern living.',
  },
  { title: 'Food & nutrition', body: 'Practical ideas for healthier everyday eating.' },
  { title: 'Lifestyle', body: 'Simple habits that can influence everyday wellbeing.' },
  { title: "Women's wellness", body: "Insights into women's health, lifestyle and wellbeing." },
  {
    title: 'Fertility',
    body: 'Understanding the role of lifestyle, nutrition and wellbeing in reproductive health.',
  },
  {
    title: 'Skin & body',
    body: 'Exploring the relationship between everyday habits, lifestyle and skin wellbeing.',
  },
  { title: 'Yoga', body: 'Simple movement, breathing and mindful practices for modern life.' },
]

export function JournalSection() {
  return (
    <section className="kin-section kin-section--tinted" id="kin-journal">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="KIN Journal" title="Ideas for living better." />
        <p className="kin-lead">
          Thoughtful and practical insights on Ayurveda, food, lifestyle, women&apos;s
          wellness, fertility, skin wellness and yoga.
        </p>

        <ul className="kin-cards">
          {TOPICS.map((topic) => (
            <li key={topic.title} className="kin-card">
              <h3 className="kin-card__title">{topic.title}</h3>
              <p className="kin-card__body">{topic.body}</p>
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <Link className="button button--ghost" to="/blog">
            Explore the KIN Journal
          </Link>
        </div>
      </div>
    </section>
  )
}
