import { ConsultationButton } from './ConsultationButton'

const POINTS = ['Online consultations', 'Personalized care', 'Lifestyle-focused wellness']

export function HeroSection() {
  return (
    <section className="kin-hero">
      <div className="kin-hero__inner">
        {/* The brand name sits above the h1 rather than inside it: the page's
            heading is the promise, and the name is already in the header. */}
        <span className="kin-hero__brand">KIN Wellness</span>
        <h1 className="kin-hero__title">Root. Revive. Thrive.</h1>
        <p className="kin-hero__tagline">Ayurveda at the core. Lifestyle at the heart.</p>
        <p className="kin-hero__lead">
          Personalized Ayurvedic consultations supported by practical diet, lifestyle
          guidance and one-to-one personal yoga for modern living.
        </p>

        <div className="kin-actions">
          <ConsultationButton />
        </div>

        <ul className="kin-hero__points">
          {POINTS.map((point) => (
            <li key={point} className="kin-hero__point">
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
