import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { BundleCard } from '../features/bundles/components/BundleCard'
import { useBundles } from '../features/bundles/hooks/useBundles'

export function BundleListPage() {
  const { data: bundles, loading, error } = useBundles()

  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__title">Yoga Bundles</h1>
        <p className="page__subtitle">Pick a bundle to see the sessions inside it.</p>
      </header>

      {loading && <LoadingState label="Loading bundles…" />}

      {error && <ErrorState message={error.message} />}

      {bundles && bundles.length === 0 && (
        <EmptyState title="No bundles yet">
          <p>
            Create a folder under <code>frontend/public/videos/</code> — the folder name becomes
            the bundle. See the README in that folder for the naming rules.
          </p>
        </EmptyState>
      )}

      {bundles && bundles.length > 0 && (
        <ul className="bundle-grid">
          {bundles.map((bundle) => (
            <li key={bundle.slug}>
              <BundleCard bundle={bundle} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
