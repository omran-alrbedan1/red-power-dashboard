import { Search } from "lucide-react"
import type { FilterField } from "@/components/shared/custom/CustomFilter"

export interface CustomerFilterValues {
  search: string
}

export const customerFilterDefaultValues: CustomerFilterValues = {
  search: "",
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
]
