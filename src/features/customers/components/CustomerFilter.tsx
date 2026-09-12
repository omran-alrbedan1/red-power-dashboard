import { useTranslation } from "react-i18next"
import { CustomFilter } from "@/components/shared/custom/CustomFilter"
import {
  customerFilterDefaultValues,
  customerFilterFields,
  type CustomerFilterValues,
} from "../configs/customer-filter.config"

interface CustomerFilterProps {
  onApply: (values: CustomerFilterValues) => void
  onReset: () => void
  isLoading?: boolean
  initialFilters?: Partial<CustomerFilterValues>
}

export const CustomerFilter: React.FC<CustomerFilterProps> = ({
  onApply,
  onReset,
  isLoading,
  initialFilters,
}) => {
  const { t } = useTranslation("customers")
  const { t: tCommon } = useTranslation()

  return (
    <CustomFilter<CustomerFilterValues>
      filters={customerFilterFields(t)}
      onApplyFilters={onApply}
      onResetFilters={onReset}
      defaultValues={customerFilterDefaultValues}
      initialFilters={initialFilters}
      isLoading={isLoading}
      title={tCommon("common.filters")}
    />
  )
}
