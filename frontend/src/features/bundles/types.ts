export interface Video {
  id: string
  title: string
  /** Frontend-relative path, served by Vite out of `public/`. */
  file: string
  order: number
}

export interface Bundle {
  slug: string
  title: string
  description: string
  level: string
  thumbnail: string | null
  videoCount: number
}

export interface BundleDetail extends Bundle {
  videos: Video[]
}
