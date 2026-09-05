import { useEffect, useState } from 'react'

import { toApiError, type ApiError } from '../../../services/apiClient'
import type { AsyncState } from '../../../types/async'
import { fetchDoctors } from '../services/doctorsApi'
import type { Doctor } from '../types'

interface Settled {
  data: Doctor[] | null
  error: ApiError | null
}

export function useDoctors(): AsyncState<Doctor[]> {
  const [settled, setSettled] = useState<Settled>({ data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchDoctors(controller.signal)
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

  return {
    data: settled.data,
    error: settled.error,
    loading: settled.data === null && settled.error === null,
  }
}
