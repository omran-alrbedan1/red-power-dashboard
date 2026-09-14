/**
 * Employees feature query-key factory.
 * Owns the `/users` cache key so any mutation invalidates exactly the
 * employee queries it affects.
 */

export const employeeQueryKeys = {
  all: ["employees"] as const,

  lists: () => [...employeeQueryKeys.all, "list"] as const,

  list: (page: number, limit: number, search?: string, isActive?: boolean) =>
    [...employeeQueryKeys.lists(), { page, limit, search, isActive }] as const,
}