import { apiGet } from '../../../services/apiClient'
import type { Doctor, DoctorDetail, Speciality } from '../types'

/** Wire shapes. The API is snake_case; the app is camelCase, so we map here. */
interface DoctorSummaryResponse {
  id: string
  name: string
  title: string
  specialities: Speciality[]
  location: string
  experience_years: number
  photo_url: string
  consultation_fee: number
  rating: number
  review_count: number
}

interface DoctorDetailResponse extends DoctorSummaryResponse {
  bio: string
  languages: string[]
  available_days: string[]
}

function toDoctor(response: DoctorSummaryResponse): Doctor {
  return {
    id: response.id,
    name: response.name,
    title: response.title,
    specialities: response.specialities,
    location: response.location,
    experienceYears: response.experience_years,
    photoUrl: response.photo_url,
    consultationFee: response.consultation_fee,
    rating: response.rating,
    reviewCount: response.review_count,
  }
}

export async function fetchDoctors(signal?: AbortSignal): Promise<Doctor[]> {
  const response = await apiGet<DoctorSummaryResponse[]>('/api/doctors', signal)
  return response.map(toDoctor)
}

export async function fetchDoctor(id: string, signal?: AbortSignal): Promise<DoctorDetail> {
  const response = await apiGet<DoctorDetailResponse>(
    `/api/doctors/${encodeURIComponent(id)}`,
    signal,
  )
  return {
    ...toDoctor(response),
    bio: response.bio,
    languages: response.languages,
    availableDays: response.available_days,
  }
}
