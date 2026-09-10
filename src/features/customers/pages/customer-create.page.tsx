import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { CustomerForm } from "../components/customer-form"
import { useCreateCustomer } from "../hooks/useCustomers"
import type { CustomerFormValues } from "../validation/customer.validation"
import { normalizeApiError } from "@/lib/api/api-error"

const CustomerCreatePage: React.FC = () => {
  const { t } = useTranslation("customers")
  const navigate = useNavigate()
  const createCustomer = useCreateCustomer()

  const handleSubmit = (values: CustomerFormValues) => {
    createCustomer.mutate({
      name: values.name,
      phone: values.phone,
      email: values.email || undefined,
    }, {
      onSuccess: (customer) =>
        navigate(`/customers/${customer.id}`, { replace: true }),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("addCustomer")}
        description={t("subtitle")}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <Card>
        <CardContent className="pt-6">
          <CustomerForm
            onSubmit={handleSubmit}
            isSubmitting={createCustomer.isPending}
            submitLabel={t("addCustomer")}
            submitIcon={<Plus className="h-4 w-4" />}
            serverError={createCustomer.error ? normalizeApiError(createCustomer.error).message : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerCreatePage
