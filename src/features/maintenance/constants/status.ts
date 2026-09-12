export const MAINTENANCE_CARD_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const

export type ApiMaintenanceCardStatus =
  (typeof MAINTENANCE_CARD_STATUS)[keyof typeof MAINTENANCE_CARD_STATUS]

export const MAINTENANCE_WORK_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const

export type ApiMaintenanceWorkStatus =
  (typeof MAINTENANCE_WORK_STATUS)[keyof typeof MAINTENANCE_WORK_STATUS]