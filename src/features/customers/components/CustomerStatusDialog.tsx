import React from "react"
import { useTranslation } from "react-i18next"
import { Ban, Power, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  CancelButton,
  SubmitButton,
} from "@/components/shared/buttons"

type CustomerStatusMode = "activate" | "deactivate"

interface CustomerStatusDialogProps {
  open: boolean
  mode: CustomerStatusMode
  customerName: string
  onConfirm: () => void
  onClose: () => void
  isSubmitting?: boolean
}

export const CustomerStatusDialog: React.FC<
  CustomerStatusDialogProps
> = ({
  open,
  mode,
  customerName,
  onConfirm,
  onClose,
  isSubmitting = false,
}) => {
  const { t } = useTranslation("customers")

  const isActivate = mode === "activate"
  const StatusIcon = isActivate ? Power : Ban

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={`
                flex h-14 w-14 items-center
                justify-center rounded-full
                ${
                  isActivate
                    ? "bg-green-500/15 text-green-600"
                    : "bg-red-500/15 text-red-600"
                }
              `}
            >
              <StatusIcon className="h-6 w-6" />
            </div>

            <DialogTitle className="text-xl">
              {t(
                isActivate
                  ? "dialogs.activate.title"
                  : "dialogs.deactivate.title",
              )}
            </DialogTitle>

            <DialogDescription>
              {t(
                isActivate
                  ? "dialogs.activate.description"
                  : "dialogs.deactivate.description",
                { name: customerName },
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-6 flex-row gap-2 w-full">
          <CancelButton
            onClick={onClose}
            disabled={isSubmitting}
            text={t("actions.cancel", "Cancel")}
            icon={<X className="h-4 w-4" />}
            className="flex-1"
          />

          <SubmitButton
            onClick={onConfirm}
            isLoading={isSubmitting}
            text={t(
              isActivate
                ? "dialogs.activate.confirm"
                : "dialogs.deactivate.confirm",
            )}
            icon={<StatusIcon className="h-4 w-4" />}
            className={`
              flex-1
              ${
                isActivate
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            `}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}