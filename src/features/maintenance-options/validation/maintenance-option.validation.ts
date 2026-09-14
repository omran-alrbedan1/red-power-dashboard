import * as z from "zod"

export const createMaintenanceOptionSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, { message: t("validation.codeRequired") })
      .max(100, { message: t("validation.codeMax") }),
    labelEn: z
      .string()
      .trim()
      .min(1, { message: t("validation.labelEnRequired") })
      .max(150, { message: t("validation.labelEnMax") }),
    labelAr: z
      .string()
      .trim()
      .min(1, { message: t("validation.labelArRequired") })
      .max(150, { message: t("validation.labelArMax") }),
    displayOrder: z
      .number()
      .int({ message: t("validation.displayOrderInt") })
      .min(0, { message: t("validation.displayOrderMin") }),
  })

export const updateMaintenanceOptionSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .trim()
      .max(100, { message: t("validation.codeMax") })
      .optional(),

    labelEn: z
      .string()
      .trim()
      .max(150, { message: t("validation.labelEnMax") })
      .optional(),

    labelAr: z
      .string()
      .trim()
      .max(150, { message: t("validation.labelArMax") })
      .optional(),

    displayOrder: z
      .number()
      .int({ message: t("validation.displayOrderInt") })
      .min(0, { message: t("validation.displayOrderMin") })
      .optional(),
  })
export type CreateMaintenanceOptionFormValues = z.infer<
  ReturnType<typeof createMaintenanceOptionSchema>
>

export type UpdateMaintenanceOptionFormValues = z.infer<
  ReturnType<typeof updateMaintenanceOptionSchema>
>