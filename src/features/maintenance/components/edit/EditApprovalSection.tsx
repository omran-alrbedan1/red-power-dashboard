import { useTranslation } from "react-i18next"
import { CalendarClock, User } from "lucide-react"
import { useWatch, type Control } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { EditMaintenanceCardFormInputValues } from "../../validation/maintenance.validation"

interface EditApprovalSectionProps {
  control: Control<EditMaintenanceCardFormInputValues>
}

export function EditApprovalSection({ control }: EditApprovalSectionProps) {
  const { t, i18n } = useTranslation("maintenance")
  const approved = useWatch({ control, name: "approved" })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CustomFormField fieldType={FormFieldType.SWITCH} control={control} name="approved" label={t("approval.approved")} dir={i18n.dir()} />
      <CustomFormField fieldType={FormFieldType.INPUT} control={control} name="approvalName" label={t("approval.customerName")} placeholder={t("approval.customerName")} leftIcon={User} iconPosition="left" required={approved} disabled={!approved} dir={i18n.dir()} />
      <CustomFormField fieldType={FormFieldType.DATE_PICKER} control={control} name="deliveryDate" label={t("approval.deliveryDate")} dateOptions={{ placeholder: t("approval.deliveryDate") }} dir={i18n.dir()} />
      <CustomFormField fieldType={FormFieldType.TIME_PICKER} control={control} name="deliveryTime" label={t("approval.deliveryTime")} timeOptions={{ placeholder: t("approval.deliveryTime") }} dir={i18n.dir()} />
      <p className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2"><CalendarClock className="size-4 text-primary" />{t("edit.approvalTimestampHint")}</p>
    </div>
  )
}
