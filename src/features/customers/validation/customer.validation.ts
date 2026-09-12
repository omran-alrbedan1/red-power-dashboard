import * as z from "zod"

export const createCustomerFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, { message: t("validation.nameRequired") })
      .min(3, { message: t("validation.nameMin") }),
    phone: z.string().min(9, { message: t("validation.phoneInvalid") }),
    email: z
      .string()
      .email({ message: t("validation.emailInvalid") })
      .optional()
      .or(z.literal("")),
  })

export type CustomerFormValues = z.infer<
  ReturnType<typeof createCustomerFormSchema>
>

export const createVehicleFormSchema = (t: (key: string) => string) =>
  z.object({
    make: z.string().min(1, { message: t("vehicles.validation.makeRequired") }),
    model: z.string().min(1, { message: t("vehicles.validation.modelRequired") }),
    plateNumber: z
      .string()
      .min(1, { message: t("vehicles.validation.plateRequired") }),
    manufactureYear: z.number().int().min(1886).max(new Date().getUTCFullYear() + 1),
    vin: z.union([z.literal(""), z.string().length(17, { message: t("vehicles.validation.vinInvalid") })]),
    transmission: z.enum(["automatic", "manual"], { message: t("vehicles.validation.transmissionRequired") }),
    color: z.string().optional(),
  })

export type VehicleFormValues = z.infer<
  ReturnType<typeof createVehicleFormSchema>
>
