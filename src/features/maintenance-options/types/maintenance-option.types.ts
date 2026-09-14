/**
 * Maintenance-options domain types.
 *
 * The backend `GET /maintenance-card-options/:kind` contract returns a plain
 * array of `{ id, code, label, displayOrder, isActive }` where `label` is
 * resolved server-side for the request language (Accept-Language). The
 * management row below is bilingual: the frontend fetches the list once per
 * language and merges by id so both labels are always available in the UI.
 */

export type MaintenanceOptionKind =
  | "visit-reasons"
  | "vehicle-conditions"
  | "vehicle-items"

/** Raw row returned by `GET /maintenance-card-options/:kind` (one language). */
export interface MaintenanceOptionApiItem {
  id: number
  code: string
  label: string
  displayOrder: number
  isActive: boolean
}

/** Bilingual management row: `labelEn` + `labelAr` merged from both fetches. */
export interface MaintenanceOptionRow {
  id: number
  code: string
  labelEn: string
  labelAr: string
  displayOrder: number
  isActive: boolean
}

/** Request body for `POST /maintenance-card-options/:kind`. */
export interface CreateMaintenanceOptionInput {
  code: string
  labelEn: string
  labelAr: string
  displayOrder: number
}

/** Partial request body for `PATCH /maintenance-card-options/:kind/:id`. */
export interface UpdateMaintenanceOptionInput {
  code?: string
  labelEn?: string
  labelAr?: string
  displayOrder?: number
}

export interface MaintenanceOptionListParams {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}