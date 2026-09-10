import type { PaginatedResponse } from "@/lib/api/api.types"

export type MaintenanceStatus = "OPEN" | "CLOSED"
export type MaintenanceWorkStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
export type FuelLevel = "EMPTY" | "QUARTER" | "HALF" | "THREE_QUARTERS" | "FULL"
export type MaintenanceOptionKind = "visit-reasons" | "vehicle-conditions" | "vehicle-items"
export interface MaintenancePerson { id: string; email: string; firstName: string | null; lastName: string | null }
export interface MaintenanceCustomer { id: string; name: string; phone: string; email: string | null; isActive: boolean }
export interface MaintenanceVehicle { id: string; make: string; model: string; manufactureYear: number; plateNumber: string; vin: string | null; color: string | null; transmission: "MANUAL" | "AUTOMATIC"; isActive: boolean }
export interface MaintenanceOwnership { id: string; startedAt: string; endedAt: string | null; vehicle: MaintenanceVehicle; customer?: MaintenanceCustomer }
export interface MaintenanceOption { id: string; code: string; label: string; displayOrder: number; isActive: boolean }
export interface RequiredWork { id: string; maintenanceCardId: string; description: string; displayOrder: number; isRequired: boolean; status: MaintenanceWorkStatus; estimatedCost: number | null; completedAt: string | null; createdAt: string; updatedAt: string }
export interface StatusEvent { id: string; fromStatus: MaintenanceStatus | null; toStatus: MaintenanceStatus; createdAt: string; changedBy: MaintenancePerson }
export interface MaintenanceCard {
  id: string; cardNumber: string; customerId: string; vehicleOwnershipId: string; receivedAt: string; expectedDeliveryAt: string | null; mileage: number; fuelLevel: FuelLevel; customerComplaint: string | null; inspectionNotes: string | null; status: MaintenanceStatus; customerApproved: boolean; customerApprovalName: string | null; customerApprovedAt: string | null; signatureStorageKey: string | null; createdAt: string; updatedAt: string; closedAt: string | null
  customer: MaintenanceCustomer; vehicleOwnership: MaintenanceOwnership; createdBy?: MaintenancePerson; closedBy?: MaintenancePerson | null
  visitReasons: Array<{ selectedAt: string; visitReason: MaintenanceOption }>; conditionOptions: Array<{ selectedAt: string; conditionOption: MaintenanceOption }>; itemOptions: Array<{ selectedAt: string; itemOption: MaintenanceOption }>; requiredWorks: RequiredWork[]; statusEvents: StatusEvent[]
}
export interface MaintenanceCardListItem extends Pick<MaintenanceCard, "id" | "cardNumber" | "status" | "receivedAt" | "expectedDeliveryAt" | "mileage" | "customer" | "vehicleOwnership"> {}
export interface MaintenanceListParams { page: number; limit: number; search?: string; status?: MaintenanceStatus; customerId?: string; vehicleId?: string; receivedFrom?: string; receivedTo?: string }
export type MaintenanceCardPage = PaginatedResponse<MaintenanceCardListItem>
export interface RequiredWorkInput { description: string; displayOrder: number; isRequired?: boolean; estimatedCost?: number | null }
export interface CreateMaintenanceCardInput { customerId: string; vehicleOwnershipId: string; receivedAt: string; expectedDeliveryAt?: string; mileage: number; fuelLevel: FuelLevel; customerComplaint?: string; inspectionNotes?: string; customerApproved: boolean; customerApprovalName?: string; customerApprovedAt?: string; visitReasonIds?: string[]; vehicleConditionOptionIds?: string[]; vehicleItemOptionIds?: string[]; requiredWorks?: RequiredWorkInput[] }
export interface UpdateMaintenanceCardInput { expectedDeliveryAt?: string | null; mileage?: number; fuelLevel?: FuelLevel; customerComplaint?: string; inspectionNotes?: string; customerApproved?: boolean; customerApprovalName?: string; customerApprovedAt?: string; visitReasonIds?: string[]; vehicleConditionOptionIds?: string[]; vehicleItemOptionIds?: string[] }
export type UpdateRequiredWorkInput = Partial<RequiredWorkInput & { status: MaintenanceWorkStatus }>
export const MAINTENANCE_STATUSES: MaintenanceStatus[] = ["OPEN", "CLOSED"]
export const WORK_STATUSES: MaintenanceWorkStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
export const FUEL_LEVELS: FuelLevel[] = ["EMPTY", "QUARTER", "HALF", "THREE_QUARTERS", "FULL"]
