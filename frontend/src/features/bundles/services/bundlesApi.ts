import { apiGet } from '../../../services/apiClient'
import type { Bundle, BundleDetail, Video } from '../types'

/** Wire shapes. The API is snake_case; the app is camelCase, so we map here. */
interface BundleSummaryResponse {
  slug: string
  title: string
  description: string
  level: string
  thumbnail: string | null
  video_count: number
}

interface BundleDetailResponse extends BundleSummaryResponse {
  videos: Video[]
}

function toBundle(response: BundleSummaryResponse): Bundle {
  return {
    slug: response.slug,
    title: response.title,
    description: response.description,
    level: response.level,
    thumbnail: response.thumbnail,
    videoCount: response.video_count,
  }
}

export async function fetchBundles(signal?: AbortSignal): Promise<Bundle[]> {
  const response = await apiGet<BundleSummaryResponse[]>('/api/bundles', signal)
  return response.map(toBundle)
}

export async function fetchBundle(slug: string, signal?: AbortSignal): Promise<BundleDetail> {
  const response = await apiGet<BundleDetailResponse>(
    `/api/bundles/${encodeURIComponent(slug)}`,
    signal,
  )
  return { ...toBundle(response), videos: response.videos }
}
