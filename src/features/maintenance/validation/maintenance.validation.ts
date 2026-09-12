import * as z from "zod"

const FUEL_LEVELS = [
  "empty",
  "quarter",
  "half",
  "three_quarters",
  "full",
] as const

export const createWorkItemRowSchema = (t: (key: string) => string) =>
  z.object({
    id: z.string().optional(),
    description: z
      .string()
      .min(1, { message: t("validation.workDescriptionRequired") }),
    estimatedCost: z.union([
      z.number().min(0, { message: t("validation.estimateNegative") }),
      z.literal(""),
    ]),
    isRequired: z.boolean().default(false),
  })

export type WorkItemRowValues = z.infer<
  ReturnType<typeof createWorkItemRowSchema>
>

export const createReceiptFormSchema = (t: (key: string) => string) =>
  z.object({
    customerName: z
      .string()
      .min(1, { message: t("validation.customerNameRequired") }),
    customerPhone: z
      .string()
      .min(9, { message: t("validation.customerPhoneRequired") }),
    customerEmail: z
      .string()
      .email({ message: t("validation.emailInvalid") })
      .optional()
      .or(z.literal("")),

    vehicleMake: z
      .string()
      .min(1, { message: t("validation.makeRequired") }),
    vehicleModel: z
      .string()
      .min(1, { message: t("validation.modelRequired") }),
    vehiclePlate: z
      .string()
      .min(1, { message: t("validation.plateRequired") }),
    vehicleYear: z.union([z.number().int().min(1900).max(2100), z.literal("")]).optional(),
    vehicleVin: z.string().optional(),
    vehicleMileage: z.union([z.number().min(0), z.literal("")]).optional(),
    vehicleTransmission: z.string().optional(),
    mileage: z.union([z.number().min(0), z.literal("")]).optional(),

    visitReasonIds: z
      .array(z.string())
      .min(1, { message: t("validation.reasonRequired") }),
    conditionOptionIds: z.array(z.string()).default([]),
    itemOptionIds: z.array(z.string()).default([]),
    fuelLevel: z.string().default("half"),
    complaint: z.string().optional(),
    inspectionNotes: z.string().optional(),

    requiredWorks: z.array(createWorkItemRowSchema(t)).default([]),

    approved: z.boolean().default(false),
    approvalName: z.string().optional(),
    deliveryDate: z.date().optional().nullable(),
    deliveryTime: z.date().optional().nullable(),
  })

export type ReceiptFormValues = z.output<
  ReturnType<typeof createReceiptFormSchema>
>

export type ReceiptFormInputValues = z.input<
  ReturnType<typeof createReceiptFormSchema>
>

export const FUEL_LEVEL_VALUES: readonly string[] = FUEL_LEVELS