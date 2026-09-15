import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Ban } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { useCancelWork } from "../../hooks/useMaintenanceWorkActions"

interface CancelWorkDialogProps {
  cardId: number
  work: MaintenanceWorkRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelWorkDialog({ cardId, work, open, onOpenChange }: CancelWorkDialogProps) {
  const { t, i18n } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const [reason, setReason] = useState("")
  const cancelWork = useCancelWork()

  const isPending = cancelWork.isPending
  const reasonMissing = !reason.trim()

  const handleSubmit = () => {
    if (reasonMissing) return
    cancelWork.mutate(
      { cardId, workItemId: work.id, reason: reason.trim() },
      {
        onSuccess: () => {
          setReason("")
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
            <Ban className="h-5 w-5 text-destructive" />
            {t("work.dialogs.cancelTitle")}
          </DialogTitle>
          <DialogDescription>{t("work.dialogs.cancelWorkDescription")}</DialogDescription>
        </DialogHeader>

        <div dir={i18n.dir()} className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm font-semibold text-foreground">
            {work.description}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">{t("work.dialogs.cancelReason")} <span className="text-destructive">*</span></Label>
            <Textarea
              id="cancel-reason"
              dir="auto"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t("work.dialogs.cancelReasonPlaceholder")}
              className="min-h-[90px]"
            />
          </div>
        </div>

        {cancelWork.isError && (
          <p className="text-sm text-destructive">{t("errors.workCancelFailed")}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{tCommon("common.cancel")}</Button>
          <Button  onClick={handleSubmit} disabled={isPending || reasonMissing}>
            {isPending ? t("saving") : t("work.actions.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}