import { useState } from "react"
import { useTranslation } from "react-i18next"
import { RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { useReopenWork, type WorkTargetStatus } from "../../hooks/useMaintenanceWorkActions"

interface ReopenWorkDialogProps {
  cardId: number
  work: MaintenanceWorkRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TARGET_OPTIONS: Array<{ value: WorkTargetStatus; labelKey: string }> = [
  { value: "PENDING", labelKey: "work.statuses.pending" },
  { value: "IN_PROGRESS", labelKey: "work.statuses.in_progress" },
]

export function ReopenWorkDialog({ cardId, work, open, onOpenChange }: ReopenWorkDialogProps) {
  const { t, i18n } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const [reason, setReason] = useState("")
  const [targetStatus, setTargetStatus] = useState<WorkTargetStatus>("PENDING")
  const reopenWork = useReopenWork()

  const isPending = reopenWork.isPending
  const reasonMissing = !reason.trim()

  const handleSubmit = () => {
    if (reasonMissing) return
    reopenWork.mutate(
      { cardId, workItemId: work.id, reason: reason.trim(), targetStatus },
      {
        onSuccess: () => {
          setReason("")
          setTargetStatus("PENDING")
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            {t("work.dialogs.reopenTitle")}
          </DialogTitle>
          <DialogDescription>{t("work.dialogs.reopenWorkDescription")}</DialogDescription>
        </DialogHeader>

        <div dir={i18n.dir()} className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm font-semibold text-foreground">
            {work.description}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reopen-reason">{t("work.dialogs.reopenReason")} <span className="text-destructive">*</span></Label>
            <Textarea
              id="reopen-reason"
              dir="auto"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t("work.dialogs.reopenReasonPlaceholder")}
              className="min-h-[90px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("work.dialogs.reopenTargetStatus")}</Label>
            <div className="flex gap-2">
              {TARGET_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant={targetStatus === option.value ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setTargetStatus(option.value)}
                >
                  {t(option.labelKey)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {reopenWork.isError && (
          <p className="text-sm text-destructive">{t("errors.workReopenFailed")}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{tCommon("common.cancel")}</Button>
          <Button onClick={handleSubmit} disabled={isPending || reasonMissing}>
            {isPending ? t("saving") : t("work.actions.reopen")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}