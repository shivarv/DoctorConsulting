import { SectionHeading } from './SectionHeading'

const CONSIDERATIONS = [
  'What you eat',
  'When you eat',
  'How you eat',
  'Your daily routine',
  'Your sleep',
  'Your stress levels',
  'Your activity',
  'Your wellness goals',
]

export function DietLifestyleSection() {
  return (
    <section className="kin-section" id="diet-lifestyle">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Diet & lifestyle" title="Food is part of your wellness journey." />
        <p className="kin-lead">There is no single perfect diet for everyone.</p>
        <p className="kin-body">
          As part of your personalized wellness journey, diet and lifestyle guidance may
          be recommended according to your individual needs, preferences, routine and
          goals.
        </p>

        <p className="kin-body">We may look at:</p>
        <ul className="kin-tags">
          {CONSIDERATIONS.map((item) => (
            <li key={item} className="kin-tag">
              {item}
            </li>
          ))}
        </ul>

        <p className="kin-refrain">Practical. Personal. Sustainable.</p>
        <p className="kin-body">
          The focus is on realistic changes that can fit into your everyday life.
        </p>

        <div className="kin-actions">
          <a className="button button--ghost" href="#lifestyle">
            Explore diet & lifestyle
          </a>
        </div>
      </div>
    </section>
  )
}
