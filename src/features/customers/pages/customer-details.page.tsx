import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { User, Phone, Mail } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ErrorState from "@/components/shared/states/ErrorState"
import { useCustomer } from "../hooks/useCustomer"
import { useAddVehicle } from "../hooks/useCustomers"
import { CustomerVehicles } from "../components/customer-vehicles"
import { CustomerHistoryView } from "../components/customer-history"
import { VehicleForm } from "../components/vehicle-form"
import type { VehicleFormValues } from "../validation/customer.validation"
import type { VehicleInput } from "../services/customer.service"

const DetailItem: React.FC<{
  icon: React.ElementType
  label: string
  value?: string
}> = ({ icon: Icon, label, value }) => {
  if (!value) return null
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  )
}

const CustomerDetailsPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)

  const { customer, vehicles, history, isLoading, isError, error, refetch } =
    useCustomer(customerId)
  const addVehicle = useAddVehicle()

  if (isError) {
    console.error("Error loading customer:", error)
    return <ErrorState variant="default" retry={refetch} />
  }

  if (isLoading || !customer) {
    return (
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-xl bg-muted/40" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
      </div>
    )
  }

  const handleAddVehicle = (values: VehicleFormValues) => {
    const input: VehicleInput = {
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      vin: values.vin || undefined,
      manufactureYear: values.manufactureYear,
      transmission: values.transmission,
      color: values.color || undefined,
    }
    addVehicle.mutate(
      { customerId: customer.id, input },
      {
        onSuccess: () => setVehicleDialogOpen(false),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={customer.name}
        description={t("details")}
        showBackButton
        backButtonLabel={t("backToList")}
        onBackClick={() => navigate("/customers")}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
            <User className="h-5 w-5 text-primary" />
            {t("details")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem
              icon={Phone}
              label={t("fields.phone")}
              value={customer.phone}
            />
            <DetailItem
              icon={Mail}
              label={t("fields.email")}
              value={customer.email}
            />
          </div>
        </CardContent>
      </Card>

      <CustomerVehicles
        vehicles={vehicles}
        onAddClick={() => setVehicleDialogOpen(true)}
      />

      <CustomerHistoryView history={history} isLoading={isLoading} />

      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("vehicles.addVehicle")}</DialogTitle>
            <DialogDescription>{t("vehicles.title")}</DialogDescription>
          </DialogHeader>
          <VehicleForm
            onSubmit={handleAddVehicle}
            isSubmitting={addVehicle.isPending}
            submitLabel={t("vehicles.addVehicle")}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomerDetailsPage
