import { useEffect, useState } from 'react'

import { toApiError, type ApiError } from '../../../services/apiClient'
import type { AsyncState } from '../../../types/async'
import { fetchAvailability } from '../services/availabilityApi'
import type { DaySlots } from '../types'

interface Settled {
  doctorId: string | null
  data: DaySlots[] | null
  error: ApiError | null
}

export function useAvailability(doctorId: string): AsyncState<DaySlots[]> {
  const [settled, setSettled] = useState<Settled>({ doctorId: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()

    fetchAvailability(doctorId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setSettled({ doctorId, data, error: null })
        }
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setSettled({ doctorId, data: null, error: toApiError(cause) })
        }
      })

    return () => controller.abort()
  }, [doctorId])

  const isCurrent = settled.doctorId === doctorId

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
  }
}
