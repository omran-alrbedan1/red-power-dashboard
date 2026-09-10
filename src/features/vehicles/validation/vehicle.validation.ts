import * as z from "zod"

export const vehicleFormSchema = (t: (key: string) => string) => z.object({
  customerId: z.string().uuid(t("validation.customer")),
  make: z.string().min(1, t("validation.make")).max(100),
  model: z.string().min(1, t("validation.model")).max(100),
  manufactureYear: z.coerce.number().int().min(1886).max(new Date().getUTCFullYear() + 1),
  plateNumber: z.string().min(1, t("validation.plate")).max(30),
  vin: z.string().length(17, t("validation.vin")).optional().or(z.literal("")),
  color: z.string().max(50).optional(),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
})
export type VehicleFormValues = z.infer<ReturnType<typeof vehicleFormSchema>>
