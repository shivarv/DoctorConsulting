const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

/** A request failure with the HTTP status attached; `status` is 0 if the request never landed. */
export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function toApiError(cause: unknown): ApiError {
  if (cause instanceof ApiError) {
    return cause
  }
  return new ApiError('Something went wrong. Please try again.', 0)
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (cause) {
    // Let aborts propagate untouched — callers treat them as "no longer wanted",
    // not as an error to show the user.
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause
    }
    throw new ApiError(`Could not reach the API at ${BASE_URL}. Is the backend running?`, 0)
  }

  if (!response.ok) {
    throw new ApiError(`The server responded with ${response.status}.`, response.status)
  }

  return (await response.json()) as T
}
