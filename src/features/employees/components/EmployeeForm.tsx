import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import {
  User,
  Mail,
  Lock,
} from "lucide-react"

import { Form } from "@/components/ui/form"

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"

import { SubmitButton } from "@/components/shared/buttons/SubmitButton"

import {
  createEmployeeFormSchema,
  type EmployeeFormValues,
} from "../validation/employee.validation"

interface EmployeeFormProps {
  onSubmit: (values: EmployeeFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
  submitIcon?: React.ReactNode
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submitIcon,
}) => {
  const { t, i18n } = useTranslation("employees")

  const isArabic = i18n.language.startsWith("ar")

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeFormSchema(t)),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label={t("fields.firstName", "First Name")}
            placeholder={t("fields.firstNamePlaceholder", "Enter first name")}
            required
            leftIcon={User}
            iconPosition="left"
            dir={isArabic ? "rtl" : "ltr"}
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label={t("fields.lastName", "Last Name")}
            placeholder={t("fields.lastNamePlaceholder", "Enter last name")}
            required
            leftIcon={User}
            iconPosition="left"
            dir={isArabic ? "rtl" : "ltr"}
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label={t("fields.email", "Email")}
          placeholder={t("fields.emailPlaceholder", "name@example.com")}
          required
          leftIcon={Mail}
          iconPosition="left"
          dir="ltr"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            label={t("fields.password", "Password")}
            placeholder={t("fields.passwordPlaceholder", "Enter password")}
            required
            leftIcon={Lock}
            iconPosition="left"
            dir="ltr"
          />

          <CustomFormField
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="confirmPassword"
            label={t("fields.confirmPassword", "Confirm Password")}
            placeholder={t("fields.confirmPasswordPlaceholder", "Re-enter password")}
            required
            leftIcon={Lock}
            iconPosition="left"
            dir="ltr"
          />
        </div>

        <div className="border-t border-border/60 pt-5">
          <SubmitButton
            isLoading={isSubmitting}
            text={submitLabel ?? t("addEmployee", "Add Employee")}
            icon={submitIcon}
          />
        </div>
      </form>
    </Form>
  )
}