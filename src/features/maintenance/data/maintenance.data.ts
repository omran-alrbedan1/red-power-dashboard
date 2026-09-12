import type { MaintenanceCard } from "../types/maintenance.types"

export interface CustomerOption {
  id: string
  name: string
  phone: string
}

export interface VehicleOption {
  id: string
  customerId: string
  make: string
  model: string
  plateNumber: string
}

export const selectorCustomers: CustomerOption[] = [
  { id: "cus-001", name: "أحمد السميري", phone: "0551234567" },
  { id: "cus-002", name: "سارة العتيبي", phone: "0569876543" },
  { id: "cus-003", name: "خالد الدوسري", phone: "0531112223" },
]

export const selectorVehicles: VehicleOption[] = [
  { id: "veh-001", customerId: "cus-001", make: "تويوتا", model: "كامري", plateNumber: "أ ب ج 1234" },
  { id: "veh-002", customerId: "cus-001", make: "نيسان", model: "باترول", plateNumber: "س ص ق 7788" },
  { id: "veh-003", customerId: "cus-003", make: "هونداي", model: "سوناتا", plateNumber: "م ن ب 5123" },
]

export const initialCards: MaintenanceCard[] = [
  {
    id: "mnt-001",
    receiptNumber: "RC-2026-0007",
    status: "in_progress",
    createdAt: "2026-08-28T14:40:00.000Z",
    updatedAt: "2026-08-28T15:10:00.000Z",
    customerId: "cus-001",
    customerSnapshot: { name: "أحمد السميري", phone: "0551234567", email: "ahmed@example.com" },
    vehicleId: "veh-002",
    vehicleSnapshot: {
      make: "نيسان",
      model: "باترول",
      plateNumber: "س ص ق 7788",
      year: 2021,
      vin: "JN8AY2NF9MX123456",
      mileage: 42300,
      fuelType: "petrol",
      transmissionType: "automatic",
    },
    visitReason: "diagnostics",
    complaint: "سماع صوت غريب من الفرامل",
    condition: {
      fuelLevel: "half",
      externalCondition: "جيد",
      warningLights: false,
      tires: "البريمة الخلفية تحتاج تغيير",
    },
    itemsLeftInCar: ["شاحن جوال"],
    workItems: [
      {
        id: "mwi-001",
        description: "فحص الفرامل",
        estimatedCost: 150,
        quantity: 1,
        progress: 40,
        assignee: "شام",
        status: "in_progress",
        isRequired: true,
        displayOrder: 0,
      },
      {
        id: "mwi-002",
        description: "فحص نظام التبريد",
        estimatedCost: 0,
        quantity: 1,
        progress: 0,
        status: "pending",
        isRequired: true,
        displayOrder: 1,
      },
    ],
    approval: { approved: true, approvedAt: "2026-08-28T14:50:00.000Z", approvedByName: "أحمد السميري", amount: 150 },
    expectedDelivery: { date: "2026-08-29T00:00:00.000Z", time: "2026-08-29T16:00:00.000Z" },
    receiverName: "شام",
    activityEvents: [],
  },
  {
    id: "mnt-002",
    receiptNumber: "RC-2026-0008",
    status: "open",
    createdAt: "2026-09-01T09:05:00.000Z",
    updatedAt: "2026-09-01T09:05:00.000Z",
    customerId: "cus-002",
    customerSnapshot: { name: "سارة العتيبي", phone: "0569876543" },
    vehicleId: undefined,
    vehicleSnapshot: {
      make: "تويوتا",
      model: "لاندكروزر",
      plateNumber: "أ ب ج 5555",
      year: 2022,
      fuelType: "diesel",
    },
    visitReason: "periodic_service",
    complaint: "صيانة دورية",
    workItems: [
      {
        id: "mwi-003",
        description: "صيانة دورية كاملة",
        estimatedCost: 900,
        quantity: 1,
        progress: 10,
        assignee: "شام",
        status: "in_progress",
        isRequired: true,
        displayOrder: 0,
      },
    ],
    expectedDelivery: { date: "2026-09-03T00:00:00.000Z" },
    receiverName: "شام",
    activityEvents: [],
  },
]
