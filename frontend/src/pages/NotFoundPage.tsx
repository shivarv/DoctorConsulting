import { Link } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'

export function NotFoundPage() {
  return (
    <main className="page">
      <EmptyState title="Page not found">
        <p>That page does not exist.</p>
        <Link className="button" to="/bundles">
          Go to bundles
        </Link>
      </EmptyState>
    </main>
  )
}
