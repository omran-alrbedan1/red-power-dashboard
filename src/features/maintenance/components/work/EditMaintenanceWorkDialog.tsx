import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Save } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { useUpdateWorkItem } from "../../hooks/useMaintenanceWorkItems"
import { createEditWorkItemSchema, type CreateEditWorkItemFormInputValues, type CreateEditWorkItemFormValues } from "../../validation/maintenance.validation"

interface EditMaintenanceWorkDialogProps {
  cardId: number
  work: MaintenanceWorkRow
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMaintenanceWorkDialog({ cardId, work, open, onOpenChange }: EditMaintenanceWorkDialogProps) {
  const { t, i18n } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const updateWork = useUpdateWorkItem()

  const form = useForm<CreateEditWorkItemFormInputValues, unknown, CreateEditWorkItemFormValues>({
    resolver: zodResolver(createEditWorkItemSchema(t)),
    defaultValues: {
      description: work.description,
      estimatedCost: work.estimatedCost ?? "",
      isRequired: work.isRequired,
      displayOrder: work.displayOrder,
    },
  })

  const handleSubmit = (values: CreateEditWorkItemFormValues) => {
    updateWork.mutate(
      {
        workItemId: work.id,
        input: {
          cardId,
          description: values.description,
          estimatedCost: values.estimatedCost === "" ? null : values.estimatedCost,
          isRequired: values.isRequired,
          displayOrder: values.displayOrder,
        },
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("work.editWork")}</DialogTitle>
          <DialogDescription>{t("work.dialogs.editWorkDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-4">
          <div dir={i18n.dir()} className="space-y-4">
            <CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="description" label={t("work.description")} required dir={i18n.dir()} />
            <div className="grid gap-4 sm:grid-cols-3">
              <CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="estimatedCost" label={t("work.estimate")} min={0} step={0.01} dir="ltr" />
              <CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="displayOrder" label={t("edit.work.displayOrder")} min={0} dir="ltr" />
              <div className="flex items-end"><CustomFormField fieldType={FormFieldType.SWITCH} control={form.control} name="isRequired" label={t("work.required")} dir={i18n.dir()} /></div>
            </div>
          </div>

          {updateWork.isError && (
            <p className="text-sm text-destructive">{t("errors.workUpdateFailed")}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{tCommon("common.cancel")}</Button>
            <SubmitButton text={t("edit.work.saveWork")} icon={<Save className="size-4" />} isLoading={updateWork.isPending} loadingText={t("saving")} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}