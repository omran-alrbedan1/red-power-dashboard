import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Mail, Phone, User } from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { images } from "@/constants/images"

import { useCustomer } from "../hooks/useCustomer"
import { useAddVehicle } from "../hooks/useCustomers"

import { AddVehicleDialog } from "../components/AddVehicleDialog"
import { CustomerVehicles } from "../components/CustomerVehicles"
import { CustomerHistoryView } from "../components/CustomerHistory"
import CustomerDetailsSkeleton from "../components/CustomerDetailsSkeleton"

import type { VehicleFormValues } from "../validation/customer.validation"
import type { VehicleInput } from "../services/customer.service"
import DetailItem from "@/components/shared/custom/DetailItem"

const CustomerDetailsPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()

  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)

  const {
    customer,
    vehicles,
    history,
    isLoading,
    isError,
    refetch,
  } = useCustomer(customerId)

  const addVehicle = useAddVehicle()

  if (isError) {
    return <ErrorState variant="default" retry={refetch} />
  }

  if (isLoading || !customer) {
    return <CustomerDetailsSkeleton />
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
      {
        customerId: customer.id,
        input,
      },
      {
        onSuccess: () => setVehicleDialogOpen(false),
      },
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={customer.name}
        description={t(
          "detailsDescription",
          "Registered workshop customer",
        )}
        backgroundImage={images.customerHero}
        showBackButton
        backButtonLabel={t(
          "backToList",
          "Back to customers",
        )}
        onBackClick={() => navigate("/customers")}
        showDateTime
      />

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-background-card shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-text-primary">
                {t("details", "Customer Details")}
              </h2>

              <p className="mt-0.5 text-xs text-text-muted">
                {t(
                  "detailsSubtitle",
                  "Customer contact information",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <DetailItem
            icon={Phone}
            label={t(
              "fields.phone",
              "Phone number",
            )}
            value={customer.phone}
            ltr
          />

          <DetailItem
            icon={Mail}
            label={t(
              "fields.email",
              "Email address",
            )}
            value={customer.email}
            ltr
          />
        </div>
      </section>

      <CustomerVehicles
      //@ts-ignore
        vehicles={vehicles}
        onAddClick={() => setVehicleDialogOpen(true)}
      />

      <CustomerHistoryView
        history={history}
        isLoading={isLoading}
      />

      <AddVehicleDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        onSubmit={handleAddVehicle}
        isSubmitting={addVehicle.isPending}
      />
    </div>
  )
}

export default CustomerDetailsPage