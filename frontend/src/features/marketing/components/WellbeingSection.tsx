import { SectionHeading } from './SectionHeading'

export function WellbeingSection() {
  return (
    <section className="kin-section" id="wellbeing">
      <div className="kin-section__inner">
        <SectionHeading title="Your wellbeing is personal." />
        <p className="kin-lead">Health is more than a single symptom.</p>
        <p className="kin-body">
          The way you eat, sleep, work, move and manage everyday stress can influence how
          you feel and function.
        </p>
        <p className="kin-body">
          At KIN Wellness, Ayurveda forms the foundation of our approach. We combine
          personalized Ayurvedic care with practical diet and lifestyle guidance, with
          one-to-one yoga where appropriate.
        </p>
        <p className="kin-body">
          Our goal is to help you understand your individual needs and make meaningful
          changes that can become part of your everyday life.
        </p>

        <p className="kin-refrain">Root. Revive. Thrive.</p>

        <div className="kin-actions">
          {/* An in-page jump, so a plain anchor rather than a <Link> — routing
              to the URL you are already on would not move the viewport. */}
          <a className="button button--ghost" href="#approach">
            Discover the KIN approach
          </a>
        </div>
      </div>
    </section>
  )
}
