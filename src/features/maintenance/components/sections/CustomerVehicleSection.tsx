import { useTranslation } from "react-i18next"
import { User, Phone, Mail, Factory, Car, Hash, Fingerprint, Gauge } from "lucide-react"
import type { Control, FieldValues, Path } from "react-hook-form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import type { Option } from "@/types/customFormField.types"

interface CustomerVehicleSectionProps<T extends FieldValues> {
  control: Control<T>
}

export const CustomerVehicleSection = <T extends FieldValues>({
  control,
}: CustomerVehicleSectionProps<T>) => {
  const { t } = useTranslation("maintenance")

  const fuelOptions: Option[] = [
    { value: "petrol", label: t("vehicle.fuel_type.petrol") },
    { value: "diesel", label: t("vehicle.fuel_type.diesel") },
    { value: "hybrid", label: t("vehicle.fuel_type.hybrid") },
    { value: "electric", label: t("vehicle.fuel_type.electric") },
    { value: "other", label: t("vehicle.fuel_type.other") },
  ]

  const transmissionOptions: Option[] = [
    { value: "automatic", label: t("vehicle.transmission_type.automatic") },
    { value: "manual", label: t("vehicle.transmission_type.manual") },
  ]

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

      <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
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
          fieldType={FormFieldType.NUMBER}
          control={control}
          name={"vehicleMileage" as Path<T>}
          label={t("vehicle.mileage")}
          placeholder={t("vehicle.mileage")}
          min={0}
          leftIcon={Gauge}
          iconPosition="left"
          dir="ltr"
        />
      </div>

      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={control}
        name={"vehicleFuel" as Path<T>}
        label={t("vehicle.fuelType")}
        placeholder={t("vehicle.fuelType")}
        options={fuelOptions}
        dir="rtl"
      />
      <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={control}
        name={"vehicleTransmission" as Path<T>}
        label={t("vehicle.transmissionType")}
        placeholder={t("vehicle.transmissionType")}
        options={transmissionOptions}
        dir="rtl"
      />
    </div>
  )
}
