import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Factory, Car, Hash, Fingerprint } from "lucide-react"
import { Form } from "@/components/ui/form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import type { Option } from "@/types/customFormField.types"
import {
  createVehicleFormSchema,
  type VehicleFormValues,
} from "../validation/customer.validation"
import type { TransmissionType } from "../types/vehicle.types"

const TRANSMISSION_KEYS: Record<TransmissionType, string> = {
  automatic: "vehicles.transmissionTypes.automatic",
  manual: "vehicles.transmissionTypes.manual",
}

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>
  onSubmit: (values: VehicleFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
  submitIcon?: React.ReactNode
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitIcon,
}) => {
  const { t } = useTranslation("customers")

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(createVehicleFormSchema(t)),
    defaultValues: {
      make: defaultValues?.make ?? "",
      model: defaultValues?.model ?? "",
      plateNumber: defaultValues?.plateNumber ?? "",
      vin: defaultValues?.vin ?? "",
      manufactureYear: defaultValues?.manufactureYear ?? new Date().getUTCFullYear(),
      transmission: defaultValues?.transmission ?? undefined,
      color: defaultValues?.color ?? "",
    },
  })

  const transmissionOptions = useMemo<Option[]>(
    () =>
      (Object.keys(TRANSMISSION_KEYS) as TransmissionType[]).map((key) => ({
        value: key,
        label: t(TRANSMISSION_KEYS[key]),
      })),
    [t],
  )

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="make"
            label={t("vehicles.fields.make")}
            placeholder={t("vehicles.fields.make")}
            required
            leftIcon={Factory}
            iconPosition="left"
            dir="rtl"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="model"
            label={t("vehicles.fields.model")}
            placeholder={t("vehicles.fields.model")}
            required
            leftIcon={Car}
            iconPosition="left"
            dir="rtl"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="plateNumber"
            label={t("vehicles.fields.plateNumber")}
            placeholder={t("vehicles.fields.plateNumber")}
            required
            leftIcon={Hash}
            iconPosition="left"
            dir="ltr"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="vin"
            label={t("vehicles.fields.vin")}
            placeholder={t("vehicles.fields.vin")}
            leftIcon={Fingerprint}
            iconPosition="left"
            dir="ltr"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            control={form.control}
            name="manufactureYear"
            label={t("vehicles.fields.year")}
            placeholder={t("vehicles.fields.year")}
            min={1900}
            max={2100}
            dir="ltr"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="transmission"
            label={t("vehicles.fields.transmissionType")}
            placeholder={t("vehicles.fields.transmissionType")}
            options={transmissionOptions}
            required
            dir="rtl"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="color"
          label={t("vehicles.fields.color")}
          placeholder={t("vehicles.fields.color")}
          dir="rtl"
        />

        <SubmitButton
          isLoading={isSubmitting}
          text={submitLabel ?? t("vehicles.addVehicle")}
          icon={submitIcon}
        />
      </form>
    </Form>
  )
}
