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
    quantity: z.union([z.number().min(0), z.literal("")]).optional().nullable(),
    progress: z.number().min(0).max(100).default(0),
    assignee: z.string().optional(),
    status: z
      .enum(["pending", "in_progress", "completed", "cancelled"])
      .default("pending"),
    isRequired: z.boolean().default(false),
  })

export type WorkItemRowValues = z.infer<
  ReturnType<typeof createWorkItemRowSchema>
>

export const createReceiptFormSchema = (t: (key: string) => string) =>
  z
    .object({
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
      vehicleFuel: z.string().optional(),
      vehicleTransmission: z.string().optional(),

      visitReason: z
        .string()
        .min(1, { message: t("validation.reasonRequired") }),
      otherReason: z.string().optional(),
      complaint: z.string().optional(),

      fuelLevel: z.string().optional(),
      externalCondition: z.string().optional(),
      warningLights: z.boolean().optional(),
      tires: z.string().optional(),
      battery: z.string().optional(),
      glass: z.string().optional(),
      body: z.string().optional(),
      otherNotes: z.string().optional(),

      itemsLeft: z.array(z.string()).default([]),

      workItems: z.array(createWorkItemRowSchema(t)).default([]),

      approved: z.boolean().optional(),
      approvalAmount: z.union([z.number().min(0), z.literal("")]).optional(),
      deliveryDate: z.date().optional().nullable(),
      deliveryTime: z.date().optional().nullable(),
      receiverName: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      if (values.visitReason === "other" && !values.otherReason?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["otherReason"],
          message: t("validation.reasonRequired"),
        })
      }
    })

export type ReceiptFormValues = z.output<
  ReturnType<typeof createReceiptFormSchema>
>

export type ReceiptFormInputValues = z.input<
  ReturnType<typeof createReceiptFormSchema>
>

export const FUEL_LEVEL_VALUES: readonly string[] = FUEL_LEVELS
