import { useTranslation } from "react-i18next"
import { Trash2, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CancelButton, SubmitButton } from "@/components/shared/buttons"

import { useDeleteMaintenanceOption } from "../hooks/useMaintenanceOptions"
import type {
  MaintenanceOptionKind,
  MaintenanceOptionRow,
} from "../types/maintenance-option.types"

interface DeleteMaintenanceOptionDialogProps {
  open: boolean
  kind: MaintenanceOptionKind
  option?: MaintenanceOptionRow | null
  onClose: () => void
}

export const DeleteMaintenanceOptionDialog: React.FC<DeleteMaintenanceOptionDialogProps> = ({
  open,
  kind,
  option,
  onClose,
}) => {
  const { t } = useTranslation("maintenance-options")
  const { t: tCommon } = useTranslation()

  const deleteOption = useDeleteMaintenanceOption(kind)

  const handleConfirm = () => {
    if (!option) return
    deleteOption.mutate(option.id, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>

            <DialogTitle className="text-xl">
              {t("dialogs.delete.title")}
            </DialogTitle>

            <DialogDescription>
              {t("dialogs.delete.description", {
                name: option
                  ? `${option.labelEn} / ${option.labelAr}`
                  : "",
              })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-6 flex-row gap-2 w-full">
          <CancelButton
            onClick={onClose}
            disabled={deleteOption.isPending}
            text={tCommon("common.cancel")}
            icon={<X className="h-4 w-4" />}
            className="flex-1"
          />

          <SubmitButton
            onClick={handleConfirm}
            isLoading={deleteOption.isPending}
            text={t("dialogs.delete.confirm", "Delete")}
            icon={<Trash2 className="h-4 w-4" />}
            className="flex-1 bg-red-600 hover:bg-red-700"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}