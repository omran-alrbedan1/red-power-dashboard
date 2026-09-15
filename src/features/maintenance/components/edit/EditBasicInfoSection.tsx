import { useTranslation } from "react-i18next"
import { Fuel, Gauge } from "lucide-react"
import type { Control } from "react-hook-form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"
import type { EditMaintenanceCardFormInputValues } from "../../validation/maintenance.validation"

interface EditBasicInfoSectionProps {
  control: Control<EditMaintenanceCardFormInputValues>
}

export function EditBasicInfoSection({ control }: EditBasicInfoSectionProps) {
  const { t, i18n } = useTranslation("maintenance")
  const direction = i18n.dir()
  const fuelLevels: Option[] = ["empty", "quarter", "half", "three_quarters", "full"].map((value) => ({ value, label: t(`condition.fuelLevels.${value}`) }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CustomFormField fieldType={FormFieldType.NUMBER} control={control} name="mileage" label={t("vehicle.mileage")} placeholder={t("vehicle.mileage")} min={0} leftIcon={Gauge} iconPosition="left" required dir="ltr" />
      <CustomFormField fieldType={FormFieldType.SELECT} control={control} name="fuelLevel" label={t("condition.fuelLevel")} options={fuelLevels} leftIcon={Fuel} iconPosition="left" required dir={direction} />
    </div>
  )
}
