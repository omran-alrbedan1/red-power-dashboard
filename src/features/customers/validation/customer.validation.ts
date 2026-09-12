import * as z from "zod"

export const createCustomerFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: t("validation.nameRequired") })
      .max(150, { message: t("validation.nameMax") }),
    phone: z
      .string()
      .trim()
      .min(1, { message: t("validation.phoneRequired") })
      .max(30, { message: t("validation.phoneMax") }),
    email: z
      .string()
      .trim()
      .email({ message: t("validation.emailInvalid") })
      .max(254, { message: t("validation.emailMax") })
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
