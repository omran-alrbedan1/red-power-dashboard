/**
 * Customers feature query-key factory.
 * Owns the `/customers` and `/vehicles` cache keys so any mutation
 * invalidates exactly the queries it affects.
 */

export const customerQueryKeys = {
  all: ["customers"] as const,

  lists: () => [...customerQueryKeys.all, "list"] as const,

  list: (page: number, limit: number, search?: string) =>
    [...customerQueryKeys.lists(), { page, limit, search }] as const,

  detail: (id: number) => [...customerQueryKeys.all, "detail", id] as const,

  history: (id: number) => [...customerQueryKeys.detail(id), "history"] as const,
}