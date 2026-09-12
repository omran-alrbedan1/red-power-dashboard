import React from "react"
import { useTranslation } from "react-i18next"
import { CarFront, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import EmptyState from "@/components/shared/states/EmptyState"

import type { Vehicle } from "../types/vehicle.types"

import { VehicleCard } from "./VehicleCard"

interface CustomerVehiclesProps {
  vehicles: Vehicle[]
  onAddClick: () => void
}

export const CustomerVehicles: React.FC<CustomerVehiclesProps> = ({
  vehicles,
  onAddClick,
}) => {
  const { t } = useTranslation("customers")

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-background-card shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CarFront className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary">
              {t("vehicles.title", "Vehicles")}
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
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
          className="h-10 gap-2 rounded-xl px-4"
        >
          <Plus className="h-4 w-4" />
          {t("vehicles.addVehicle", "Add Vehicle")}
        </Button>
      </div>

      <div className="p-5">
        {vehicles.length === 0 ? (
          <EmptyState
            icon={CarFront}
            title={t("vehicles.noVehicles", "No vehicles yet")}
            description={t(
              "vehicles.noVehiclesDescription",
              "Add the customer's first vehicle to start tracking maintenance.",
            )}
            className="rounded-xl bg-transparent py-10"
          />
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}