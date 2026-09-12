import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { BrandMark } from './BrandMark'

const TABS = [
  { to: '/about', label: 'About' },
  { to: '/doctors', label: 'Our Doctors' },
  { to: '/conditions', label: 'Conditions' },
  { to: '/shop', label: 'Shop' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/blog', label: 'KIN Journal' },
]

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/about" onClick={() => setMenuOpen(false)}>
          <BrandMark className="brand__mark" />
          <span className="brand__name">KIN Wellness</span>
        </Link>

        <button
          type="button"
          className="site-header__menu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
        </button>

        <nav className={menuOpen ? 'site-nav site-nav--open' : 'site-nav'}>
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => (isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link')}
              onClick={() => setMenuOpen(false)}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <Link className="button button--cta" to="/book" onClick={() => setMenuOpen(false)}>
          Book Consultation
        </Link>
      </div>
    </header>
  )
}
