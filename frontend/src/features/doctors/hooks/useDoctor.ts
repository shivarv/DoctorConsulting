import { useEffect, useState } from 'react'

import { toApiError, type ApiError } from '../../../services/apiClient'
import type { AsyncState } from '../../../types/async'
import { fetchDoctor } from '../services/doctorsApi'
import type { DoctorDetail } from '../types'

interface Settled {
  /** Which id this result belongs to; `null` before anything has settled. */
  id: string | null
  data: DoctorDetail | null
  error: ApiError | null
}

export function useDoctor(id: string): AsyncState<DoctorDetail> {
  const [settled, setSettled] = useState<Settled>({ id: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchDoctor(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSettled({ id, data, error: null })
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setSettled({ id, data: null, error: toApiError(cause) })
        }
      })

    return () => controller.abort()
  }, [id])

  // Tagging the result with its id means a stale response is simply not
  // "current", so navigating between doctors reports loading immediately.
  const isCurrent = settled.id === id

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
  }
}
