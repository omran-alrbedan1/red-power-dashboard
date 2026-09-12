import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { images } from "@/constants/images"

import { useCustomer } from "../hooks/useCustomer"
import {
  useAddVehicle,
  useActivateCustomer,
  useDeactivateCustomer,
  useUpdateCustomer,
} from "../hooks/useCustomers"

import { AddVehicleDialog } from "../components/AddVehicleDialog"
import { CustomerVehicles } from "../components/CustomerVehicles"
import { CustomerHistoryView } from "../components/CustomerHistory"
import { CustomerContactCard } from "../components/CustomerContactCard"
import { CustomerStatusDialog } from "../components/CustomerStatusDialog"
import { EditCustomerDialog } from "../components/EditCustomerDialog"
import CustomerDetailsSkeleton from "../components/CustomerDetailsSkeleton"

import type { VehicleFormValues } from "../validation/customer.validation"
import type { CustomerFormValues } from "../validation/customer.validation"
import type { VehicleInput } from "../services/customer.service"

type StatusDialogMode = "activate" | "deactivate" | null

const CustomerDetailsPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const { customerId } = useParams<{ customerId: string }>()
  const navigate = useNavigate()

  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [statusDialogMode, setStatusDialogMode] =
    useState<StatusDialogMode>(null)

  const {
    customer,
    vehicles,
    history,
    isLoading,
    isError,
    refetch,
  } = useCustomer(customerId)

  const addVehicle = useAddVehicle()
  const updateCustomer = useUpdateCustomer()
  const deactivateCustomer = useDeactivateCustomer()
  const activateCustomer = useActivateCustomer()

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

  const handleEditCustomer = (values: CustomerFormValues) => {
    updateCustomer.mutate(
      {
        id: customer.id,
        input: {
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
        },
      },
      {
        onSuccess: () => setEditDialogOpen(false),
      },
    )
  }

  const handleToggleStatus = () => {
    if (!statusDialogMode) return

    const isActivating = statusDialogMode === "activate"
    const mutation = isActivating
      ? activateCustomer
      : deactivateCustomer

    mutation.mutate(customer.id, {
      onSettled: () => setStatusDialogMode(null),
    })
  }

  const openStatusDialog = () => {
    setStatusDialogMode(
      customer.isActive ? "deactivate" : "activate",
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

      <CustomerContactCard
        customer={customer}
        onEdit={() => setEditDialogOpen(true)}
        onToggleStatus={openStatusDialog}
      />

      <CustomerVehicles
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

      <EditCustomerDialog
        open={editDialogOpen}
        customer={customer}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditCustomer}
        isSubmitting={updateCustomer.isPending}
      />

      <CustomerStatusDialog
        open={statusDialogMode !== null}
        mode={statusDialogMode ?? "deactivate"}
        customerName={customer.name}
        onConfirm={handleToggleStatus}
        onClose={() => setStatusDialogMode(null)}
        isSubmitting={
          deactivateCustomer.isPending || activateCustomer.isPending
        }
      />
    </div>
  )
}

export default CustomerDetailsPage