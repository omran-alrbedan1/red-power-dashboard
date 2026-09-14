import type { MaintenanceOptionKind } from "../types/maintenance-option.types"

/** Every maintenance-card option kind exposed by the backend. */
export const OPTION_KINDS: readonly {
  kind: MaintenanceOptionKind
  labelKey: string
}[] = [
  { kind: "visit-reasons", labelKey: "tabs.visitReasons" },
  { kind: "vehicle-conditions", labelKey: "tabs.vehicleConditions" },
  { kind: "vehicle-items", labelKey: "tabs.vehicleItems" },
] as const