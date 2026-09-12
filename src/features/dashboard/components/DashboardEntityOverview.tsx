import React from "react"
import { CarFront, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import type { DashboardEntityStats } from "../types/dashboard.types"

interface DashboardEntityOverviewProps {
  customers?: DashboardEntityStats
  vehicles?: DashboardEntityStats
  isLoading?: boolean
  isError?: boolean
}

interface EntityOverviewCardProps {
  title: string
  description: string
  totalLabel: string

  total: string
  active: string

  icon: React.ReactNode

  accent: "red" | "blue"

  onClick: () => void
}

const entityCardStyles = {
  red: {
    icon: "bg-red-500/10 text-red-500",
    glow: "bg-red-500/[0.08]",
  },

  blue: {
    icon: "bg-blue-500/10 text-blue-500",
    glow: "bg-blue-500/[0.08]",
  },
} as const

const EntityOverviewCard: React.FC<EntityOverviewCardProps> = ({
  title,
  description,
  totalLabel,
  total,
  active,
  icon,
  accent,
  onClick,
}) => {
  const { t } = useTranslation()

  const styles = entityCardStyles[accent]

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative w-full overflow-hidden
        rounded-2xl
        border border-border/60
        bg-background-card
        p-5 text-start
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none absolute
          -bottom-16 -end-14
          h-40 w-40
          rounded-full
          blur-3xl
          ${styles.glow}
        `}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              className="
                text-sm font-semibold
                text-text-primary
              "
            >
              {title}
            </h3>

            <p
              className="
                mt-1 max-w-xs
                text-xs leading-5
                text-text-muted
              "
            >
              {description}
            </p>
          </div>

          <div
            className={`
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              ${styles.icon}
            `}
          >
            {icon}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-end justify-between gap-6">
          <div>
            <p
              className="
                text-3xl font-bold
                tracking-[-0.04em]
                text-text-primary
              "
            >
              {total}
            </p>

            <p
              className="
                mt-1 text-xs
                text-text-muted
              "
            >
              {totalLabel}
            </p>
          </div>

          <div className="text-end">
            <p
              className="
                text-lg font-semibold
                text-emerald-500
              "
            >
              {active}
            </p>

            <p
              className="
                mt-1 text-xs
                text-text-muted
              "
            >
              {t("common.active", "Active")}
            </p>
          </div>
        </div>
      </div>
    </button>
  )
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

  const formatValue = (value?: number) => {
    if (isLoading || isError) {
      return "—"
    }

    return value === undefined
      ? "—"
      : value.toLocaleString()
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <EntityOverviewCard
        title={t(
          "dashboard.entities.customers",
          "Customers",
        )}
        description={t(
          "dashboard.entities.customersDescription",
          "Registered workshop customers",
        )}
        totalLabel={t(
          "dashboard.entities.totalCustomers",
          "Total customers",
        )}
        total={formatValue(customers?.total)}
        active={formatValue(customers?.active)}
        icon={<Users className="h-5 w-5" />}
        accent="red"
        onClick={() => navigate("/customers")}
      />

      <EntityOverviewCard
        title={t(
          "dashboard.entities.vehicles",
          "Vehicles",
        )}
        description={t(
          "dashboard.entities.vehiclesDescription",
          "Vehicles registered in the workshop",
        )}
        totalLabel={t(
          "dashboard.entities.totalVehicles",
          "Total vehicles",
        )}
        total={formatValue(vehicles?.total)}
        active={formatValue(vehicles?.active)}
        icon={<CarFront className="h-5 w-5" />}
        accent="blue"
        onClick={() => navigate("/vehicles")}
      />
    </section>
  )
}

export default DashboardEntityOverview