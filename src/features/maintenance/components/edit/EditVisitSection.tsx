import { useTranslation } from "react-i18next"
import { MessageSquareText } from "lucide-react"
import type { Control } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"
import type { EditMaintenanceCardFormInputValues } from "../../validation/maintenance.validation"

interface EditVisitSectionProps {
  control: Control<EditMaintenanceCardFormInputValues>
  options: Option[]
  loading?: boolean
}

export function EditVisitSection({ control, options, loading = false }: EditVisitSectionProps) {
  const { t, i18n } = useTranslation("maintenance")

  return (
    <div className="space-y-4">
      <CustomFormField fieldType={FormFieldType.MULTI_SELECT} control={control} name="visitReasonIds" label={t("reason.title")} options={options} searchPlaceholder={t("edit.searchOptions")} emptyMessage={t("edit.noOptions")} required loading={loading} dir={i18n.dir()} />
      <CustomFormField fieldType={FormFieldType.TEXTAREA} control={control} name="complaint" label={t("reason.complaint")} placeholder={t("reason.complaint")} rows={3} leftIcon={MessageSquareText} iconPosition="left" dir={i18n.dir()} />
    </div>
  )
}
