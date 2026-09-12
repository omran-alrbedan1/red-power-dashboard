export const maintenanceKeys = {
  all: ["maintenance"] as const,
  lists: () => [...maintenanceKeys.all, "list"] as const,
  list: (params: Record<string, unknown> = {}) => [...maintenanceKeys.lists(), params] as const,
  details: () => [...maintenanceKeys.all, "detail"] as const,
  detail: (cardId: number) => [...maintenanceKeys.details(), cardId] as const,
  history: (customerId: number) => [...maintenanceKeys.all, "history", customerId] as const,
  dashboard: () => [...maintenanceKeys.all, "dashboard"] as const,
}
