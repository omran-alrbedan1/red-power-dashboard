import { useTranslation } from "react-i18next"
import { CheckCircle2, LockKeyhole } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MaintenanceCard } from "../types/maintenance.types"
import { getClosureStatus } from "../services/maintenance.service"
import { useCloseCard } from "../hooks/useCloseCard"
import { ClosureGuardBadge } from "./closure-guard-badge"

interface CloseCardDialogProps {
  card: MaintenanceCard
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CloseCardDialog({ card, open, onOpenChange }: CloseCardDialogProps) {
  const { t } = useTranslation("maintenance")
  const closeCard = useCloseCard()
  const closure = getClosureStatus(card)

  const handleClose = () => {
    closeCard.mutate(card.id, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-primary" />
            {t("closeCard.title")}
          </DialogTitle>
          <DialogDescription>{t("closeCard.confirmDescription")}</DialogDescription>
        </DialogHeader>

        {closure.allowed ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-text-primary">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <p>{t("closeCard.ready")}</p>
          </div>
        ) : (
          <ClosureGuardBadge card={card} />
        )}

        {closeCard.isError && (
          <p className="text-sm text-destructive">{t("closeCard.error")}</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={handleClose} disabled={!closure.allowed || closeCard.isPending}>
            {closeCard.isPending ? t("saving") : t("closeCard.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
