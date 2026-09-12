import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  Car,
  Factory,
  Fingerprint,
  Hash,
  Palette,
  Settings2,
} from "lucide-react"

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

const TRANSMISSION_KEYS: Record<
  TransmissionType,
  string
> = {
  automatic:
    "vehicles.transmissionTypes.automatic",

  manual:
    "vehicles.transmissionTypes.manual",
}

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormValues>

  onSubmit: (
    values: VehicleFormValues,
  ) => void

  isSubmitting?: boolean

  submitLabel?: string

  submitIcon?: React.ReactNode
}

interface FormSectionHeaderProps {
  icon: React.ElementType
  title: string
  description: string
}

const FormSectionHeader: React.FC<
  FormSectionHeaderProps
> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          bg-primary/10
          text-primary
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3
          className="
            text-sm font-semibold
            text-text-primary
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1 text-xs
            leading-5
            text-text-muted
          "
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export const VehicleForm: React.FC<
  VehicleFormProps
> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submitIcon,
}) => {
  const { t, i18n } =
    useTranslation("customers")

  const isArabic =
    i18n.language.startsWith("ar")

  const currentYear =
    new Date().getUTCFullYear()

  const form =
    useForm<VehicleFormValues>({
      resolver: zodResolver(
        createVehicleFormSchema(t),
      ),

      defaultValues: {
        make:
          defaultValues?.make ?? "",

        model:
          defaultValues?.model ?? "",

        plateNumber:
          defaultValues?.plateNumber ??
          "",

        vin:
          defaultValues?.vin ?? "",

        manufactureYear:
          defaultValues?.manufactureYear ??
          currentYear,

        transmission:
          defaultValues?.transmission ??
          undefined,

        color:
          defaultValues?.color ?? "",
      },
    })

  const transmissionOptions =
    useMemo<Option[]>(
      () =>
        (
          Object.keys(
            TRANSMISSION_KEYS,
          ) as TransmissionType[]
        ).map((key) => ({
          value: key,

          label: t(
            TRANSMISSION_KEYS[key],
          ),
        })),

      [t],
    )

  const handleSubmit = (
    values: VehicleFormValues,
  ) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          handleSubmit,
        )}
        className="space-y-6"
        noValidate
      >
        {/* Vehicle Information */}
        <section className="space-y-4">
          <FormSectionHeader
            icon={Car}
            title={t(
              "vehicles.form.basicInformation",
              "Vehicle Information",
            )}
            description={t(
              "vehicles.form.basicInformationDescription",
              "Enter the vehicle manufacturer and model information.",
            )}
          />

          <div
            className="
              grid gap-4
              sm:grid-cols-2
            "
          >
            <CustomFormField
              fieldType={
                FormFieldType.INPUT
              }
              control={form.control}
              name="make"
              label={t(
                "vehicles.fields.make",
                "Make",
              )}
              placeholder={t(
                "vehicles.fields.makePlaceholder",
                "e.g. Toyota",
              )}
              required
              leftIcon={Factory}
              iconPosition="left"
              dir={
                isArabic
                  ? "rtl"
                  : "ltr"
              }
            />

            <CustomFormField
              fieldType={
                FormFieldType.INPUT
              }
              control={form.control}
              name="model"
              label={t(
                "vehicles.fields.model",
                "Model",
              )}
              placeholder={t(
                "vehicles.fields.modelPlaceholder",
                "e.g. Camry",
              )}
              required
              leftIcon={Car}
              iconPosition="left"
              dir={
                isArabic
                  ? "rtl"
                  : "ltr"
              }
            />
          </div>
        </section>

        {/* Identification */}
        <section
          className="
            space-y-4
            border-t border-border/60
            pt-5
          "
        >
          <FormSectionHeader
            icon={Fingerprint}
            title={t(
              "vehicles.form.identification",
              "Vehicle Identification",
            )}
            description={t(
              "vehicles.form.identificationDescription",
              "Add the plate number and VIN if available.",
            )}
          />

          <div
            className="
              grid gap-4
              sm:grid-cols-2
            "
          >
            <CustomFormField
              fieldType={
                FormFieldType.INPUT
              }
              control={form.control}
              name="plateNumber"
              label={t(
                "vehicles.fields.plateNumber",
                "Plate Number",
              )}
              placeholder={t(
                "vehicles.fields.plateNumberPlaceholder",
                "Enter plate number",
              )}
              required
              leftIcon={Hash}
              iconPosition="left"
              dir="ltr"
            />

            <CustomFormField
              fieldType={
                FormFieldType.INPUT
              }
              control={form.control}
              name="vin"
              label={t(
                "vehicles.fields.vin",
                "VIN",
              )}
              placeholder={t(
                "vehicles.fields.vinPlaceholder",
                "Enter vehicle VIN",
              )}
              leftIcon={Fingerprint}
              iconPosition="left"
              dir="ltr"
            />
          </div>
        </section>

        {/* Specifications */}
        <section
          className="
            space-y-4
            border-t border-border/60
            pt-5
          "
        >
          <FormSectionHeader
            icon={Settings2}
            title={t(
              "vehicles.form.specifications",
              "Vehicle Specifications",
            )}
            description={t(
              "vehicles.form.specificationsDescription",
              "Enter the manufacturing year, transmission and color.",
            )}
          />

          <div
            className="
              grid gap-4
              sm:grid-cols-2
            "
          >
            <CustomFormField
              fieldType={
                FormFieldType.NUMBER
              }
              control={form.control}
              name="manufactureYear"
              label={t(
                "vehicles.fields.year",
                "Manufacture Year",
              )}
              placeholder={String(
                currentYear,
              )}
              min={1900}
              max={currentYear + 1}
              leftIcon={CalendarDays}
              iconPosition="left"
              dir="ltr"
            />

            <CustomFormField
              fieldType={
                FormFieldType.SELECT
              }
              control={form.control}
              name="transmission"
              label={t(
                "vehicles.fields.transmissionType",
                "Transmission",
              )}
              placeholder={t(
                "vehicles.fields.transmissionPlaceholder",
                "Select transmission",
              )}
              options={
                transmissionOptions
              }
              required
              leftIcon={Settings2}
              iconPosition="left"
              dir={
                isArabic
                  ? "rtl"
                  : "ltr"
              }
            />
          </div>

          <CustomFormField
            fieldType={
              FormFieldType.INPUT
            }
            control={form.control}
            name="color"
            label={t(
              "vehicles.fields.color",
              "Color",
            )}
            placeholder={t(
              "vehicles.fields.colorPlaceholder",
              "e.g. Black",
            )}
            leftIcon={Palette}
            iconPosition="left"
            dir={
              isArabic
                ? "rtl"
                : "ltr"
            }
          />
        </section>

        {/* Submit */}
        <div
          className="
            flex justify-end
            border-t border-border/60
            pt-5
          "
        >
          <div className="w-full sm:w-auto">
            <SubmitButton
              isLoading={
                isSubmitting
              }
              text={
                submitLabel ??
                t(
                  "vehicles.addVehicle",
                  "Add Vehicle",
                )
              }
              icon={submitIcon}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}