export interface Speciality {
  slug: string
  label: string
}

export interface Doctor {
  id: string
  name: string
  title: string
  specialities: Speciality[]
  location: string
  experienceYears: number
  photoUrl: string
  consultationFee: number
  rating: number
  reviewCount: number
}

export interface DoctorDetail extends Doctor {
  bio: string
  languages: string[]
  availableDays: string[]
}
