import { useTranslation } from "react-i18next"
import type { Control } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"
import type { EditMaintenanceCardFormInputValues } from "../../validation/maintenance.validation"

interface EditConditionSectionProps {
  control: Control<EditMaintenanceCardFormInputValues>
  options: Option[]
  loading?: boolean
}

export function EditConditionSection({ control, options, loading = false }: EditConditionSectionProps) {
  const { t, i18n } = useTranslation("maintenance")

  return (
    <div className="space-y-4">
      <CustomFormField fieldType={FormFieldType.MULTI_SELECT} control={control} name="conditionOptionIds" label={t("condition.options")} options={options} searchPlaceholder={t("edit.searchOptions")} emptyMessage={t("edit.noOptions")} loading={loading} dir={i18n.dir()} />
      <CustomFormField fieldType={FormFieldType.TEXTAREA} control={control} name="inspectionNotes" label={t("condition.otherNotes")} placeholder={t("condition.otherNotes")} rows={3} dir={i18n.dir()} />
    </div>
  )
}
