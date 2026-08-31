import { useEffect, useState } from 'react'

import { toApiError, type ApiError } from '../../../services/apiClient'
import type { AsyncState } from '../../../types/async'
import { fetchBundle } from '../services/bundlesApi'
import type { BundleDetail } from '../types'

interface Settled {
  /** Which slug this result belongs to; `null` before anything has settled. */
  slug: string | null
  data: BundleDetail | null
  error: ApiError | null
}

export function useBundle(slug: string): AsyncState<BundleDetail> {
  const [settled, setSettled] = useState<Settled>({ slug: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchBundle(slug, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSettled({ slug, data, error: null })
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setSettled({ slug, data: null, error: toApiError(cause) })
        }
      })

    return () => controller.abort()
  }, [slug])

  // Tagging the result with its slug means a stale result is simply not
  // "current", so navigating between bundles reports loading immediately
  // without an effect that resets state.
  const isCurrent = settled.slug === slug

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
  }
}
