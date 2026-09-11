import { SectionHeading } from './SectionHeading'

const FOUNDATIONS = [
  { title: 'Food', body: 'Developing healthier and more mindful eating habits.' },
  { title: 'Sleep', body: 'Creating a consistent rhythm that supports rest and recovery.' },
  { title: 'Movement', body: 'Finding movement that suits your body and lifestyle.' },
  { title: 'Stress', body: 'Building practical strategies for managing everyday stress.' },
  { title: 'Routine', body: 'Creating consistency in the habits that matter.' },
  {
    title: 'Mindfulness',
    body: 'Developing greater awareness of your body, mind and daily choices.',
  },
]

export function LifestyleSection() {
  return (
    <section className="kin-section kin-section--tinted" id="lifestyle">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Lifestyle wellness" title="Health is also about how you live." />
        <p className="kin-lead">Your daily habits can influence your overall wellbeing.</p>
        <p className="kin-body">KIN Wellness focuses on the foundations of everyday living:</p>

        <ul className="kin-cards">
          {FOUNDATIONS.map((foundation) => (
            <li key={foundation.title} className="kin-card">
              <h3 className="kin-card__title">{foundation.title}</h3>
              <p className="kin-card__body">{foundation.body}</p>
            </li>
          ))}
        </ul>

        <p className="kin-refrain">Small changes. Consistently practised.</p>
      </div>
    </section>
  )
}
