import { useState } from "react"
import { useTranslation } from "react-i18next"
import { BadgeCheck, Ban, Pencil, Play, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { useCompleteWork, useStartWork } from "../../hooks/useMaintenanceWorkActions"
import { CancelWorkDialog } from "./CancelWorkDialog"
import { ReopenWorkDialog } from "./ReopenWorkDialog"
import { EditMaintenanceWorkDialog } from "./EditMaintenanceWorkDialog"

export function WorkStatusBadge({ work }: { work: MaintenanceWorkRow }) {
  const { t } = useTranslation("maintenance")

  const style: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    in_progress: "bg-primary/10 text-primary",
    completed: "bg-emerald-500/10 text-emerald-600",
    cancelled: "bg-amber-500/10 text-amber-600",
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style[work.status] ?? ""}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {t(`work.statuses.${work.status}`)}
    </span>
  )
}

interface MaintenanceWorkActionsProps {
  cardId: number
  work: MaintenanceWorkRow
  readOnly?: boolean
}

export function MaintenanceWorkActions({ cardId, work, readOnly = false }: MaintenanceWorkActionsProps) {
  const { t } = useTranslation("maintenance")
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [isReopenOpen, setIsReopenOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const startWork = useStartWork()
  const completeWork = useCompleteWork()

  const busy = startWork.isPending || completeWork.isPending

  if (readOnly) {
    return null
  }

  if (work.status === "pending" || work.status === "in_progress") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {work.status === "pending" && (
          <Button size="sm" onClick={() => startWork.mutate({ cardId, workItemId: work.id })} disabled={busy}>
            <Play className="size-3.5" />
            {startWork.isPending ? t("saving") : t("work.actions.start")}
          </Button>
        )}

        <Button size="sm" variant="secondary" onClick={() => completeWork.mutate({ cardId, workItemId: work.id })} disabled={busy}>
          <BadgeCheck className="size-3.5" />
          {completeWork.isPending ? t("saving") : t("work.actions.complete")}
        </Button>

        <Button size="sm" variant="ghost" onClick={() => setIsEditOpen(true)}>
          <Pencil className="size-3.5" />
          {t("work.actions.edit")}
        </Button>

        <Button size="sm" variant="ghost" onClick={() => setIsCancelOpen(true)} className="text-destructive hover:text-destructive">
          <Ban className="size-3.5" />
          {t("work.actions.cancel")}
        </Button>

        <CancelWorkDialog cardId={cardId} work={work} open={isCancelOpen} onOpenChange={setIsCancelOpen} />
        <EditMaintenanceWorkDialog cardId={cardId} work={work} open={isEditOpen} onOpenChange={setIsEditOpen} />
      </div>
    )
  }

  if (work.status === "completed" || work.status === "cancelled") {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setIsReopenOpen(true)}>
          <RotateCcw className="size-3.5" />
          {t("work.actions.reopen")}
        </Button>

        <ReopenWorkDialog cardId={cardId} work={work} open={isReopenOpen} onOpenChange={setIsReopenOpen} />
      </div>
    )
  }

  return null
}