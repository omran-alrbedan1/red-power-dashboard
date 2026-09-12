import React, {
  useCallback,
  useMemo,
} from "react"
import {
  ArrowRight,
  ClipboardList,
  Wrench,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  DataTable,
} from "@/components/shared/custom/DataTable"
import { useMaintenanceCards } from "@/features/maintenance/hooks/useMaintenanceCards"
import type { MaintenanceCardListRow } from "@/features/maintenance/types/maintenance-detail.types"

import RecentMaintenanceMobileCard from "./RecentMaintenanceMobileCard"
import { createRecentMaintenanceColumns } from "./RecentMaintenanceColumns"

const RecentMaintenanceCards: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const locale = i18n.language.startsWith("ar")
    ? "ar-SA"
    : "en-GB"

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMaintenanceCards({
    page: 1,
    limit: 5,
  })

  const cards = data?.items ?? []

  const columns = useMemo(
    () =>
      createRecentMaintenanceColumns({
        t,
        locale,
      }),
    [t, locale],
  )

  const handleViewAll = useCallback(() => {
    navigate("/maintenance")
  }, [navigate])

  const handleRowClick = useCallback(
    (card: MaintenanceCardListRow) => {
      navigate(`/maintenance/${card.id}`)
    },
    [navigate],
  )

  const hasData =
    !isLoading &&
    !isError &&
    cards.length > 0

  const isEmpty =
    !isLoading &&
    !isError &&
    cards.length === 0

  return (
    <section
      className="
        overflow-hidden rounded-2xl
        border border-border/60
        bg-background-card
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      <RecentMaintenanceHeader
        onViewAll={handleViewAll}
      />

      {isLoading && (
        <RecentMaintenanceSkeleton />
      )}

      {!isLoading && isError && (
        <RecentMaintenanceError
          onRetry={() => {
            void refetch()
          }}
        />
      )}

      {isEmpty && (
        <RecentMaintenanceEmpty />
      )}

      {hasData && (
        <DataTable<MaintenanceCardListRow>
          data={cards}
          columns={columns}
          getRowId={(card) => card.id}
          onRowClick={handleRowClick}
          rowActions
          mobileCardComponent={RecentMaintenanceMobileCard}
          emptyMessage={t(
            "dashboard.recentMaintenance.empty",
            "No maintenance cards yet",
          )}
          className="
            rounded-none
            border-0
            bg-transparent
          "
        />
      )}
    </section>
  )
}

interface RecentMaintenanceHeaderProps {
  onViewAll: () => void
}

const RecentMaintenanceHeader: React.FC<
  RecentMaintenanceHeaderProps
> = ({
  onViewAll,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className="
        flex items-center justify-between gap-4
        border-b border-border/60
        px-5 py-4
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <ClipboardList className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <h2
            className="
              truncate text-base font-bold
              text-text-primary
            "
          >
            {t(
              "dashboard.recentMaintenance.title",
              "Recent Maintenance Cards",
            )}
          </h2>

          <p
            className="
              mt-0.5 truncate
              text-xs text-text-muted
            "
          >
            {t(
              "dashboard.recentMaintenance.description",
              "Latest cards received by the workshop",
            )}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="
          inline-flex shrink-0 items-center
          gap-2 rounded-lg
          border border-border
          px-3 py-2
          text-xs font-semibold
          text-text-secondary
          transition-colors
          hover:bg-background-secondary
          hover:text-text-primary
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
        "
      >
        {t(
          "common.viewAll",
          "View All",
        )}

        <ArrowRight
          className="
            h-3.5 w-3.5
            rtl:rotate-180
          "
        />
      </button>
    </div>
  )
}

const RecentMaintenanceSkeleton: React.FC = () => {
  return (
    <div className="divide-y divide-border/50">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            flex items-center gap-4
            px-5 py-4
          "
        >
          <div
            className="
              h-10 w-10 shrink-0
              animate-pulse
              rounded-lg
              bg-background-secondary
            "
          />

          <div className="flex-1">
            <div
              className="
                h-3 w-32
                animate-pulse
                rounded
                bg-background-secondary
              "
            />

            <div
              className="
                mt-2 h-3 w-48
                max-w-full
                animate-pulse
                rounded
                bg-background-secondary
              "
            />
          </div>

          <div
            className="
              h-6 w-16
              animate-pulse
              rounded-full
              bg-background-secondary
            "
          />
        </div>
      ))}
    </div>
  )
}

interface RecentMaintenanceErrorProps {
  onRetry: () => void
}

const RecentMaintenanceError: React.FC<
  RecentMaintenanceErrorProps
> = ({
  onRetry,
}) => {
  const { t } = useTranslation()

  return (
    <div
      className="
        flex flex-col items-center
        px-5 py-12
        text-center
      "
    >
      <div
        className="
          flex h-12 w-12
          items-center justify-center
          rounded-xl
          bg-destructive/10
          text-destructive
        "
      >
        <Wrench className="h-5 w-5" />
      </div>

      <p
        className="
          mt-4 text-sm font-semibold
          text-text-primary
        "
      >
        {t(
          "dashboard.recentMaintenance.error",
          "Unable to load maintenance cards",
        )}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="
          mt-3 text-sm font-semibold
          text-primary
          hover:underline
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary
        "
      >
        {t(
          "common.retry",
          "Try again",
        )}
      </button>
    </div>
  )
}

const RecentMaintenanceEmpty: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div
      className="
        flex flex-col items-center
        px-5 py-12
        text-center
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
        <ClipboardList className="h-5 w-5" />
      </div>

      <p
        className="
          mt-4 text-sm font-semibold
          text-text-primary
        "
      >
        {t(
          "dashboard.recentMaintenance.empty",
          "No maintenance cards yet",
        )}
      </p>

      <p
        className="
          mt-1 max-w-sm
          text-xs leading-5
          text-text-muted
        "
      >
        {t(
          "dashboard.recentMaintenance.emptyDescription",
          "New workshop receipts will appear here.",
        )}
      </p>
    </div>
  )
}

export default RecentMaintenanceCards