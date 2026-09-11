import { Link } from 'react-router-dom'

const CONTACT_EMAIL = 'keerthiofficial@gmail.com'
/** Digits only, no "+" or spaces — wa.me rejects anything else. */
const WHATSAPP_NUMBER = '918124650200'

/**
 * Sections of the landing page are anchors rather than routes, so these are
 * `/about#id` and rely on ScrollToHash to land in the right place. `Home` and
 * `About` both resolve to the landing page (`/` redirects to `/about`), so
 * About points at the practitioner section — the part of that page that
 * actually is "about us".
 */
const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about#ayurveda', label: 'Ayurveda' },
  { to: '/about#diet-lifestyle', label: 'Diet & Lifestyle' },
  { to: '/about#personal-yoga', label: 'Personal Yoga' },
  { to: '/programs', label: 'Wellness Programs' },
  { to: '/about#meet-dr-keerthy', label: 'About' },
  { to: '/blog', label: 'KIN Journal' },
  { to: '/videos', label: 'Videos' },
  { to: '/book', label: 'Book Consultation' },
]

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/medical-disclaimer', label: 'Medical Disclaimer' },
  { to: '/refund-policy', label: 'Refund & Cancellation Policy' },
]

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__name">KIN Wellness</p>
          <p className="site-footer__refrain">Root. Revive. Thrive.</p>
          <p className="site-footer__note">Ayurveda · Diet &amp; Lifestyle · Personal Yoga</p>
          <p className="site-footer__note">Personalized online wellness consultations</p>
        </div>

        <nav className="site-footer__column" aria-label="Quick links">
          <h2 className="site-footer__heading">Quick links</h2>
          <ul className="site-footer__list">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="site-footer__link" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__column">
          <h2 className="site-footer__heading">Contact</h2>
          <ul className="site-footer__list">
            <li>
              <a className="site-footer__link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a
                className="site-footer__link"
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                // noreferrer as well as noopener: without it the destination
                // sees the referring URL, and rel="noopener" alone does not
                // imply it.
                rel="noopener noreferrer"
              >
                WhatsApp +91 81246 50200
              </a>
            </li>
          </ul>
          <p className="site-footer__note">Location: India</p>
          <p className="site-footer__note">Online consultations available</p>
        </div>

        <nav className="site-footer__column" aria-label="Legal">
          <h2 className="site-footer__heading">Legal</h2>
          <ul className="site-footer__list">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="site-footer__link" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="site-footer__legal">
        © {new Date().getFullYear()} KIN Wellness. All rights reserved.
      </p>
    </footer>
  )
}
