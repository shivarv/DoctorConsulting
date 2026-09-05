import { useEffect, useState } from 'react'

import { toApiError, type ApiError } from '../../../services/apiClient'
import type { AsyncState } from '../../../types/async'
import { fetchBundles } from '../services/bundlesApi'
import type { Bundle } from '../types'

interface Settled {
  data: Bundle[] | null
  error: ApiError | null
}

export function useBundles(): AsyncState<Bundle[]> {
  const [settled, setSettled] = useState<Settled>({ data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchBundles(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSettled({ data, error: null })
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setSettled({ data: null, error: toApiError(cause) })
        }
      })

    return () => controller.abort()
  }, [])

  // Derived during render rather than tracked as state: nothing has settled yet.
  return {
    data: settled.data,
    error: settled.error,
    loading: settled.data === null && settled.error === null,
  }
}
