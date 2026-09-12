import React from "react"
import { CarFront, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { formatNumber } from "@/lib/formatter"

interface DashboardEntityOverviewProps {
  customers?: {
    active: number
    total: number
  }

  vehicles?: {
    active: number
    total: number
  }

  isLoading?: boolean

  isError?: boolean
}

const DashboardEntityOverview: React.FC<
  DashboardEntityOverviewProps
> = ({
  customers,
  vehicles,
  isLoading = false,
  isError = false,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const formatValue = (value?: number) =>
    isLoading || isError ? "—" : formatNumber(value ?? 0)

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {/* Customers */}
      <button
        type="button"
        onClick={() => navigate("/customers")}
        className="
          group relative overflow-hidden rounded-2xl
          border border-border/60 bg-background-card
          p-5 text-start
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -bottom-16 -end-12
            h-40 w-40 rounded-full
            bg-primary/[0.07] blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {t(
                  "dashboard.entities.customers",
                  "Customers",
                )}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t(
                  "dashboard.entities.customersDescription",
                  "Registered workshop customers",
                )}
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl bg-primary/10 text-primary
              "
            >
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-3xl font-bold tracking-tight text-text-primary">
                {formatValue(customers?.total)}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t(
                  "dashboard.entities.totalCustomers",
                  "Total customers",
                )}
              </p>
            </div>

            <div className="text-end">
              <p className="text-lg font-semibold text-primary">
                {formatValue(customers?.active)}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t("common.active", "Active")}
              </p>
            </div>
          </div>
        </div>
      </button>

      {/* Vehicles */}
      <button
        type="button"
        onClick={() => navigate("/customers")}
        className="
          group relative overflow-hidden rounded-2xl
          border border-border/60 bg-background-card
          p-5 text-start
          shadow-[0_8px_30px_rgba(15,23,42,0.045)]
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute
            -bottom-16 -end-12
            h-40 w-40 rounded-full
            bg-primary/[0.07] blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {t(
                  "dashboard.entities.vehicles",
                  "Vehicles",
                )}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t(
                  "dashboard.entities.vehiclesDescription",
                  "Vehicles registered in the workshop",
                )}
              </p>
            </div>

            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl bg-primary/10 text-primary
              "
            >
              <CarFront className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-3xl font-bold tracking-tight text-text-primary">
                {formatValue(vehicles?.total)}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t(
                  "dashboard.entities.totalVehicles",
                  "Total vehicles",
                )}
              </p>
            </div>

            <div className="text-end">
              <p className="text-lg font-semibold text-primary">
                {formatValue(vehicles?.active)}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {t("common.active", "Active")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </section>
  )
}

export default DashboardEntityOverview