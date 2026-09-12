import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Mail,
  Phone,
  User,
} from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"

import { useCustomer } from "../hooks/useCustomer"
import { useAddVehicle } from "../hooks/useCustomers"

import { AddVehicleDialog } from "../components/AddVehicleDialog"
import { CustomerVehicles } from "../components/CustomerVehicles"
import { CustomerHistoryView } from "../components/CustomerHistory"

import type { VehicleFormValues } from "../validation/customer.validation"
import type { VehicleInput } from "../services/customer.service"
import { images } from "@/constants/images"

interface DetailItemProps {
  icon: React.ElementType
  label: string
  value?: string | null
  ltr?: boolean
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  label,
  value,
  ltr = false,
}) => {
  if (!value) {
    return null
  }

  return (
    <div
      className="
        flex min-h-[82px] items-center gap-4
        rounded-xl border border-border/60
        bg-background-secondary/20
        px-4 py-3
      "
    >
      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-full
          bg-primary/10
          text-primary
        "
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>

        <p
          className="
            mt-1 truncate text-sm
            font-semibold text-text-primary
          "
          dir={ltr ? "ltr" : undefined}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "?"
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const CustomerDetailsPage: React.FC = () => {
  const { t } = useTranslation("customers")

  const { customerId } =
    useParams<{ customerId: string }>()

  const navigate = useNavigate()

  const [
    vehicleDialogOpen,
    setVehicleDialogOpen,
  ] = useState(false)

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
    return (
      <ErrorState
        variant="default"
        retry={refetch}
      />
    )
  }

  if (isLoading || !customer) {
    return (
      <div className="flex flex-col gap-5">
        <div
          className="
            h-[180px] animate-pulse
            rounded-2xl
            bg-background-secondary
          "
        />

        <div
          className="
            h-[180px] animate-pulse
            rounded-2xl
            bg-background-secondary
          "
        />

        <div
          className="
            h-[220px] animate-pulse
            rounded-2xl
            bg-background-secondary
          "
        />

        <div
          className="
            h-[220px] animate-pulse
            rounded-2xl
            bg-background-secondary
          "
        />
      </div>
    )
  }

  const handleAddVehicle = (
    values: VehicleFormValues,
  ) => {
    const input: VehicleInput = {
      make: values.make,
      model: values.model,
      plateNumber: values.plateNumber,
      vin: values.vin || undefined,
      manufactureYear:
        values.manufactureYear,
      transmission:
        values.transmission,
      color:
        values.color || undefined,
    }

    addVehicle.mutate(
      {
        customerId: customer.id,
        input,
      },
      {
        onSuccess: () => {
          setVehicleDialogOpen(false)
        },
      },
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
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
        onBackClick={() =>
          navigate("/customers")
        }
        showDateTime
      />

      {/* Customer details */}
      <section
        className="
          overflow-hidden rounded-2xl
          border border-border/60
          bg-background-card
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        "
      >
        <div
          className="
            flex items-center justify-between
            border-b border-border/60
            px-5 py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2
                className="
                  text-base font-bold
                  text-text-primary
                "
              >
                {t(
                  "details",
                  "Customer Details",
                )}
              </h2>

              <p
                className="
                  mt-0.5 text-xs
                  text-text-muted
                "
              >
                {t(
                  "detailsSubtitle",
                  "Customer contact information",
                )}
              </p>
            </div>
          </div>

          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-primary/10
              text-sm font-bold
              text-primary
            "
          >
            {getInitials(customer.name)}
          </div>
        </div>

        <div
          className="
            grid gap-4 p-5
            md:grid-cols-2
          "
        >
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

      {/* Vehicles */}
      <CustomerVehicles
        vehicles={vehicles}
        onAddClick={() =>
          setVehicleDialogOpen(true)
        }
      />

      {/* Maintenance history */}
      <CustomerHistoryView
        history={history}
        isLoading={isLoading}
      />

      {/* Add vehicle dialog */}
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