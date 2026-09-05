import { Link } from 'react-router-dom'

/** The three Coimbatore branches. Addresses are placeholders until confirmed. */
const LOCATIONS = [
  { id: 'one', name: 'Coimbatore — Branch One', address: 'Address to be confirmed' },
  { id: 'two', name: 'Coimbatore — Branch Two', address: 'Address to be confirmed' },
  { id: 'three', name: 'Coimbatore — Branch Three', address: 'Address to be confirmed' },
]

export function AboutPage() {
  return (
    <main className="page">
      <header className="page__header">
        <span className="badge">Ayurveda · Coimbatore</span>
        <h1 className="page__title">Traditional Ayurvedic care, now a consultation away</h1>
        <p className="page__subtitle">
          We have practised Ayurveda in Coimbatore for years, across three clinics in the
          city. This is where that same care opens up online — consult our physicians from
          wherever you are, and come in to a branch when treatment calls for it.
        </p>
      </header>

      <section className="about-section">
        <h2 className="about-section__title">Who we are</h2>
        <p className="about-section__body">
          Ayurveda treats the person rather than the complaint alone. Our physicians work
          through diet, routine, herbal preparations and therapy — looking for what is
          driving a condition instead of quieting its symptoms and leaving the cause in
          place.
        </p>
        <p className="about-section__body">
          Much of what we see is long-standing: conditions people have carried for years
          and managed rather than resolved. That work takes time and follow-up, which is
          exactly what consulting online makes easier to sustain.
        </p>
      </section>

      <section className="about-section">
        <h2 className="about-section__title">Where to find us</h2>
        <p className="about-section__body">
          Three clinics across Coimbatore, for consultations and treatments that are best
          done in person.
        </p>
        <ul className="about-locations">
          {LOCATIONS.map((location) => (
            <li key={location.id} className="about-location">
              <h3 className="about-location__name">{location.name}</h3>
              <p className="about-location__address">{location.address}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-section">
        <h2 className="about-section__title">Consulting online</h2>
        <p className="about-section__body">
          Browse our physicians, read what each of them treats, and book a time that suits
          you. No travel, no waiting room.
        </p>
        <div className="about-actions">
          <Link className="button" to="/doctors">
            Meet our doctors
          </Link>
          <Link className="button button--ghost" to="/book">
            Book a consultation
          </Link>
        </div>
      </section>
    </main>
  )
}
