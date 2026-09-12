export interface ApiSuccess<T> {
  statusCode: number
  message: string
  data: T
}

export interface ApiErrorBody {
  statusCode?: number
  message?: string | string[]
  error?: {
    code?: string
    details?: unknown
  }
}

export interface ApiPaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiPaginated<T> {
  items: T[]
  meta: ApiPaginationMeta
}
