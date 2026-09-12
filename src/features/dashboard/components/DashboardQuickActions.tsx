import React from "react"
import {
  ArrowRight,
  CarFront,
  ClipboardPlus,
  Users,
  Wrench,
  Zap,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface QuickAction {
  label: string
  description: string
  path: string
  icon: React.ReactNode
}

const DashboardQuickActions: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const actions: QuickAction[] = [
    {
      label: t(
        "dashboard.quickActions.createMaintenance",
        "Create Maintenance Card",
      ),
      description: t(
        "dashboard.quickActions.createMaintenanceDescription",
        "Register a vehicle visit",
      ),
      path: "/maintenance/new",
      icon: <ClipboardPlus className="h-5 w-5" />,
    },
    {
      label: t(
        "dashboard.quickActions.customers",
        "Customers",
      ),
      description: t(
        "dashboard.quickActions.customersDescription",
        "Manage workshop customers",
      ),
      path: "/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: t(
        "dashboard.quickActions.vehicles",
        "Vehicles",
      ),
      description: t(
        "dashboard.quickActions.vehiclesDescription",
        "Browse customer vehicles",
      ),
      path: "/customers",
      icon: <CarFront className="h-5 w-5" />,
    },
    {
      label: t(
        "dashboard.quickActions.maintenance",
        "All Maintenance Cards",
      ),
      description: t(
        "dashboard.quickActions.maintenanceDescription",
        "Browse workshop receipts",
      ),
      path: "/maintenance",
      icon: <Wrench className="h-5 w-5" />,
    },
  ]

  return (
    <section
      className="
        rounded-2xl border border-border/60
        bg-background-card
        p-5
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl bg-primary text-white
          "
        >
          <Zap className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-bold text-text-primary">
            {t(
              "dashboard.quickActions.title",
              "Quick Actions",
            )}
          </h2>

          <p className="mt-0.5 text-xs text-text-muted">
            {t(
              "dashboard.quickActions.description",
              "Common workshop tasks",
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.path + action.label}
            type="button"
            onClick={() => navigate(action.path)}
            className="
              group flex items-center gap-3
              rounded-xl border border-border/60
              p-3 text-start
              hover:border-primary/20
              hover:bg-primary/[0.025]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl bg-primary/10 text-primary
              "
            >
              {action.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary">
                {action.label}
              </p>

              <p className="mt-0.5 truncate text-[11px] text-text-muted">
                {action.description}
              </p>
            </div>

            <ArrowRight
              className="
                h-4 w-4 shrink-0
                text-text-muted
                group-hover:text-primary
                rtl:rotate-180
              "
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default DashboardQuickActions