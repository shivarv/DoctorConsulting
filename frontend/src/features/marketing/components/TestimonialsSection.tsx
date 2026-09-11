import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

const QUOTES = [
  {
    id: 'habits',
    text: 'The biggest difference was finally understanding how my daily habits were affecting how I felt.',
  },
  {
    id: 'practical',
    text: 'The guidance was practical, personalized and easy to incorporate into my routine.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="kin-section" id="testimonials">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Testimonials" title="Real people. Real journeys." />
        <p className="kin-lead">
          Discover what people say about their experience with KIN Wellness.
        </p>

        <ul className="kin-quotes">
          {QUOTES.map((quote) => (
            <li key={quote.id}>
              <figure className="kin-quote">
                <blockquote className="kin-quote__text">{quote.text}</blockquote>
                <figcaption className="kin-quote__author">KIN Wellness client</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <div className="kin-actions">
          <Link className="button button--ghost" to="/testimonials">
            Read more stories
          </Link>
        </div>
      </div>
    </section>
  )
}
