import { Link } from 'react-router-dom'

import { formatVideoCount } from '../../../utils/format'
import type { Bundle } from '../types'

interface BundleCardProps {
  bundle: Bundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { slug, title, description, level, thumbnail, videoCount } = bundle

  return (
    <Link className="bundle-card" to={`/shop/${slug}`}>
      <div className="bundle-card__media">
        {thumbnail ? (
          <img src={thumbnail} alt="" loading="lazy" />
        ) : (
          <span className="bundle-card__initial" aria-hidden="true">
            {title.slice(0, 1)}
          </span>
        )}
      </div>

      <div className="bundle-card__body">
        <span className="badge">{level}</span>
        <h2 className="bundle-card__title">{title}</h2>
        {description && <p className="bundle-card__description">{description}</p>}
        <span className="bundle-card__count">{formatVideoCount(videoCount)}</span>
      </div>
    </Link>
  )
}
