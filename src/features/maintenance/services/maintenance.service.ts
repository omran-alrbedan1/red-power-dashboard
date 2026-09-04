import type { MaintenanceCard, MaintenanceStatus } from "../types/maintenance.types"
import type { WorkItem, WorkStatus } from "../types/work-item.types"
import type { MaintenanceCardSummary } from "../types/summary.types"
import type { ActivityEvent, ActivityType } from "../types/activity.types"
import {
  initialCards,
  selectorCustomers,
  selectorVehicles,
  type CustomerOption,
  type VehicleOption,
} from "../data/maintenance.data"

export type MaintenanceCardInput = Omit<
  MaintenanceCard,
  "id" | "receiptNumber" | "createdAt" | "updatedAt" | "activityEvents"
>

let cards: MaintenanceCard[] = [...initialCards]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const receiptNumberFor = (): string => {
  const year = new Date().getFullYear()
  const next = cards.length + 1
  return `RC-${year}-${String(next).padStart(4, "0")}`
}

const createActivityEvent = (
  cardId: string,
  type: ActivityType,
  description: string,
  actor?: string,
  metadata?: Record<string, unknown>
): ActivityEvent => ({
  id: uid("act"),
  cardId,
  type,
  timestamp: new Date().toISOString(),
  actor,
  description,
  metadata,
})

export const getClosureStatus = (card: MaintenanceCard): { allowed: boolean; remainingWork: WorkItem[] } => {
  const openRequiredWork = card.workItems.filter(
    (w) => w.isRequired && w.status !== "completed" && w.status !== "cancelled"
  )
  return { allowed: openRequiredWork.length === 0, remainingWork: openRequiredWork }
}

const canTransitionWorkStatus = (from: WorkStatus, to: WorkStatus) => {
  if (from === to) return true
  const transitions: Record<WorkStatus, WorkStatus[]> = {
    pending: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  }
  return transitions[from].includes(to)
}

export const maintenanceService = {
  async list(): Promise<MaintenanceCard[]> {
    await delay()
    return [...cards].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
  },

  async getById(id: string): Promise<MaintenanceCard | undefined> {
    await delay()
    return cards.find((c) => c.id === id)
  },

  async create(input: MaintenanceCardInput): Promise<MaintenanceCard> {
    await delay()
    const now = new Date().toISOString()
    const cardId = uid("mnt")
    const card: MaintenanceCard = {
      id: cardId,
      receiptNumber: receiptNumberFor(),
      ...input,
      workItems: (input.workItems ?? []).map((w) =>
        w.id ? w : { ...w, id: uid("mwi") },
      ),
      activityEvents: [],
      createdAt: now,
      updatedAt: now,
    }
    const createdEvent = createActivityEvent(
      cardId,
      "card_created",
      "Card created",
      input.receiverName
    )
    card.activityEvents.push(createdEvent)
    cards.push(card)
    return card
  },

  async update(
    id: string,
    patch: Partial<MaintenanceCard>,
  ): Promise<MaintenanceCard | undefined> {
    await delay()
    const index = cards.findIndex((c) => c.id === id)
    if (index === -1) return undefined
    cards[index] = {
      ...cards[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    }
    return cards[index]
  },

  async addWorkItem(
    cardId: string,
    item: Omit<WorkItem, "id">,
    actor?: string,
  ): Promise<MaintenanceCard | undefined> {
    await delay(150)
    const index = cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined
    const workItem: WorkItem = { ...item, id: uid("mwi") }
    cards[index] = {
      ...cards[index],
      workItems: [...cards[index].workItems, workItem],
      updatedAt: new Date().toISOString(),
    }
    cards[index].activityEvents.push(
      createActivityEvent(cardId, "work_added", "Work item added", actor, { workItemId: workItem.id }),
    )
    return cards[index]
  },

  async removeWorkItem(
    cardId: string,
    workItemId: string,
  ): Promise<MaintenanceCard | undefined> {
    await delay(150)
    const index = cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined
    cards[index] = {
      ...cards[index],
      workItems: cards[index].workItems.filter((w) => w.id !== workItemId),
      updatedAt: new Date().toISOString(),
    }
    return cards[index]
  },

  async getCardsByCustomer(
    customerId: string,
  ): Promise<MaintenanceCardSummary[]> {
    await delay(200)
    return cards
      .filter((c) => c.customerId === customerId)
      .map((c) => ({
        id: c.id,
        receiptNumber: c.receiptNumber,
        status: c.status,
        createdAt: c.createdAt,
        workCount: c.workItems.length,
        pendingWork: c.workItems.filter(
          (w) => w.status === "pending" || w.status === "in_progress",
        ).length,
        totalCost: c.workItems.reduce(
          (sum, w) => sum + (w.estimatedCost || 0),
          0,
        ),
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async getSelectorData(): Promise<{
    customers: CustomerOption[]
    vehicles: VehicleOption[]
  }> {
    await delay(150)
    return { customers: selectorCustomers, vehicles: selectorVehicles }
  },

  async getStatusCounts(): Promise<Record<MaintenanceStatus, number>> {
    await delay(150)
    return cards.reduce<Record<MaintenanceStatus, number>>(
      (counts, card) => {
        counts[card.status] += 1
        return counts
      },
      { draft: 0, open: 0, in_progress: 0, waiting_parts: 0, ready_for_delivery: 0, closed: 0, cancelled: 0 },
    )
  },

  async updateWorkItem(
    cardId: string,
    workItemId: string,
    updates: Partial<WorkItem>,
    actor?: string
  ): Promise<MaintenanceCard | undefined> {
    await delay(150)
    const index = cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined

    const workItem = cards[index].workItems.find((w) => w.id === workItemId)
    if (!workItem) return undefined

    const oldStatus = workItem.status
    const newStatus = updates.status

    if (newStatus && !canTransitionWorkStatus(oldStatus, newStatus)) {
      throw new Error("INVALID_WORK_STATUS_TRANSITION")
    }

    cards[index] = {
      ...cards[index],
      workItems: cards[index].workItems.map((w) =>
        w.id === workItemId ? { ...w, ...updates } : w
      ),
      updatedAt: new Date().toISOString(),
    }

    // Create activity event
    const eventType: ActivityType =
      newStatus && newStatus !== oldStatus
        ? "work_status_changed"
        : "work_updated"
    const description =
      newStatus && newStatus !== oldStatus
        ? `Work status changed to ${newStatus}`
        : "Work updated"

    const event = createActivityEvent(
      cardId,
      eventType,
      description,
      actor,
      { workItemId, oldStatus, newStatus }
    )
    cards[index].activityEvents.push(event)

    return cards[index]
  },

  async updateCardStatus(
    cardId: string,
    status: MaintenanceStatus,
    actor?: string
  ): Promise<MaintenanceCard | undefined> {
    await delay(150)
    const index = cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined

    const card = cards[index]

    // Closure guard
    if (status === "closed") {
      const guard = getClosureStatus(card)
      if (!guard.allowed) {
        throw new Error("REQUIRED_WORK_REMAINING")
      }
    }

    const oldStatus = card.status
    cards[index] = {
      ...cards[index],
      status,
      updatedAt: new Date().toISOString(),
    }

    const event = createActivityEvent(
      cardId,
      "card_status_changed",
      `Status changed to ${status}`,
      actor,
      { oldStatus, newStatus: status }
    )
    cards[index].activityEvents.push(event)

    return cards[index]
  },

  async closeCard(cardId: string, actor?: string): Promise<MaintenanceCard | undefined> {
    await delay(150)
    const index = cards.findIndex((c) => c.id === cardId)
    if (index === -1) return undefined

    const card = cards[index]
    const guard = getClosureStatus(card)
    if (!guard.allowed) {
      throw new Error("REQUIRED_WORK_REMAINING")
    }

    cards[index] = {
      ...cards[index],
      status: "closed",
      updatedAt: new Date().toISOString(),
    }

    const event = createActivityEvent(
      cardId,
      "card_closed",
      "Card closed",
      actor
    )
    cards[index].activityEvents.push(event)

    return cards[index]
  },
}
