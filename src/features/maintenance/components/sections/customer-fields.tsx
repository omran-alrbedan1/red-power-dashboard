import { useTranslation } from "react-i18next"
import { User, Phone, Mail } from "lucide-react"
import type { Control, FieldValues, Path } from "react-hook-form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"

interface CustomerFieldsProps<T extends FieldValues> {
  control: Control<T>
}

export const CustomerFields = <T extends FieldValues>({
  control,
}: CustomerFieldsProps<T>) => {
  const { t } = useTranslation("maintenance")

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CustomFormField
        fieldType={FormFieldType.INPUT}
        control={control}
        name={"customerName" as Path<T>}
        label={t("customer.name")}
        placeholder={t("customer.name")}
        required
        leftIcon={User}
        iconPosition="left"
        dir="rtl"
      />
      <CustomFormField
        fieldType={FormFieldType.PHONE}
        control={control}
        name={"customerPhone" as Path<T>}
        label={t("customer.phone")}
        placeholder={t("customer.phone")}
        required
        leftIcon={Phone}
        iconPosition="left"
        dir="ltr"
      />
      <CustomFormField
        fieldType={FormFieldType.EMAIL}
        control={control}
        name={"customerEmail" as Path<T>}
        label={t("customer.email")}
        placeholder={t("customer.email")}
        leftIcon={Mail}
        iconPosition="left"
        dir="ltr"
      />
    </div>
  )
}