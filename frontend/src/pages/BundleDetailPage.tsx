import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { VideoList } from '../features/bundles/components/VideoList'
import { VideoPlayer } from '../features/bundles/components/VideoPlayer'
import { useBundle } from '../features/bundles/hooks/useBundle'
import { formatVideoCount } from '../utils/format'

export function BundleDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data: bundle, loading, error } = useBundle(slug)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Derived rather than stored: the first video is shown by default, and a
  // selection from a previously viewed bundle simply stops matching.
  const selected = bundle?.videos.find((video) => video.id === selectedId) ?? bundle?.videos[0] ?? null

  if (loading) {
    return (
      <main className="page">
        <LoadingState label="Loading bundle…" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <Link className="back-link" to="/shop">
          ← All bundles
        </Link>
        {error.status === 404 ? (
          <EmptyState title="Bundle not found">
            <p>
              There is no bundle called <code>{slug}</code>.
            </p>
          </EmptyState>
        ) : (
          <ErrorState message={error.message} />
        )}
      </main>
    )
  }

  if (!bundle) {
    return null
  }

  return (
    <main className="page">
      <Link className="back-link" to="/shop">
        ← All bundles
      </Link>

      <header className="page__header">
        <span className="badge">{bundle.level}</span>
        <h1 className="page__title">{bundle.title}</h1>
        {bundle.description && <p className="page__subtitle">{bundle.description}</p>}
        <p className="page__meta">{formatVideoCount(bundle.videoCount)}</p>
      </header>

      {bundle.videos.length === 0 ? (
        <EmptyState title="No videos in this bundle yet">
          <p>
            Add video files to <code>frontend/public/videos/{bundle.slug}/</code>, then refresh
            this page. Prefix filenames with <code>01-</code>, <code>02-</code> to set the order.
          </p>
        </EmptyState>
      ) : (
        <div className="bundle-detail">
          {selected && (
            <VideoPlayer key={selected.id} video={selected} autoPlay={selectedId !== null} />
          )}
          <VideoList
            videos={bundle.videos}
            activeVideoId={selected?.id ?? null}
            onSelect={(video) => setSelectedId(video.id)}
          />
        </div>
      )}
    </main>
  )
}
