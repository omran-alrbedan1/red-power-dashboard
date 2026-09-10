import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Car, Hash, Palette, Save, User, CalendarDays } from "lucide-react"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { useCustomers } from "@/features/customers/hooks/useCustomers"
import { vehicleFormSchema, type VehicleFormValues } from "../validation/vehicle.validation"

interface Props { defaultValues?: Partial<VehicleFormValues>; edit?: boolean; submitting?: boolean; error?: string; onSubmit: (values: VehicleFormValues) => void }

export function VehicleForm({ defaultValues, edit, submitting, error, onSubmit }: Props) {
  const { t } = useTranslation("vehicles")
  const customers = useCustomers({ page: 1, limit: 100, isActive: true })
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema(t)) as never,
    defaultValues: { customerId: defaultValues?.customerId ?? "", make: defaultValues?.make ?? "", model: defaultValues?.model ?? "", manufactureYear: defaultValues?.manufactureYear ?? new Date().getUTCFullYear(), plateNumber: defaultValues?.plateNumber ?? "", vin: defaultValues?.vin ?? "", color: defaultValues?.color ?? "", transmission: defaultValues?.transmission ?? "AUTOMATIC" },
  })
  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
    {!edit && <CustomFormField fieldType={FormFieldType.SELECT} control={form.control} name="customerId" label={t("fields.customer")} placeholder={t("fields.customer")} required leftIcon={User} options={(customers.data?.items ?? []).map(c => ({ value: c.id, label: `${c.name} — ${c.phone}` }))} />}
    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="make" label={t("fields.make")} required leftIcon={Car} />
    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="model" label={t("fields.model")} required leftIcon={Car} />
    <CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="manufactureYear" label={t("fields.year")} required leftIcon={CalendarDays} />
    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="plateNumber" label={t("fields.plate")} required leftIcon={Hash} dir="ltr" />
    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="vin" label={t("fields.vin")} leftIcon={Hash} dir="ltr" />
    <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="color" label={t("fields.color")} leftIcon={Palette} />
    <CustomFormField fieldType={FormFieldType.SELECT} control={form.control} name="transmission" label={t("fields.transmission")} required options={[{value:"AUTOMATIC",label:t("transmission.AUTOMATIC")},{value:"MANUAL",label:t("transmission.MANUAL")}]} />
    {error && <div role="alert" className="sm:col-span-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{error}</div>}
    <div className="sm:col-span-2"><SubmitButton isLoading={submitting} text={edit ? t("save") : t("create")} icon={<Save className="h-4 w-4" />} /></div>
  </form></Form>
}
