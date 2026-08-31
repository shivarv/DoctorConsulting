import type { ApiError } from '../services/apiClient'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}
