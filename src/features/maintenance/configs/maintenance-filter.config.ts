import { ListFilter, CalendarDays, Search } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { FilterField } from "@/components/shared/custom/CustomFilter"

export interface MaintenanceFilterValues {
  search: string
  status: string
  receivedAt: DateRange | undefined
}

export const maintenanceFilterDefaultValues: MaintenanceFilterValues = {
  search: "",
  status: "",
  receivedAt: undefined,
}

export const PERSISTED_STATUSES = ["open", "closed"] as const

export const maintenanceFilterFields = (
  t: (key: string) => string,
): FilterField<MaintenanceFilterValues>[] => [
  {
    name: "search",
    label: t("filter.search"),
    type: "text",
    icon: Search,
    placeholder: t("filter.search"),
  },
  {
    name: "status",
    label: t("filter.status"),
    type: "select",
    icon: ListFilter,
    placeholder: t("filter.status"),
    options: PERSISTED_STATUSES.map((status) => ({
      value: status,
      label: t(`statuses.${status}`),
    })),
  },
  {
    name: "receivedAt",
    label: t("filter.receivedAt"),
    type: "date-range",
    icon: CalendarDays,
  },
]