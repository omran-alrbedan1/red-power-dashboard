import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Hash, Languages, ListOrdered, Type } from "lucide-react"

import { Form } from "@/components/ui/form"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"

import {
  createMaintenanceOptionSchema,
  updateMaintenanceOptionSchema,
  type CreateMaintenanceOptionFormValues,
  type UpdateMaintenanceOptionFormValues,
} from "../validation/maintenance-option.validation"

interface MaintenanceOptionFormBaseProps {
  isSubmitting?: boolean
  submitLabel?: string
}

export type MaintenanceOptionFormMode = "create" | "edit"

interface CreateMaintenanceOptionFormProps extends MaintenanceOptionFormBaseProps {
  mode: "create"
  defaultValues?: Partial<CreateMaintenanceOptionFormValues>
  onSubmit: (values: CreateMaintenanceOptionFormValues) => void
}

interface EditMaintenanceOptionFormProps extends MaintenanceOptionFormBaseProps {
  mode: "edit"
  defaultValues?: Partial<UpdateMaintenanceOptionFormValues>
  onSubmit: (values: UpdateMaintenanceOptionFormValues) => void
}

type MaintenanceOptionFormProps =
  | CreateMaintenanceOptionFormProps
  | EditMaintenanceOptionFormProps

export const MaintenanceOptionForm: React.FC<MaintenanceOptionFormProps> = (props) => {
  return props.mode === "create"
    ? <CreateOptionForm {...props} />
    : <EditOptionForm {...props} />
}

const CreateOptionForm: React.FC<CreateMaintenanceOptionFormProps> = ({
  defaultValues,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}) => {
  const { t } = useTranslation("maintenance-options")
  const form = useForm<CreateMaintenanceOptionFormValues>({
    resolver: zodResolver(createMaintenanceOptionSchema(t)),
    defaultValues: {
      code: "",
      labelEn: "",
      labelAr: "",
      displayOrder: 0,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="code"
            label={t("fields.code", "Code")}
            placeholder={t("fields.codePlaceholder", "e.g. OIL_CHANGE")}
            required
            leftIcon={Hash}
            iconPosition="left"
            dir="ltr"
          />

          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            control={form.control}
            name="displayOrder"
            label={t("fields.displayOrder", "Display Order")}
            placeholder={t("fields.displayOrderPlaceholder", "0")}
            min={0}
            leftIcon={ListOrdered}
            iconPosition="left"
            dir="ltr"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="labelEn"
          label={t("fields.labelEn", "English Name")}
          placeholder={t("fields.labelEnPlaceholder", "Enter the English name")}
          required
          leftIcon={Type}
          iconPosition="left"
          dir="ltr"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="labelAr"
          label={t("fields.labelAr", "Arabic Name")}
          placeholder={t("fields.labelArPlaceholder", "أدخل الاسم بالعربية")}
          required
          leftIcon={Languages}
          iconPosition="left"
          dir="rtl"
        />

        <div className="border-t border-border/60 pt-5">
          <SubmitButton
            isLoading={isSubmitting}
            text={submitLabel ?? t("save", "Save")}
          />
        </div>
      </form>
    </Form>
  )
}

const EditOptionForm: React.FC<EditMaintenanceOptionFormProps> = ({
  defaultValues,
  isSubmitting = false,
  submitLabel,
  onSubmit,
}) => {
  const { t } = useTranslation("maintenance-options")

  const form = useForm<UpdateMaintenanceOptionFormValues>({
    resolver: zodResolver(updateMaintenanceOptionSchema(t)),
    defaultValues: {
      code: "",
      labelEn: "",
      labelAr: "",
      displayOrder: 0,
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="code"
            label={t("fields.code", "Code")}
            placeholder={t("fields.codePlaceholder", "e.g. OIL_CHANGE")}
            required
            leftIcon={Hash}
            iconPosition="left"
            dir="ltr"
          />

          <CustomFormField
            fieldType={FormFieldType.NUMBER}
            control={form.control}
            name="displayOrder"
            label={t("fields.displayOrder", "Display Order")}
            placeholder={t("fields.displayOrderPlaceholder", "0")}
            min={0}
            leftIcon={ListOrdered}
            iconPosition="left"
            dir="ltr"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="labelEn"
          label={t("fields.labelEn", "English Name")}
          placeholder={t("fields.labelEnPlaceholder", "Enter the English name")}
          required
          leftIcon={Type}
          iconPosition="left"
          dir="ltr"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="labelAr"
          label={t("fields.labelAr", "Arabic Name")}
          placeholder={t("fields.labelArPlaceholder", "أدخل الاسم بالعربية")}
          required
          leftIcon={Languages}
          iconPosition="left"
          dir="rtl"
        />

        <div className="border-t border-border/60 pt-5">
          <SubmitButton
            isLoading={isSubmitting}
            text={submitLabel ?? t("save", "Save")}
          />
        </div>
      </form>
    </Form>
  )
}