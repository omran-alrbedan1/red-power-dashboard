/**
 * Dashboard feature query-key factory.
 * Owns the `/dashboard/stats` cache so invalidation from any domain
 * coordinates against the dashboard feature instead of maintenance.
 */


export const dashboardQueryKeys = {
  all: ["dashboard"] as const,

  stats: () => [...dashboardQueryKeys.all, "stats"] as const,
}