import { useTranslation } from "react-i18next"
import { Pencil, Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useCreateMaintenanceOption, useUpdateMaintenanceOption } from "../hooks/useMaintenanceOptions"
import {
  MaintenanceOptionForm,
  type MaintenanceOptionFormMode,
} from "./MaintenanceOptionForm"
import type {
  CreateMaintenanceOptionInput,
  MaintenanceOptionKind,
  MaintenanceOptionRow,
  UpdateMaintenanceOptionInput,
} from "../types/maintenance-option.types"
import type {
  CreateMaintenanceOptionFormValues,
  UpdateMaintenanceOptionFormValues,
} from "../validation/maintenance-option.validation"

interface MaintenanceOptionDialogProps {
  open: boolean
  mode: MaintenanceOptionFormMode
  kind: MaintenanceOptionKind
  option?: MaintenanceOptionRow | null
  onClose: () => void
}

export const MaintenanceOptionDialog: React.FC<MaintenanceOptionDialogProps> = ({
  open,
  mode,
  kind,
  option,
  onClose,
}) => {
  const { t } = useTranslation("maintenance-options")
  const createOption = useCreateMaintenanceOption(kind)
  const updateOption = useUpdateMaintenanceOption(kind)
  const isSubmitting = createOption.isPending || updateOption.isPending

  const isCreate = mode === "create"
  const item = option ?? null

  const handleCreate = (values: CreateMaintenanceOptionFormValues) => {
    const input: CreateMaintenanceOptionInput = {
      code: values.code,
      labelEn: values.labelEn,
      labelAr: values.labelAr,
      displayOrder: values.displayOrder,
    }
    createOption.mutate(input, {
      onSuccess: () => onClose(),
    })
  }

  const handleUpdate = (values: UpdateMaintenanceOptionFormValues) => {
    console.log('Updating option with values:', values)
    if (!item) return
    const input: UpdateMaintenanceOptionInput = {
      code: values.code,
      labelEn: values.labelEn,
      labelAr: values.labelAr,
      displayOrder: values.displayOrder,
    }
    updateOption.mutate({ id: item.id, ...input }, {
      onSuccess: () => onClose(),
    })
  }

  const editDefaultValues = item
    ? {
        code: item.code,
        labelEn: item.labelEn,
        labelAr: item.labelAr,
        displayOrder: item.displayOrder,
      }
    : undefined

  const StatusIcon = isCreate ? Plus : Pencil

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <StatusIcon className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-xl">
                {t(isCreate ? "dialogs.create.title" : "dialogs.edit.title")}
              </DialogTitle>

              <DialogDescription className="mt-1 text-sm">
                {t(
                  isCreate
                    ? "dialogs.create.description"
                    : "dialogs.edit.description",
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2">
          {isCreate ? (
            <MaintenanceOptionForm
              mode="create"
              isSubmitting={isSubmitting}
              submitLabel={t("dialogs.create.confirm", "Add Option")}
              onSubmit={handleCreate}
            />
          ) : (
            <MaintenanceOptionForm
              mode="edit"
              defaultValues={editDefaultValues}
              isSubmitting={isSubmitting}
              submitLabel={t("dialogs.edit.confirm", "Save Changes")}
              onSubmit={handleUpdate}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}