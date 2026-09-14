import { Search, ListFilter } from "lucide-react"
import type { FilterField } from "@/components/shared/custom/CustomFilter"

export type EmployeeStatusFilter = "active" | "inactive" | ""

export interface EmployeeFilterValues {
  search: string
  status: EmployeeStatusFilter
}

export const employeeFilterDefaultValues: EmployeeFilterValues = {
  search: "",
  status: "",
}

export const employeeFilterFields = (
  t: (key: string) => string,
): FilterField<EmployeeFilterValues>[] => [
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