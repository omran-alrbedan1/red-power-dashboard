import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Gauge } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/inputs/CustomFormField"
import type { MaintenanceCardDetail } from "../../types/maintenance-detail.types"
import { useUpdateMaintenanceCard } from "../../hooks/useUpdateMaintenanceCard"
import { useMaintenanceOptions } from "../../hooks/useMaintenanceOptions"
import { toApiFuelLevel } from "../../services/maintenance-api.service"
import {
  editReceiptFormSchema,
  type EditReceiptFormInputValues,
  type EditReceiptFormValues,
} from "../../validation/maintenance.validation"
import { buildExpectedDelivery } from "../../utils/expected-delivery"
import { VisitSection } from "./VisitSection"
import { DeliverySection } from "./DeliverySection"

interface EditReceiptCardProps {
  card: MaintenanceCardDetail
  onCancel: () => void
  onSaved: () => void
}

export const EditReceiptCard = ({ card, onCancel, onSaved }: EditReceiptCardProps) => {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const updateCard = useUpdateMaintenanceCard()

  const visitReasonsQuery = useMaintenanceOptions("visit-reasons")
  const conditionOptionsQuery = useMaintenanceOptions("vehicle-conditions")
  const itemOptionsQuery = useMaintenanceOptions("vehicle-items")

  const optionValues = (options: { id: number; label: string }[] | undefined) =>
    (options ?? []).map((option) => ({ value: String(option.id), label: option.label }))

  const retryOptions = () => {
    void visitReasonsQuery.refetch()
    void conditionOptionsQuery.refetch()
    void itemOptionsQuery.refetch()
  }

  const deliveryDate = card.expectedDeliveryAt ? new Date(card.expectedDeliveryAt) : null

  const form = useForm<EditReceiptFormInputValues, unknown, EditReceiptFormValues>({
    resolver: zodResolver(editReceiptFormSchema(t)),
    defaultValues: {
      mileage: card.mileage,
      visitReasonIds: card.visitReasons.map((reason) => String(reason.id)),
      conditionOptionIds: card.conditionOptions.map((option) => String(option.id)),
      itemOptionIds: card.itemOptions.map((option) => String(option.id)),
      fuelLevel: card.fuelLevel,
      complaint: card.customerComplaint ?? "",
      inspectionNotes: card.inspectionNotes ?? "",
      approved: card.customerApproved,
      approvalName: card.customerApprovalName ?? "",
      deliveryDate,
      deliveryTime: deliveryDate,
    },
  })

  const handleSubmit = async (values: EditReceiptFormValues) => {
    updateCard.mutate(
      {
        cardId: card.id,
        input: {
          mileage: typeof values.mileage === "number" ? values.mileage : undefined,
          fuelLevel: toApiFuelLevel(values.fuelLevel),
          customerComplaint: values.complaint?.trim() || undefined,
          inspectionNotes: values.inspectionNotes?.trim() || undefined,
          customerApproved: values.approved,
          ...(values.approved
            ? { customerApprovalName: values.approvalName?.trim() || card.customer.name }
            : {}),
          ...(values.approved && !card.customerApproved
            ? { customerApprovedAt: new Date().toISOString() }
            : {}),
          visitReasonIds: values.visitReasonIds.map(Number),
          vehicleConditionOptionIds: values.conditionOptionIds.map(Number),
          vehicleItemOptionIds: values.itemOptionIds.map(Number),
          expectedDeliveryAt: buildExpectedDelivery(values.deliveryDate, values.deliveryTime),
        },
      },
      {
        onSuccess: onSaved,
      },
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Pencil className="h-4 w-4 text-primary" />
          {t("editCard")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <CustomFormField
              fieldType={FormFieldType.NUMBER}
              control={form.control}
              name="mileage"
              label={t("vehicle.mileage")}
              placeholder={t("vehicle.mileage")}
              min={0}
              leftIcon={Gauge}
              iconPosition="left"
              dir="ltr"
            />
          </div>

          <div className="border-t border-border pt-5">
            <VisitSection
              control={form.control}
              visitReasons={optionValues(visitReasonsQuery.data)}
              conditionOptions={optionValues(conditionOptionsQuery.data)}
              itemOptions={optionValues(itemOptionsQuery.data)}
              loading={
                visitReasonsQuery.isLoading ||
                conditionOptionsQuery.isLoading ||
                itemOptionsQuery.isLoading
              }
              hasError={
                visitReasonsQuery.isError ||
                conditionOptionsQuery.isError ||
                itemOptionsQuery.isError
              }
              onRetry={retryOptions}
            />
          </div>

          <div className="border-t border-border pt-5">
            <DeliverySection control={form.control} />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={updateCard.isPending}
            >
              {tCommon("common.cancel")}
            </Button>
            <SubmitButton
              isLoading={updateCard.isPending}
              loadingText={t("saving")}
              text={t("save")}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}