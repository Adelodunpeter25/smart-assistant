export interface SuccessResponse<T> {
  data: T
  message?: string
}

export interface ErrorResponse {
  detail: string
}

export interface ApiError {
  message: string
  status?: number
}
