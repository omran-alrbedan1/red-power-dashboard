import type { ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { BadgeCheck, Boxes, ClipboardList, Fuel, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import type { Option } from "@/types/customFormField.types"
import type { MaintenanceCardDetail } from "../../types/maintenance-detail.types"
import { useMaintenanceOptions } from "../../hooks/useMaintenanceOptions"
import { useUpdateMaintenanceCard } from "../../hooks/useUpdateMaintenanceCard"
import { toApiFuelLevel } from "../../services/maintenance-api.service"
import { buildExpectedDelivery } from "../../utils/expected-delivery"
import { editMaintenanceCardSchema, type EditMaintenanceCardFormInputValues, type EditMaintenanceCardFormValues } from "../../validation/maintenance.validation"
import { EditApprovalSection } from "./EditApprovalSection"
import { EditBasicInfoSection } from "./EditBasicInfoSection"
import { EditConditionSection } from "./EditConditionSection"
import { EditItemsSection } from "./EditItemsSection"
import { EditVisitSection } from "./EditVisitSection"

interface MaintenanceEditFormProps {
  card: MaintenanceCardDetail
  onSaved: () => void
  onCancel: () => void
}

function EditSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

const toOptions = (options: Array<{ id: number; label: string }> | undefined): Option[] => (options ?? []).map((option) => ({ value: String(option.id), label: option.label }))

export function MaintenanceEditForm({ card, onSaved, onCancel }: MaintenanceEditFormProps) {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const updateCard = useUpdateMaintenanceCard()
  const visitReasons = useMaintenanceOptions("visit-reasons")
  const conditionOptions = useMaintenanceOptions("vehicle-conditions")
  const itemOptions = useMaintenanceOptions("vehicle-items")
  const delivery = card.expectedDeliveryAt ? new Date(card.expectedDeliveryAt) : null
  const optionsLoading = visitReasons.isLoading || conditionOptions.isLoading || itemOptions.isLoading
  const optionsError = visitReasons.isError || conditionOptions.isError || itemOptions.isError

  const form = useForm<EditMaintenanceCardFormInputValues, unknown, EditMaintenanceCardFormValues>({
    resolver: zodResolver(editMaintenanceCardSchema(t)),
    defaultValues: {
      mileage: card.mileage,
      fuelLevel: card.fuelLevel,
      visitReasonIds: card.visitReasons.map((option) => String(option.id)),
      conditionOptionIds: card.conditionOptions.map((option) => String(option.id)),
      itemOptionIds: card.itemOptions.map((option) => String(option.id)),
      complaint: card.customerComplaint ?? "",
      inspectionNotes: card.inspectionNotes ?? "",
      approved: card.customerApproved,
      approvalName: card.customerApprovalName ?? "",
      deliveryDate: delivery,
      deliveryTime: delivery,
    },
  })

  const retryOptions = () => {
    void visitReasons.refetch()
    void conditionOptions.refetch()
    void itemOptions.refetch()
  }

  const handleSubmit = (values: EditMaintenanceCardFormValues) => {
    const expectedDeliveryAt = buildExpectedDelivery(values.deliveryDate, values.deliveryTime)
    updateCard.mutate({
      cardId: card.id,
      input: {
        mileage: values.mileage,
        fuelLevel: toApiFuelLevel(values.fuelLevel),
        customerComplaint: values.complaint?.trim() ?? "",
        inspectionNotes: values.inspectionNotes?.trim() ?? "",
        customerApproved: values.approved,
        ...(values.approved ? { customerApprovalName: values.approvalName?.trim() ?? "", customerApprovedAt: card.customerApprovedAt ?? new Date().toISOString() } : {}),
        visitReasonIds: values.visitReasonIds.map(Number),
        vehicleConditionOptionIds: values.conditionOptionIds.map(Number),
        vehicleItemOptionIds: values.itemOptionIds.map(Number),
        expectedDeliveryAt: expectedDeliveryAt ?? null,
      },
    }, { onSuccess: onSaved })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
      {optionsError && !optionsLoading && <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-destructive">{t("options.error")}</p><Button type="button" variant="outline" size="sm" onClick={retryOptions}><RefreshCw className="size-4" />{tCommon("common.retry")}</Button></div>}
      <EditSection icon={<Fuel className="size-4" />} title={t("edit.sections.cardInfo")}><EditBasicInfoSection control={form.control} /></EditSection>
      <EditSection icon={<ClipboardList className="size-4" />} title={t("sections.reason")}><EditVisitSection control={form.control} options={toOptions(visitReasons.data)} loading={visitReasons.isLoading} /></EditSection>
      <EditSection icon={<Fuel className="size-4" />} title={t("sections.condition")}><EditConditionSection control={form.control} options={toOptions(conditionOptions.data)} loading={conditionOptions.isLoading} /></EditSection>
      <EditSection icon={<Boxes className="size-4" />} title={t("sections.itemsLeft")}><EditItemsSection control={form.control} options={toOptions(itemOptions.data)} loading={itemOptions.isLoading} /></EditSection>
      <EditSection icon={<BadgeCheck className="size-4" />} title={t("sections.approval")}><EditApprovalSection control={form.control} /></EditSection>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="outline" onClick={onCancel} disabled={updateCard.isPending}>{tCommon("common.cancel")}</Button><SubmitButton className="w-full sm:w-auto" isLoading={updateCard.isPending} loadingText={t("saving")} text={t("save")} disabled={optionsLoading || optionsError} /></div>
    </form>
  )
}
