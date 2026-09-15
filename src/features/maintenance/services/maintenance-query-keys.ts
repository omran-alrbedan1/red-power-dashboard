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

  // Attached photos metadata for a single card
  photos: (cardId: string | number) =>
    ["maintenance-card", String(cardId), "photos"] as const,

  // Single attached photo binary content (secret, fetched as Blob)
  photoContent: (cardId: string | number, photoId: string | number) =>
    [...maintenanceQueryKeys.photos(cardId), String(photoId), "content"] as const,

  // Customer signature metadata for a single card
  signature: (cardId: string | number) =>
    ["maintenance-card", String(cardId), "signature"] as const,

  // Customer signature binary content (secret, fetched as Blob)
  signatureContent: (cardId: string | number) =>
    [...maintenanceQueryKeys.signature(cardId), "content"] as const,

  // Maintenance options (visit reasons, vehicle conditions, items)
  // Cached per language: the backend resolves `label` via Accept-Language,
  // so the current locale must be part of the key.
  options: (
    kind: "visit-reasons" | "vehicle-conditions" | "vehicle-items",
    language: string,
  ) => ["maintenance-card-options", kind, language] as const,

  // Selector data for customer/vehicle dropdowns
  selectorData: () => ["maintenance-selector"] as const,

  // Vehicles currently owned by a single customer
  customerVehicles: (customerId: number | string) =>
    ["customer-vehicles", String(customerId)] as const,
} as const
