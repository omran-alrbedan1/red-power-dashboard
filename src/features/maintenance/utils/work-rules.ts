import type { MaintenanceWorkRow } from "../types/maintenance-detail.types"
import type { WorkTargetStatus } from "../hooks/useMaintenanceWorkActions"

export const ALLOWED_REOPEN_TARGETS: WorkTargetStatus[] = ["PENDING", "IN_PROGRESS"]

export function canDeleteWorkItem(
  work: Pick<MaintenanceWorkRow, "status" | "startedAt">,
): boolean {
  return work.status === "pending" && work.startedAt == null
}

export function allowedReopenTargets(
  work: Pick<MaintenanceWorkRow, "status">,
): readonly WorkTargetStatus[] {
  if (work.status === "cancelled") return ["PENDING"]
  return ALLOWED_REOPEN_TARGETS
}
