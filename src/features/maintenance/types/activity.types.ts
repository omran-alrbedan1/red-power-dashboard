export type ActivityType =
  | "card_created"
  | "card_status_changed"
  | "work_added"
  | "work_updated"
  | "work_status_changed"
  | "work_completed"
  | "work_cancelled"
  | "approval_recorded"
  | "delivery_scheduled"
  | "card_closed"
  | "card_cancelled"

export interface ActivityEvent {
  id: string
  cardId: string
  type: ActivityType
  timestamp: string
  actor?: string
  description: string
  metadata?: Record<string, unknown>
}

/**
 * Server-provided status events for lifecycle timeline.
 * Shape matches the maintenance-card statusEvents relation from the API.
 */
export interface StatusEvent {
  id: number
  fromStatus?: string | null
  toStatus: string
  createdAt: string
  changedBy?: { id: number; name?: string } | null
}
