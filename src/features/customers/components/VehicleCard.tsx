import React from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  CarFront,
  Palette,
  Settings2,
} from "lucide-react"

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

export const VehicleCard: React.FC<{
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

        </div>
      </div>
    </div>
  )
}