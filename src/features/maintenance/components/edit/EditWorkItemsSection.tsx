import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save, Trash2, Wrench } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { useCreateWorkItem, useDeleteWorkItem, useUpdateWorkItem } from "../../hooks/useMaintenanceWorkItems"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { createEditWorkItemSchema, editWorkItemSchema, type CreateEditWorkItemFormInputValues, type CreateEditWorkItemFormValues, type EditWorkItemFormInputValues, type EditWorkItemFormValues } from "../../validation/maintenance.validation"
import { WorkStatusBadge } from "../work/MaintenanceWorkActions"

interface EditWorkItemsSectionProps {
  cardId: number
  works: MaintenanceWorkRow[]
}

function ExistingWorkItem({ cardId, work }: { cardId: number; work: MaintenanceWorkRow }) {
  const { t, i18n } = useTranslation("maintenance")
  const updateWork = useUpdateWorkItem()
  const deleteWork = useDeleteWorkItem()
  const form = useForm<EditWorkItemFormInputValues, unknown, EditWorkItemFormValues>({
    resolver: zodResolver(editWorkItemSchema(t)),
    defaultValues: {
      description: work.description,
      estimatedCost: work.estimatedCost ?? "",
      isRequired: work.isRequired,
      displayOrder: work.displayOrder,
    },
  })

  const handleUpdate = (values: EditWorkItemFormValues) => {
    updateWork.mutate({
      workItemId: work.id,
      input: {
        cardId,
        description: values.description,
        estimatedCost: values.estimatedCost === "" ? null : values.estimatedCost,
        isRequired: values.isRequired,
        displayOrder: values.displayOrder,
      },
    }, { onSuccess: () => form.reset(values) })
  }

  const handleDelete = () => {
    if (window.confirm(t("edit.work.confirmDelete"))) deleteWork.mutate({ cardId, workItemId: work.id })
  }

  return (
    <form onSubmit={form.handleSubmit(handleUpdate)} className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4" noValidate>
      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5"><CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="description" label={t("work.description")} required dir={i18n.dir()} /></div>
        <div className="lg:col-span-2"><CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="estimatedCost" label={t("work.estimate")} min={0} step={0.01} dir="ltr" /></div>
        <div className="lg:col-span-2"><CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="displayOrder" label={t("edit.work.displayOrder")} min={0} dir="ltr" /></div>
        <div className="flex items-end lg:col-span-3"><WorkStatusBadge work={work} /></div>
        <div className="flex items-center lg:col-span-5"><CustomFormField fieldType={FormFieldType.SWITCH} control={form.control} name="isRequired" label={t("work.required")} dir={i18n.dir()} /></div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end lg:col-span-7"><Button type="button" variant="outline" onClick={handleDelete} disabled={deleteWork.isPending || updateWork.isPending}><Trash2 className="size-4" />{t("work.removeRow")}</Button><SubmitButton className="w-full sm:w-auto" isLoading={updateWork.isPending} loadingText={t("saving")} text={t("edit.work.saveWork")} icon={<Save className="size-4" />} disabled={deleteWork.isPending || !form.formState.isDirty} /></div>
      </div>
    </form>
  )
}

function NewWorkItem({ cardId, nextDisplayOrder }: { cardId: number; nextDisplayOrder: number }) {
  const { t, i18n } = useTranslation("maintenance")
  const createWork = useCreateWorkItem()
  const form = useForm<CreateEditWorkItemFormInputValues, unknown, CreateEditWorkItemFormValues>({
    resolver: zodResolver(createEditWorkItemSchema(t)),
    defaultValues: { description: "", estimatedCost: "", isRequired: true, displayOrder: nextDisplayOrder },
  })

  const handleCreate = (values: CreateEditWorkItemFormValues) => {
    createWork.mutate({
      cardId,
      description: values.description,
      estimatedCost: values.estimatedCost === "" ? undefined : values.estimatedCost,
      isRequired: values.isRequired,
      displayOrder: values.displayOrder,
    }, { onSuccess: () => form.reset({ description: "", estimatedCost: "", isRequired: true, displayOrder: nextDisplayOrder + 1 }) })
  }

  return (
    <form onSubmit={form.handleSubmit(handleCreate)} className="grid gap-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 lg:grid-cols-12" noValidate>
      <div className="lg:col-span-6"><CustomFormField fieldType={FormFieldType.INPUT} control={form.control} name="description" label={t("work.description")} required dir={i18n.dir()} /></div>
      <div className="lg:col-span-3"><CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="estimatedCost" label={t("work.estimate")} min={0} step={0.01} dir="ltr" /></div>
      <div className="lg:col-span-3"><CustomFormField fieldType={FormFieldType.NUMBER} control={form.control} name="displayOrder" label={t("edit.work.displayOrder")} min={0} dir="ltr" /></div>
      <div className="flex items-center lg:col-span-6"><CustomFormField fieldType={FormFieldType.SWITCH} control={form.control} name="isRequired" label={t("work.required")} dir={i18n.dir()} /></div>
      <div className="flex justify-end lg:col-span-6"><SubmitButton className="w-full sm:w-auto" isLoading={createWork.isPending} loadingText={t("saving")} text={t("work.addRow")} icon={<Plus className="size-4" />} /></div>
    </form>
  )
}

export function EditWorkItemsSection({ cardId, works }: EditWorkItemsSectionProps) {
  const { t } = useTranslation("maintenance")
  const nextDisplayOrder = works.reduce((highest, work) => Math.max(highest, work.displayOrder), -1) + 1

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Wrench className="size-4" /></span>{t("sections.work")}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {works.length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{t("work.noWork")}</p> : works.map((work) => <ExistingWorkItem key={work.id} cardId={cardId} work={work} />)}
        <NewWorkItem cardId={cardId} nextDisplayOrder={nextDisplayOrder} />
      </CardContent>
    </Card>
  )
}
