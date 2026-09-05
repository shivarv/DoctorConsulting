import { useState } from 'react'

import { formatDuration } from '../../../utils/format'
import type { Video } from '../types'

interface VideoPlayerProps {
  video: Video
  autoPlay?: boolean
}

/**
 * Parents should pass `key={video.id}` so a new selection remounts this and
 * resets duration/error state, rather than clearing it in an effect.
 */
export function VideoPlayer({ video, autoPlay = false }: VideoPlayerProps) {
  const [duration, setDuration] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="player player--failed" role="alert">
        <h3 className="player__title">{video.title}</h3>
        <p>This video could not be played.</p>
        <p className="player__hint">
          Check that <code>frontend/public{decodeURI(video.file)}</code> exists and is in a
          browser-playable format — H.264 <code>.mp4</code> is the safest choice.
        </p>
      </div>
    )
  }

  const readableDuration = duration === null ? '' : formatDuration(duration)

  return (
    <div className="player">
      <video
        className="player__video"
        src={video.file}
        controls
        autoPlay={autoPlay}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => setFailed(true)}
      />
      <div className="player__meta">
        <h3 className="player__title">{video.title}</h3>
        {readableDuration && <span className="player__duration">{readableDuration}</span>}
      </div>
    </div>
  )
}
