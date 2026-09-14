import * as z from "zod"

export const createEmployeeFormSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, { message: t("validation.firstNameRequired") })
        .max(150, { message: t("validation.firstNameMax") }),
      lastName: z
        .string()
        .trim()
        .min(1, { message: t("validation.lastNameRequired") })
        .max(150, { message: t("validation.lastNameMax") }),
      email: z
        .string()
        .trim()
        .email({ message: t("validation.emailInvalid") })
        .max(254, { message: t("validation.emailMax") }),
      password: z
        .string()
        .min(8, { message: t("validation.passwordMin") })
        .max(72, { message: t("validation.passwordMax") }),
      confirmPassword: z
        .string()
        .min(1, { message: t("validation.confirmRequired") }),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    })

export type EmployeeFormValues = z.infer<
  ReturnType<typeof createEmployeeFormSchema>
>