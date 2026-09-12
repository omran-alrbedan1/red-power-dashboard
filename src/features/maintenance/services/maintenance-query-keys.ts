/**
 * Domain query-key factory for maintenance queries.
 * Centralizes query key definitions to ensure consistent cache invalidation.
 */

export const maintenanceQueryKeys = {
  // Maintenance card list queries
  list: () => ["maintenance-cards"] as const,

  // Single maintenance card detail queries
  detail: (cardId: string | number) => ["maintenance-card", String(cardId)] as const,

  // Activity timeline for a specific card
  timeline: (cardId: string | number) => ["activity", "timeline", String(cardId)] as const,

  // Customer history (cards by customer)
  customerHistory: (customerId: string | number) => ["customer", String(customerId), "cards"] as const,

  // Maintenance options (visit reasons, vehicle conditions, items)
  options: (kind: "visit-reasons" | "vehicle-conditions" | "vehicle-items") =>
    ["maintenance-card-options", kind] as const,

  // Selector data for customer/vehicle dropdowns
  selectorData: () => ["maintenance-selector"] as const,
} as const
