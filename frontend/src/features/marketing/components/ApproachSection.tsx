import { SectionHeading } from './SectionHeading'

const PILLARS = [
  {
    title: 'Ayurveda',
    body: 'Personalized Ayurvedic consultations focused on understanding your individual health concerns, constitution, lifestyle and needs.',
  },
  {
    title: 'Diet & lifestyle',
    body: 'Practical guidance around food, daily routine, sleep, stress, movement and sustainable lifestyle habits.',
  },
  {
    title: 'Personal yoga',
    body: 'One-to-one yoga sessions tailored to your individual needs, experience, physical abilities and goals.',
  },
]

export function ApproachSection() {
  return (
    <section className="kin-section kin-section--tinted" id="approach">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Our approach" title="Ayurveda first. Personalized always." />
        <p className="kin-lead">
          Every person is different. Your wellness approach should be designed around you.
        </p>

        <ul className="kin-cards">
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="kin-card">
              <h3 className="kin-card__title">{pillar.title}</h3>
              <p className="kin-card__body">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
