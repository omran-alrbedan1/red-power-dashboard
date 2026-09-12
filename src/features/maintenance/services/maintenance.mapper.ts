import type {
  ApiCardStatus,
  ApiMaintenanceCardDetail,
  ApiMaintenanceCardListRow,
  ApiWorkStatus,
  MaintenanceOption,
  MaintenanceStatusEvent,
  MaintenanceWork,
} from "../types/api-maintenance.types"
import type {
  MaintenanceCardDetail,
  MaintenanceCardListRow,
  MaintenanceCardStatus,
  MaintenanceStatusEventRow,
  MaintenanceWorkRow,
  PersistedWorkStatus,
} from "../types/maintenance-detail.types"

export function mapCardStatus(status: ApiCardStatus): MaintenanceCardStatus {
  return status === "CLOSED" ? "closed" : "open"
}

export function mapWorkStatus(status: ApiWorkStatus): PersistedWorkStatus {
  switch (status) {
    case "IN_PROGRESS":
      return "in_progress"
    case "COMPLETED":
      return "completed"
    case "CANCELLED":
      return "cancelled"
    default:
      return "pending"
  }
}

function toCost(value: string | number | null | undefined): number | null {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function mapWork(work: MaintenanceWork): MaintenanceWorkRow {
  return {
    id: work.id,
    description: work.description,
    displayOrder: work.displayOrder,
    isRequired: work.isRequired,
    estimatedCost: toCost(work.estimatedCost),
    status: mapWorkStatus(work.status),
    completedAt: work.completedAt ?? null,
  }
}

function mapStatusEvent(event: MaintenanceStatusEvent): MaintenanceStatusEventRow {
  const changedBy = event.changedBy
    ? {
        id: event.changedBy.id,
        name: [event.changedBy.firstName, event.changedBy.lastName]
          .filter(Boolean)
          .join(" ") || event.changedBy.email,
      }
    : null
  return {
    id: event.id,
    fromStatus: event.fromStatus ? mapCardStatus(event.fromStatus) : null,
    toStatus: mapCardStatus(event.toStatus),
    createdAt: event.createdAt,
    changedBy,
  }
}

export function mapListRow(row: ApiMaintenanceCardListRow): MaintenanceCardListRow {
  const customer = row.customer ?? { id: 0, name: "", phone: "" }
  const vehicle = row.vehicleOwnership?.vehicle ?? { id: 0, make: "", model: "", plateNumber: "" }
  return {
    id: row.id,
    cardNumber: row.cardNumber,
    status: mapCardStatus(row.status),
    receivedAt: row.receivedAt,
    expectedDeliveryAt: row.expectedDeliveryAt ?? null,
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? null,
    },
    vehicle: {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
    },
  }
}

export function mapDetail(detail: ApiMaintenanceCardDetail): MaintenanceCardDetail {
  const customer = detail.customer ?? { id: 0, name: "", phone: "" }
  const vehicle = detail.vehicleOwnership?.vehicle ?? {
    id: 0,
    make: "",
    model: "",
    plateNumber: "",
  }
  const createdBy = detail.createdBy
    ? {
        id: detail.createdBy.id,
        name:
          [detail.createdBy.firstName, detail.createdBy.lastName].filter(Boolean).join(" ") ||
          detail.createdBy.email,
      }
    : null
  const toOptions = (items: Array<Record<string, MaintenanceOption | null | undefined>>): MaintenanceOption[] =>
    items
      .map((item) => item.visitReason ?? item.conditionOption ?? item.itemOption ?? null)
      .filter((option): option is MaintenanceOption => Boolean(option))
  return {
    id: detail.id,
    cardNumber: detail.cardNumber,
    status: mapCardStatus(detail.status),
    receivedAt: detail.receivedAt,
    expectedDeliveryAt: detail.expectedDeliveryAt ?? null,
    mileage: detail.mileage,
    fuelLevel: detail.fuelLevel.toLowerCase(),
    customerComplaint: detail.customerComplaint ?? null,
    inspectionNotes: detail.inspectionNotes ?? null,
    customerApproved: detail.customerApproved,
    customerApprovalName: detail.customerApprovalName ?? null,
    customerApprovedAt: detail.customerApprovedAt ?? null,
    customer: {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email ?? null,
    },
    vehicleOwnershipId: detail.vehicleOwnership?.id ?? 0,
    vehicle: {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      manufactureYear: vehicle.manufactureYear ?? null,
      plateNumber: vehicle.plateNumber,
      vin: vehicle.vin ?? null,
      transmission: vehicle.transmission ? vehicle.transmission.toLowerCase() : null,
    },
    createdBy,
    visitReasons: toOptions(detail.visitReasons ?? []),
    conditionOptions: toOptions(detail.conditionOptions ?? []),
    itemOptions: toOptions(detail.itemOptions ?? []),
    requiredWorks: (detail.requiredWorks ?? []).map(mapWork),
    statusEvents: (detail.statusEvents ?? []).map(mapStatusEvent),
  }
}