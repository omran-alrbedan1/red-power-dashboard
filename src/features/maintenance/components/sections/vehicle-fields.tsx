import { useTranslation } from "react-i18next"
import { Factory, Car, Hash, Fingerprint, Cog } from "lucide-react"
import type { Control, FieldValues, Path } from "react-hook-form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"

interface VehicleFieldsProps<T extends FieldValues> {
  control: Control<T>
}

export const VehicleFields = <T extends FieldValues>({
  control,
}: VehicleFieldsProps<T>) => {
  const { t } = useTranslation("maintenance")

  const transmissionOptions: Option[] = [
    { value: "automatic", label: t("vehicle.transmission_type.automatic") },
    { value: "manual", label: t("vehicle.transmission_type.manual") },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name={"vehicleMake" as Path<T>}
          label={t("vehicle.make")}
          placeholder={t("vehicle.make")}
          required
          leftIcon={Factory}
          iconPosition="left"
          dir="rtl"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name={"vehicleModel" as Path<T>}
          label={t("vehicle.model")}
          placeholder={t("vehicle.model")}
          required
          leftIcon={Car}
          iconPosition="left"
          dir="rtl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name={"vehiclePlate" as Path<T>}
          label={t("vehicle.plateNumber")}
          placeholder={t("vehicle.plateNumber")}
          required
          leftIcon={Hash}
          iconPosition="left"
          dir="ltr"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={control}
          name={"vehicleVin" as Path<T>}
          label={t("vehicle.vin")}
          placeholder={t("vehicle.vin")}
          leftIcon={Fingerprint}
          iconPosition="left"
          dir="ltr"
        />
      </div>

      <CustomFormField
        fieldType={FormFieldType.NUMBER}
        control={control}
        name={"vehicleYear" as Path<T>}
        label={t("vehicle.year")}
        placeholder={t("vehicle.year")}
        min={1900}
        max={2100}
        dir="ltr"
      />
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={control}
        name={"vehicleTransmission" as Path<T>}
        label={t("vehicle.transmissionType")}
        placeholder={t("vehicle.transmissionType")}
        options={transmissionOptions}
        leftIcon={Cog}
        iconPosition="left"
        dir="rtl"
      />
    </div>
  )
}