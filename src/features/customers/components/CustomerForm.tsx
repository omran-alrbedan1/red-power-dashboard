import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import {
  Mail,
  Phone,
  User,
} from "lucide-react"

import { Form } from "@/components/ui/form"

import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"

import { SubmitButton } from "@/components/shared/buttons/SubmitButton"

import {
  createCustomerFormSchema,
  type CustomerFormValues,
} from "../validation/customer.validation"

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormValues>

  onSubmit: (
    values: CustomerFormValues,
  ) => void

  isSubmitting?: boolean

  submitLabel?: string

  submitIcon?: React.ReactNode
}

export const CustomerForm: React.FC<
  CustomerFormProps
> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submitIcon,
}) => {
  const { t, i18n } =
    useTranslation("customers")

  const isArabic =
    i18n.language.startsWith("ar")

  const form =
    useForm<CustomerFormValues>({
      resolver: zodResolver(
        createCustomerFormSchema(t),
      ),

      defaultValues: {
        name:
          defaultValues?.name ?? "",

        phone:
          defaultValues?.phone ?? "",

        email:
          defaultValues?.email ?? "",
      },
    })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit,
        )}
        className="space-y-6"
        noValidate
      >
        {/* Name */}
        <CustomFormField
          fieldType={
            FormFieldType.INPUT
          }
          control={form.control}
          name="name"
          label={t(
            "fields.name",
            "Name",
          )}
          placeholder={t(
            "fields.namePlaceholder",
            "Enter customer name",
          )}
          required
          leftIcon={User}
          iconPosition="left"
          dir={
            isArabic
              ? "rtl"
              : "ltr"
          }
        />

        {/* Contact information */}
        <div
          className="
            grid gap-4
            md:grid-cols-2
          "
        >
          <CustomFormField
            fieldType={
              FormFieldType.PHONE
            }
            control={form.control}
            name="phone"
            label={t(
              "fields.phone",
              "Phone",
            )}
            placeholder={t(
              "fields.phonePlaceholder",
              "Enter phone number",
            )}
            required
            leftIcon={Phone}
            iconPosition="left"
            dir="ltr"
          />

          <CustomFormField
            fieldType={
              FormFieldType.EMAIL
            }
            control={form.control}
            name="email"
            label={t(
              "fields.email",
              "Email",
            )}
            placeholder={t(
              "fields.emailPlaceholder",
              "Enter email address",
            )}
            leftIcon={Mail}
            iconPosition="left"
            dir="ltr"
          />
        </div>

        {/* Submit */}
        <div
          className="
            border-t border-border/60
            pt-5
          "
        >
          <SubmitButton
            isLoading={
              isSubmitting
            }
            text={
              submitLabel ??
              t(
                "addCustomer",
                "Add Customer",
              )
            }
            icon={submitIcon}
          />
        </div>
      </form>
    </Form>
  )
}