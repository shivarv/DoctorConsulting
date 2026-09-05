import type { Video } from '../types'

interface VideoListProps {
  videos: Video[]
  activeVideoId: string | null
  onSelect: (video: Video) => void
}

export function VideoList({ videos, activeVideoId, onSelect }: VideoListProps) {
  return (
    <ol className="video-list">
      {videos.map((video) => {
        const isActive = video.id === activeVideoId

        return (
          <li key={video.id}>
            <button
              type="button"
              className={isActive ? 'video-row video-row--active' : 'video-row'}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(video)}
            >
              <span className="video-row__order">{video.order}</span>
              <span className="video-row__title">{video.title}</span>
              {isActive && <span className="video-row__now">Playing</span>}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
