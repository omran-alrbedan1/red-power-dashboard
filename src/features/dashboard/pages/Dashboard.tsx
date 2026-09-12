import React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  CalendarCheck,
  CircleCheck,
  ClipboardList,
  Wrench,
} from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"
import StatCard from "@/components/shared/cards/StatCard"
import { images } from "@/constants/images"


import { useDashboardStats } from "../hooks/useDashboardStats"
import { DashboardEntityOverview, DashboardQuickActions, RecentMaintenanceCards } from "../components"

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useDashboardStats()

  const maintenance = stats?.maintenance


  const value = (count?: number) =>
    isLoading || isError ? "—" : count ?? 0

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        eyebrow={t(
          "dashboard.workshopManagement",
          "Workshop Management",
        )}
        title={t(
          "dashboard.welcome",
          "Welcome to Red Power",
        )}
        highlight="Red Power"
        description={t(
          "dashboard.subtitle",
          "Workshop Management Dashboard",
        )}
        backgroundImage={images.dashboardHeros}
        showDateTime
      />

      {/* Stats error */}
      {isError && (
        <div
          role="alert"
          className="
            flex items-center justify-between gap-4
            rounded-2xl border border-primary/30
            bg-primary/10 px-5 py-4
          "
        >
          <p className="text-sm font-medium text-text-primary">
            {t(
              "dashboard.statsError",
              "Unable to load maintenance statistics",
            )}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="
              rounded-lg border border-border
              px-3 py-2 text-xs font-semibold
              text-text-secondary hover:bg-background-secondary
              hover:text-text-primary
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-primary
            "
          >
            {t("common.retry", "Try again")}
          </button>
        </div>
      )}

      {/* Maintenance stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t(
            "dashboard.statCards.openCards",
            "Open Cards",
          )}
          value={value(maintenance?.openCards)}
          sub={t(
            "dashboard.statCards.totalMaintenance",
            "Total maintenance cards",
          )}
          icon={
            <ClipboardList className="h-[22px] w-[22px]" />
          }
          footer={t(
            "dashboard.statCards.activeWorkshop",
            "Active in workshop",
          )}
          footerClassName="text-primary"
          onClick={() =>
            navigate("/maintenance?status=open")
          }
        />

        <StatCard
          label={t(
            "dashboard.statCards.closedCards",
            "Closed Cards",
          )}
          value={value(maintenance?.closedCards)}
          sub={t(
            "dashboard.statCards.completedMaintenance",
            "Completed maintenance",
          )}
          icon={
            <CircleCheck className="h-[22px] w-[22px]" />
          }
          footer={t(
            "dashboard.statCards.successfullyClosed",
            "Successfully closed",
          )}
          footerClassName="text-primary"
          onClick={() =>
            navigate("/maintenance?status=closed")
          }
        />

        <StatCard
          label={t(
            "dashboard.statCards.todayReceived",
            "Received Today",
          )}
          value={value(maintenance?.todayReceived)}
          sub={t(
            "dashboard.statCards.newMaintenance",
            "New maintenance cards",
          )}
          icon={
            <CalendarCheck className="h-[22px] w-[22px]" />
          }
          footer={t(
            "dashboard.statCards.todayIntake",
            "Today's intake",
          )}
          footerClassName="text-primary"
          onClick={() => navigate("/maintenance")}
        />

        <StatCard
          label={t(
            "dashboard.statCards.totalCards",
            "Total Cards",
          )}
          value={value(maintenance?.totalCards)}
          sub={t(
            "dashboard.statCards.allMaintenance",
            "All maintenance cards",
          )}
          icon={
            <Wrench className="h-[22px] w-[22px]" />
          }
          footer={t(
            "dashboard.statCards.systemTotal",
            "System total",
          )}
          footerClassName="text-primary"
          onClick={() => navigate("/maintenance")}
        />
      </section>

      {/* Real customer + vehicle statistics */}
      <DashboardEntityOverview
        customers={stats?.customers}
        vehicles={stats?.vehicles}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Lower dashboard */}
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <RecentMaintenanceCards />

        <DashboardQuickActions />
      </div>
    </div>
  )
}

export default Dashboard