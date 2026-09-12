import React from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  CarFront,
  ChevronRight,
  Palette,
  Plus,
  Settings2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type {
  TransmissionType,
  Vehicle,
} from "../types/vehicle.types"

const TRANSMISSION_KEYS: Record<
  TransmissionType,
  string
> = {
  automatic:
    "vehicles.transmissionTypes.automatic",
  manual:
    "vehicles.transmissionTypes.manual",
}

interface CustomerVehiclesProps {
  vehicles: Vehicle[]
  onAddClick: () => void
}

interface VehicleDetailProps {
  icon: React.ElementType
  label: string
  value?: string | number | null
  ltr?: boolean
}

const VehicleDetail: React.FC<
  VehicleDetailProps
> = ({
  icon: Icon,
  label,
  value,
  ltr = false,
}) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null
  }

  return (
    <div
      className="
        flex items-center gap-1.5
        text-xs text-text-muted
      "
    >
      <Icon
        className="
          h-3.5 w-3.5
          shrink-0 text-primary
        "
      />

      <span>
        {label}:
      </span>

      <span
        className="
          font-medium
          text-text-primary
        "
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  )
}

const VehicleCard: React.FC<{
  vehicle: Vehicle
}> = ({
  vehicle,
}) => {
  const { t } =
    useTranslation("customers")

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-xl
        border border-border/60
        bg-background-secondary/15
        px-4 py-4
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-16
          -end-14 h-36 w-36
          rounded-full
          bg-primary/[0.05]
          blur-3xl
        "
      />

      <div
        className="
          relative z-10
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* Vehicle identity */}
        <div
          className="
            flex min-w-0
            items-center gap-3
          "
        >
          <div
            className="
              flex h-12 w-12
              shrink-0 items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <CarFront className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm font-bold
                text-text-primary
              "
            >
              {vehicle.make}{" "}
              {vehicle.model}
            </p>

            <p
              className="
                mt-1 text-xs
                font-medium
                text-text-muted
              "
              dir="ltr"
            >
              {vehicle.plateNumber}
            </p>
          </div>
        </div>

        {/* Specs */}
        <div
          className="
            flex flex-1 flex-wrap
            items-center gap-x-5
            gap-y-2
            lg:justify-center
          "
        >
          <VehicleDetail
            icon={CalendarDays}
            label={t(
              "vehicles.fields.year",
              "Year",
            )}
            value={
              vehicle.manufactureYear
            }
          />

          <VehicleDetail
            icon={Palette}
            label={t(
              "vehicles.fields.color",
              "Color",
            )}
            value={vehicle.color}
          />

          {vehicle.transmission && (
            <VehicleDetail
              icon={Settings2}
              label={t(
                "vehicles.fields.transmissionType",
                "Transmission",
              )}
              value={t(
                TRANSMISSION_KEYS[
                  vehicle.transmission
                ],
              )}
            />
          )}
        </div>

        {/* VIN + arrow */}
        <div
          className="
            flex shrink-0
            items-center gap-3
          "
        >
          {vehicle.vin && (
            <Badge
              variant="outline"
              className="
                font-mono
                text-[10px]
                text-text-muted
              "
              dir="ltr"
            >
              {vehicle.vin.length > 10
                ? `${vehicle.vin.slice(
                    0,
                    8,
                  )}…`
                : vehicle.vin}
            </Badge>
          )}

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              bg-background-secondary
              text-text-muted
            "
          >
            <ChevronRight
              className="
                h-4 w-4
                rtl:rotate-180
              "
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const CustomerVehicles: React.FC<
  CustomerVehiclesProps
> = ({
  vehicles,
  onAddClick,
}) => {
  const { t } =
    useTranslation("customers")

  return (
    <section
      className="
        overflow-hidden rounded-2xl
        border border-border/60
        bg-background-card
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center
          justify-between gap-4
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
            <CarFront className="h-5 w-5" />
          </div>

          <div>
            <h2
              className="
                text-base font-bold
                text-text-primary
              "
            >
              {t(
                "vehicles.title",
                "Vehicles",
              )}
            </h2>

            <p
              className="
                mt-0.5 text-xs
                text-text-muted
              "
            >
              {t(
                "vehicles.description",
                "Vehicles registered for this customer",
              )}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onAddClick}
          size="sm"
          className="
            h-10 gap-2
            rounded-xl px-4
          "
        >
          <Plus className="h-4 w-4" />

          {t(
            "vehicles.addVehicle",
            "Add Vehicle",
          )}
        </Button>
      </div>

      {/* Content */}
      <div className="p-5">
        {vehicles.length === 0 ? (
          <div
            className="
              flex flex-col
              items-center
              justify-center
              py-10 text-center
            "
          >
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-xl
                bg-primary/10
                text-primary
              "
            >
              <CarFront className="h-5 w-5" />
            </div>

            <p
              className="
                mt-3 text-sm
                font-semibold
                text-text-primary
              "
            >
              {t(
                "vehicles.noVehicles",
                "No vehicles yet",
              )}
            </p>

            <p
              className="
                mt-1 max-w-sm
                text-xs
                text-text-muted
              "
            >
              {t(
                "vehicles.noVehiclesDescription",
                "Add the customer's first vehicle to start tracking maintenance.",
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map(
              (vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                />
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}