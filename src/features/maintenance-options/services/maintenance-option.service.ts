import { apiRequest } from "@/lib/api/client"
import { cleanParams } from "@/lib/api/params"
import type { ApiPaginated, ApiPaginationMeta } from "@/lib/api/contracts"
import type {
  CreateMaintenanceOptionInput,
  MaintenanceOptionApiItem,
  MaintenanceOptionKind,
  MaintenanceOptionListParams,
  MaintenanceOptionRow,
  UpdateMaintenanceOptionInput,
} from "../types/maintenance-option.types"

const normalizeCode = (value: string) => value.trim().toUpperCase()
const trim = (value: string) => value.trim()

/** Bilingual management page returned by the service. */
export interface MaintenanceOptionPage {
  items: MaintenanceOptionRow[]
  meta: ApiPaginationMeta
}

/** One-language paginated fetch (backend resolves `label` per language). */
const listLanguage = (
  kind: MaintenanceOptionKind,
  params: MaintenanceOptionListParams,
  language: "ar" | "en",
) =>
  apiRequest<ApiPaginated<MaintenanceOptionApiItem>>({
    url: `/maintenance-card-options/${kind}`,
    params: cleanParams({
      search: params.search,
      isActive: params.isActive,
      page: params.page,
      limit: params.limit,
    }),
    headers: { "Accept-Language": language },
  })

/**
 * Fetches the same page once per language (search/isActive/page/limit are
 * identical) and merges by id into bilingual rows. `meta` comes from the
 * Arabic page; both pages describe the same filtered dataset.
 */
const list = async (
  kind: MaintenanceOptionKind,
  params: MaintenanceOptionListParams,
): Promise<MaintenanceOptionPage> => {
  const [ar, en] = await Promise.all([
    listLanguage(kind, params, "ar"),
    listLanguage(kind, params, "en"),
  ])

  const rows = new Map<number, MaintenanceOptionRow>()

  for (const item of ar.items) {
    rows.set(item.id, {
      id: item.id,
      code: item.code,
      labelEn: "",
      labelAr: item.label,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    })
  }

  for (const item of en.items) {
    const existing = rows.get(item.id)
    if (existing) {
      existing.labelEn = item.label
    } else {
      rows.set(item.id, {
        id: item.id,
        code: item.code,
        labelEn: item.label,
        labelAr: "",
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      })
    }
  }

  const items = [...rows.values()].sort(
    (a, b) => a.displayOrder - b.displayOrder || a.id - b.id,
  )

  return { items, meta: ar.meta }
}

export const maintenanceOptionService = {
  list,

  create: (kind: MaintenanceOptionKind, input: CreateMaintenanceOptionInput) =>
    apiRequest<MaintenanceOptionApiItem>({
      method: "POST",
      url: `/maintenance-card-options/${kind}`,
      data: {
        code: normalizeCode(input.code),
        labelEn: trim(input.labelEn),
        labelAr: trim(input.labelAr),
        displayOrder: input.displayOrder,
      },
    }),

  update: (kind: MaintenanceOptionKind, id: number, input: UpdateMaintenanceOptionInput) =>
    apiRequest<MaintenanceOptionApiItem>({
      method: "PATCH",
      url: `/maintenance-card-options/${kind}/${id}`,
      data: {
        ...(input.code !== undefined ? { code: normalizeCode(input.code) } : {}),
        ...(input.labelEn !== undefined ? { labelEn: trim(input.labelEn) } : {}),
        ...(input.labelAr !== undefined ? { labelAr: trim(input.labelAr) } : {}),
        ...(input.displayOrder !== undefined ? { displayOrder: input.displayOrder } : {}),
      },
    }),

  activate: (kind: MaintenanceOptionKind, id: number) =>
    apiRequest<MaintenanceOptionApiItem>({
      method: "PATCH",
      url: `/maintenance-card-options/${kind}/${id}/activate`,
    }),

  deactivate: (kind: MaintenanceOptionKind, id: number) =>
    apiRequest<MaintenanceOptionApiItem>({
      method: "PATCH",
      url: `/maintenance-card-options/${kind}/${id}/deactivate`,
    }),

  remove: (kind: MaintenanceOptionKind, id: number) =>
    apiRequest<null>({
      method: "DELETE",
      url: `/maintenance-card-options/${kind}/${id}`,
    }),
}