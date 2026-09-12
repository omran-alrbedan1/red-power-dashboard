export type CustomerHistoryStatus = "OPEN" | "CLOSED"

export interface CustomerHistoryItem {
  id: number
  receiptNumber: string
  status: CustomerHistoryStatus
  entryDate: string
  deliveryDate?: string | null
  mileage: number
  vehicle: {
    id: number
    plateNumber: string
    make: string
    model: string
    vin?: string | null
  } | null
}

export interface CustomerHistoryPage {
  data: CustomerHistoryItem[]
  meta: {
    page: number
    limit: number
    total: number
  }
}