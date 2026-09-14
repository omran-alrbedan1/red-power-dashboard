/**
 * Maintenance-options feature query-key factory.
 *
 * Keys share the root prefix `["maintenance-card-options", <kind>]` with
 * the existing `maintenanceQueryKeys.options(kind)` used by the receipt
 * wizard, so mutations here naturally invalidate both caches.
 */

import type { MaintenanceOptionKind } from "../types/maintenance-option.types"

export const maintenanceOptionKeys = {
  /** Bare root – used only for broad invalidation if ever needed. */
  all: ["maintenance-card-options"] as const,

  /** Paginated management list per kind + search/isActive/page/limit.
   *  `"bilingual-v2"` marks the merged ar+en row shape; bump this segment if
   *  the list contract changes so stale caches are never replayed. */
  list: (
    kind: MaintenanceOptionKind,
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
  ) =>
    [
      "maintenance-card-options",
      kind,
      "list",
      "bilingual-v2",
      { page, limit, search, isActive },
    ] as const,

  /** Prefix shared with the receipt-wizard option query. */
  withKind: (kind: MaintenanceOptionKind) =>
    ["maintenance-card-options", kind] as const,
} as const