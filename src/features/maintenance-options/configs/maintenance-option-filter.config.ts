import { Search, ListFilter } from "lucide-react"
import type { FilterField } from "@/components/shared/custom/CustomFilter"

export type MaintenanceOptionStatusFilter = "active" | "inactive" | ""

export interface MaintenanceOptionFilterValues {
  search: string
  status: MaintenanceOptionStatusFilter
}

export const maintenanceOptionFilterDefaultValues: MaintenanceOptionFilterValues = {
  search: "",
  status: "",
}

export const maintenanceOptionFilterFields = (
  t: (key: string) => string,
): FilterField<MaintenanceOptionFilterValues>[] => [
  {
    name: "search",
    label: t("filter.search"),
    type: "text",
    icon: Search,
    placeholder: t("searchPlaceholder"),
  },
  {
    name: "status",
    label: t("filter.status"),
    type: "select",
    icon: ListFilter,
    placeholder: t("filter.status"),
    options: [
      { value: "active", label: t("status.active") },
      { value: "inactive", label: t("status.inactive") },
    ],
  },
]