import { Search } from "lucide-react"
import type { FilterField } from "@/components/shared/custom/CustomFilter"

export interface CustomerFilterValues {
  search: string
  isActive: "true" | "false" | "all"
}

export const customerFilterDefaultValues: CustomerFilterValues = {
  search: "",
  isActive: "true",
}

export const customerFilterFields = (
  t: (key: string) => string,
): FilterField<CustomerFilterValues>[] => [
  {
    name: "search",
    label: t("filter.search"),
    type: "text",
    icon: Search,
    placeholder: t("searchPlaceholder"),
  },
  {
    name: "isActive",
    label: t("filter.status"),
    type: "select",
    icon: Search,
    options: [
      { value: "true", label: t("active") },
      { value: "false", label: t("inactive") },
      { value: "all", label: t("all") },
    ],
  },
]
