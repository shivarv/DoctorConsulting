import { apiGet } from '../../../services/apiClient'
import type { DaySlots } from '../types'

interface AvailabilityResponse {
  doctor_id: string
  days: DaySlots[]
}

export async function fetchAvailability(
  doctorId: string,
  signal?: AbortSignal,
): Promise<DaySlots[]> {
  const response = await apiGet<AvailabilityResponse>(
    `/api/doctors/${encodeURIComponent(doctorId)}/availability`,
    signal,
  )
  return response.days
}
