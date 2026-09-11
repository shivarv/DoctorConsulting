import { SectionHeading } from './SectionHeading'

const STEPS = [
  {
    title: 'Consult',
    body: 'Begin with a personalized online Ayurvedic consultation with Dr. Keerthy Saminathan.',
  },
  {
    title: 'Understand',
    body: 'Explore your health concerns, lifestyle, food habits, sleep, stress and daily routine.',
  },
  {
    title: 'Personalize',
    body: 'Receive an Ayurvedic wellness approach designed around your individual needs.',
  },
  {
    title: 'Build',
    body: 'Where appropriate, incorporate personalized diet, lifestyle and movement guidance.',
  },
  { title: 'Practise', body: 'Apply practical changes to your everyday routine.' },
  {
    title: 'Progress',
    body: 'Follow-up consultations help review your progress and refine your approach.',
  },
]

export function JourneySection() {
  return (
    <section className="kin-section kin-section--tinted" id="journey">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Your KIN journey" title="From understanding to action." />

        {/* <ol>, not <ul>: the numbering is the content here, so the order has to
            survive for a screen reader that ignores the rendered "01 —". */}
        <ol className="kin-steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="kin-step">
              <span className="kin-step__number">
                {String(index + 1).padStart(2, '0')} —
              </span>
              <h3 className="kin-step__title">{step.title}</h3>
              <p className="kin-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
