import { useState } from "react"
import { useTranslation } from "react-i18next"
import { CircleAlert, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { images } from "@/constants/images"

import { MaintenanceOptionFilters } from "../components/MaintenanceOptionFilters"
import { MaintenanceOptionsTable } from "../components/MaintenanceOptionsTable"
import { MaintenanceOptionDialog } from "../components/MaintenanceOptionDialog"
import { DeleteMaintenanceOptionDialog } from "../components/DeleteMaintenanceOptionDialog"
import {
  maintenanceOptionFilterDefaultValues,
  type MaintenanceOptionFilterValues,
} from "../configs/maintenance-option-filter.config"
import { OPTION_KINDS } from "../configs/option-kinds.config"
import {
  useMaintenanceOptions,
  useToggleMaintenanceOptionStatus,
} from "../hooks/useMaintenanceOptions"
import type { MaintenanceOptionFormMode } from "../components/MaintenanceOptionForm"
import type {
  MaintenanceOptionKind,
  MaintenanceOptionRow,
} from "../types/maintenance-option.types"

interface OptionDialogState {
  mode: MaintenanceOptionFormMode
  option: MaintenanceOptionRow | null
}

const PAGE_LIMIT = 10

const MaintenanceOptionsPage: React.FC = () => {
  const { t } = useTranslation("maintenance-options")
  const { values: filters, page, apply, setPage, reset, hasActive } =
    useUrlFilters<MaintenanceOptionFilterValues>({
      defaults: maintenanceOptionFilterDefaultValues,
    })

  const [activeKind, setActiveKind] = useState<MaintenanceOptionKind>("visit-reasons")
  const [dialog, setDialog] = useState<OptionDialogState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MaintenanceOptionRow | null>(null)

  const optionsQuery = useMaintenanceOptions(
    activeKind,
    page,
    PAGE_LIMIT,
    hasActive ? filters : undefined,
  )

  const toggleStatus = useToggleMaintenanceOptionStatus(activeKind)

  const options = optionsQuery.data?.items ?? []
  const meta = optionsQuery.data?.meta

  const pagination = {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    totalPages: meta?.totalPages ?? 1,
    perPage: meta?.limit ?? PAGE_LIMIT,
  }

  const handleKindChange = (value: string) => {
    setActiveKind(value as MaintenanceOptionKind)
    setPage(1)
  }

  const handleToggleStatus = (option: MaintenanceOptionRow) => {
    toggleStatus.mutate({ id: option.id, isActive: !option.isActive })
  }

  if (optionsQuery.isError) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title={t("title", "Maintenance Options")}
          description={t("subtitle", "Manage configurable maintenance card options.")}
          backgroundImage={images.maintenanceHero}
          showDateTime
        />
        <ErrorState
          variant="default"
          title={t("errors.loadFailed", "Unable to load maintenance options")}
          retry={() => optionsQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title", "Maintenance Options")}
        description={t("subtitle", "Manage configurable maintenance card options.")}
        backgroundImage={images.maintenanceHero}
        showDateTime
        rightContent={
          <Button
            onClick={() => setDialog({ mode: "create", option: null })}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {t("addOption", "Add Option")}
          </Button>
        }
      />

      <div className="mt-1">
        <Tabs value={activeKind} onValueChange={handleKindChange}>
          <TabsList>
            {OPTION_KINDS.map(({ kind, labelKey }) => (
              <TabsTrigger key={kind} value={kind}>
                {t(labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <MaintenanceOptionFilters
        onApply={apply}
        onReset={reset}
        initialFilters={filters}
        isLoading={optionsQuery.isFetching}
      />

      <MaintenanceOptionsTable
        options={options}
        loading={optionsQuery.isLoading}
        statusPending={toggleStatus.isPending}
        pagination={pagination}
        onPageChange={setPage}
        onEdit={(option) => setDialog({ mode: "edit", option })}
        onToggleStatus={handleToggleStatus}
        onDelete={(option) => setDeleteTarget(option)}
        emptyMessage={t("noResults")}
        emptyState={{
          icon: hasActive ? CircleAlert : SlidersHorizontal,
          title: hasActive ? t("noResults") : t("empty"),
          description: t("emptyDescription"),
          primaryAction: hasActive
            ? undefined
            : {
                label: t("addOption"),
                icon: Plus,
                onClick: () => setDialog({ mode: "create", option: null }),
              },
        }}
      />

      <MaintenanceOptionDialog
        open={dialog !== null}
        mode={dialog?.mode ?? "create"}
        kind={activeKind}
        option={dialog?.option ?? null}
        onClose={() => setDialog(null)}
      />

      <DeleteMaintenanceOptionDialog
        open={deleteTarget !== null}
        kind={activeKind}
        option={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}

export default MaintenanceOptionsPage