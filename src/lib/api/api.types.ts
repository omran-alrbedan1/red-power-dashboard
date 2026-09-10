export interface ApiSuccessResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface ApiValidationDetail {
  field: string
  messages: string[]
}

export interface ApiErrorResponse {
  statusCode: number
  message: string
  error: {
    code: string
    details?: ApiValidationDetail[] | unknown
  }
  timestamp: string
  path: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}
