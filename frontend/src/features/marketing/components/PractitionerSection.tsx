import { Link } from 'react-router-dom'

import { SectionHeading } from './SectionHeading'

export function PractitionerSection() {
  return (
    <section className="kin-section kin-section--tinted" id="meet-dr-keerthy">
      <div className="kin-section__inner">
        <SectionHeading eyebrow="Meet Dr. Keerthy" title="Personalized care starts with listening." />

        <div className="kin-practitioner">
          <div className="kin-practitioner__card">
            <h3 className="kin-practitioner__name">Dr. Keerthy Saminathan</h3>
            <p className="kin-practitioner__role">Ayurveda physician & wellness practitioner</p>
          </div>

          <div>
            <p className="kin-body">
              Dr. Keerthy believes that meaningful wellness begins with understanding the
              connection between the body, mind, food, lifestyle and everyday habits.
            </p>
            <p className="kin-body">
              Her approach is rooted in Ayurveda while remaining practical and relevant to
              modern lifestyles.
            </p>
            <p className="kin-body">
              Through personalized consultations, she helps individuals understand their
              health concerns and develop realistic approaches to food, lifestyle and
              everyday wellbeing.
            </p>
            <p className="kin-body">
              The focus is not simply on providing recommendations, but on helping each
              individual build habits they can understand, practise and sustain.
            </p>

            <div className="kin-actions">
              <Link className="button button--ghost" to="/doctors">
                Meet Dr. Keerthy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
