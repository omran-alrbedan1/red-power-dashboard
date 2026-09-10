import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Save } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import ErrorState from "@/components/shared/states/ErrorState"
import { ApiClientError, normalizeApiError } from "@/lib/api/api-error"
import { CustomerForm } from "../components/customer-form"
import { useCustomer } from "../hooks/useCustomer"
import { useUpdateCustomer } from "../hooks/useCustomers"
import type { CustomerFormValues } from "../validation/customer.validation"

const CustomerEditPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const customerQuery = useCustomer(customerId)
  const updateCustomer = useUpdateCustomer()

  if (customerQuery.isError) {
    const notFound = customerQuery.error instanceof ApiClientError && customerQuery.error.statusCode === 404
    return <ErrorState variant={notFound ? "404" : "default"} title={notFound ? t("notFound") : t("loadError")} description={customerQuery.error.message} retry={notFound ? undefined : () => void customerQuery.refetch()} />
  }

  if (customerQuery.isLoading || !customerQuery.data || !customerId) {
    return <div className="h-80 animate-pulse rounded-xl bg-muted/40" aria-busy="true" />
  }

  const handleSubmit = (values: CustomerFormValues) => {
    updateCustomer.mutate({ id: customerId, input: { name: values.name, phone: values.phone, email: values.email || undefined } }, { onSuccess: () => navigate(`/customers/${customerId}`, { replace: true }) })
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t("editCustomer")} description={customerQuery.data.name} showBackButton backButtonLabel={t("backToDetails")} onBackClick={() => navigate(`/customers/${customerId}`)} />
      <Card><CardContent className="pt-6"><CustomerForm key={customerQuery.data.updatedAt} defaultValues={{ name: customerQuery.data.name, phone: customerQuery.data.phone, email: customerQuery.data.email ?? "" }} onSubmit={handleSubmit} isSubmitting={updateCustomer.isPending} submitLabel={t("saveChanges")} submitIcon={<Save className="h-4 w-4" />} serverError={updateCustomer.error ? normalizeApiError(updateCustomer.error).message : undefined} /></CardContent></Card>
    </div>
  )
}

export default CustomerEditPage
