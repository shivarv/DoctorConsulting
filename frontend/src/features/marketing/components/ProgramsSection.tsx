import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

const PROGRAMS = [
  {
    title: 'KIN Reset',
    body: 'A focused wellness journey designed to help establish healthier foundations around food, sleep, movement and daily routine.',
  },
  {
    title: 'KIN Wellness Journey',
    body: 'A structured program combining personalized guidance, lifestyle practices and progress reviews.',
  },
  {
    title: 'Personalized wellness',
    body: 'A customized wellness journey created around your individual concerns, lifestyle and goals.',
  },
]

export function ProgramsSection() {
  return (
    <section className="kin-section" id="wellness-programs">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Wellness programs" title="Build better habits. One step at a time." />
        <p className="kin-lead">
          Our wellness programs bring together personalized Ayurvedic guidance, diet,
          lifestyle practices and appropriate movement to support longer-term wellbeing.
        </p>

        <ul className="kin-cards">
          {PROGRAMS.map((program) => (
            <li key={program.title} className="kin-card">
              <h3 className="kin-card__title">{program.title}</h3>
              <p className="kin-card__body">{program.body}</p>
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <Link className="button button--ghost" to="/programs">
            Explore wellness programs
          </Link>
        </div>
      </div>
    </section>
  )
}
