import { useTranslation } from "react-i18next"
import type { Control } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"
import type { EditMaintenanceCardFormInputValues } from "../../validation/maintenance.validation"

interface EditItemsSectionProps {
  control: Control<EditMaintenanceCardFormInputValues>
  options: Option[]
  loading?: boolean
}

export function EditItemsSection({ control, options, loading = false }: EditItemsSectionProps) {
  const { t, i18n } = useTranslation("maintenance")

  return <CustomFormField fieldType={FormFieldType.MULTI_SELECT} control={control} name="itemOptionIds" label={t("itemsLeft.title")} options={options} searchPlaceholder={t("edit.searchOptions")} emptyMessage={t("edit.noOptions")} loading={loading} dir={i18n.dir()} />
}
