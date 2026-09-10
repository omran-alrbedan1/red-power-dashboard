import * as z from "zod"

export const createCustomerFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, { message: t("validation.nameRequired") })
      .max(150, { message: t("validation.nameMax") }),
    phone: z
      .string()
      .min(1, { message: t("validation.phoneRequired") })
      .max(30, { message: t("validation.phoneMax") }),
    email: z
      .string()
      .email({ message: t("validation.emailInvalid") })
      .max(254, { message: t("validation.emailMax") })
      .optional()
      .or(z.literal("")),
  })

export type CustomerFormValues = z.infer<
  ReturnType<typeof createCustomerFormSchema>
>
