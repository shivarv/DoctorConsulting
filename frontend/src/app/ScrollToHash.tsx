import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to `#section` after a navigation that carries a hash.
 *
 * The browser does this for free when the hash changes on a page already
 * loaded, which is why the landing page's own in-page CTAs are plain <a
 * href="#…"> elements. It does *not* happen for a router navigation: the
 * footer's "Ayurveda" link points at /about#ayurveda, and clicking it from
 * /doctors renders the landing page scrolled to the top, ignoring the hash
 * entirely. This closes that gap.
 */
export function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    // Runs after the render that mounted the target, so a cross-route jump
    // finds an element that did not exist when the click happened.
    const target = document.querySelector(hash)
    if (!target) return

    // Honour the OS-level motion preference; a full-page smooth scroll is
    // exactly the kind of movement it is set to avoid.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [hash])

  return null
}
