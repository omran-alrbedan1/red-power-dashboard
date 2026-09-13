import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User2,
  Car,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { customerService } from "@/features/customers/services/customer.service"
import { customerQueryKeys } from "@/features/customers/services/customer-query-keys"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { toApiFuelLevel } from "../services/maintenance-api.service"
import { useCreateMaintenanceCard } from "../hooks/useMaintenanceCards"
import { useMaintenanceOptions } from "../hooks/useMaintenanceOptions"
import {
  createReceiptFormSchema,
  type ReceiptFormInputValues,
  type ReceiptFormValues,
} from "../validation/maintenance.validation"
import { CustomerSelect } from "../components/CustomerSelect"
import { VehicleSelect, type VehicleSelectSelection } from "../components/VehicleSelect"
import { WizardSteps, type WizardStep } from "../components/sections/WizardSteps"
import { CustomerFields } from "../components/sections/CustomerFields"
import { VehicleFields } from "../components/sections/VehicleFields"
import { VisitSection } from "../components/sections/VisitSection"
import { WorkSection } from "../components/sections/WorkSection"
import { DeliverySection } from "../components/sections/DeliverySection"
import { MediaReceiptStep } from "../components/sections/MediaReceiptStep"
import { buildExpectedDelivery } from "../utils/expected-delivery"

type StepNumber = 1 | 2 | 3 | 4

const STEP_3_FIELDS: (keyof ReceiptFormValues)[] = [
  "mileage",
  "visitReasonIds",
  "fuelLevel",
  "conditionOptionIds",
  "itemOptionIds",
  "complaint",
  "inspectionNotes",
  "requiredWorks",
  "approved",
  "approvalName",
  "deliveryDate",
  "deliveryTime",
]

const ReceiptCreatePage: React.FC = () => {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const queryClient = useQueryClient()
  const createCard = useCreateMaintenanceCard()

  const visitReasonsQuery = useMaintenanceOptions("visit-reasons")
  const conditionOptionsQuery = useMaintenanceOptions("vehicle-conditions")
  const itemOptionsQuery = useMaintenanceOptions("vehicle-items")

  const [step, setStep] = useState<StepNumber>(1)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [vehicleOwnershipId, setVehicleOwnershipId] = useState<number | null>(null)
  const [vehicleConflict, setVehicleConflict] = useState<{
    owner: { id: number; name: string; phone: string; email?: string }
    selection: VehicleSelectSelection
  } | null>(null)
  const [createdCard, setCreatedCard] = useState<{ id: number; cardNumber: string } | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const optionValues = (options: { id: number; label: string }[] | undefined) =>
    (options ?? []).map((option) => ({ value: String(option.id), label: option.label }))

  const retryOptions = () => {
    void visitReasonsQuery.refetch()
    void conditionOptionsQuery.refetch()
    void itemOptionsQuery.refetch()
  }

  const form = useForm<ReceiptFormInputValues, unknown, ReceiptFormValues>({
    resolver: zodResolver(createReceiptFormSchema(t)),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      vehicleMake: "",
      vehicleModel: "",
      vehiclePlate: "",
      vehicleYear: "",
      vehicleVin: "",
      vehicleMileage: "",
      vehicleTransmission: "manual",
      mileage: "",
      visitReasonIds: [],
      conditionOptionIds: [],
      itemOptionIds: [],
      fuelLevel: "half",
      complaint: "",
      inspectionNotes: "",
      requiredWorks: [],
      approved: false,
      approvalName: "",
      deliveryDate: null,
      deliveryTime: null,
    },
  })

  const stepFields = (number: StepNumber): (keyof ReceiptFormValues)[] => {
    if (number === 1) return ["customerName", "customerPhone", "customerEmail"]
    if (number === 2) {
      return [
        "vehicleMake",
        "vehicleModel",
        "vehiclePlate",
        "vehicleYear",
        "vehicleVin",
        "vehicleTransmission",
      ]
    }
    return STEP_3_FIELDS
  }

  const goToStep = async (next: StepNumber) => {
    if (next < step) {
      setStep(next)
      setIsTransitioning(false)
      return
    }
    const valid = await form.trigger(stepFields(step))
    setIsTransitioning(false)
    if (valid) setStep(next)
  }

  const handleCustomerChange = (customerId: number | null) => {
    setSelectedCustomerId(customerId)
    setVehicleConflict(null)
  }

  const applyVehicleSelection = (selection: VehicleSelectSelection) => {
    setSelectedVehicleId(selection.vehicleId)
    setVehicleOwnershipId(selection.ownershipId)
    form.setValue("vehicleMake", selection.make)
    form.setValue("vehicleModel", selection.model)
    form.setValue("vehiclePlate", selection.plateNumber)
    form.setValue("vehicleYear", selection.manufactureYear ?? "")
    form.setValue("vehicleVin", selection.vin ?? "")
    form.clearErrors(["vehicleMake", "vehicleModel", "vehiclePlate"])
  }

  const handleVehicleSelect = (selection: VehicleSelectSelection | null) => {
    setVehicleConflict(null)
    if (!selection) {
      setSelectedVehicleId(null)
      setVehicleOwnershipId(null)
      return
    }
    const owner = selection.ownerCustomer
    if (owner && (!selectedCustomerId || selectedCustomerId !== owner.id)) {
      setSelectedVehicleId(null)
      setVehicleOwnershipId(null)
      setVehicleConflict({ owner, selection })
      return
    }
    applyVehicleSelection(selection)
  }

  const adoptVehicleOwner = () => {
    if (!vehicleConflict) return
    const { owner, selection } = vehicleConflict
    setSelectedCustomerId(owner.id)
    form.setValue("customerName", owner.name)
    form.setValue("customerPhone", owner.phone)
    form.setValue("customerEmail", owner.email ?? "")
    form.clearErrors(["customerName", "customerPhone"])
    setVehicleConflict(null)
    applyVehicleSelection(selection)
  }

  const resolveCustomerId = async (formValues: ReceiptFormValues): Promise<number> => {
    if (selectedCustomerId) return selectedCustomerId
    const created = await customerService.create({
      name: formValues.customerName,
      phone: formValues.customerPhone,
      ...(formValues.customerEmail?.trim() ? { email: formValues.customerEmail.trim() } : {}),
    })
    setSelectedCustomerId(created.id)
    queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.selectorData() })
    queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
    return created.id
  }

  const resolveOwnershipId = async (
    customerId: number,
    formValues: ReceiptFormValues
  ): Promise<number> => {
    if (vehicleOwnershipId) return vehicleOwnershipId
    const created = await customerService.addVehicle(customerId, {
      make: formValues.vehicleMake,
      model: formValues.vehicleModel,
      manufactureYear:
        typeof formValues.vehicleYear === "number"
          ? formValues.vehicleYear
          : new Date().getFullYear(),
      plateNumber: formValues.vehiclePlate,
      ...(formValues.vehicleVin?.trim() ? { vin: formValues.vehicleVin.trim().toUpperCase() } : {}),
      transmission: (formValues.vehicleTransmission as "automatic" | "manual") || "manual",
    })
    const ownershipId = created.ownershipId
    if (!ownershipId) {
      throw new Error("vehicle ownership not returned after creation")
    }
    setVehicleOwnershipId(ownershipId)
    queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.selectorData() })
    return ownershipId
  }

  const handleSave: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (createdCard || isTransitioning) return
    form.clearErrors("root")
    const valid = await form.trigger(STEP_3_FIELDS)
    if (!valid) return

    setIsTransitioning(true)
    try {
      const values = createReceiptFormSchema(t).parse(form.getValues())
      const customerId = await resolveCustomerId(values)
      const ownershipId = await resolveOwnershipId(customerId, values)
      const requiredWorks = values.requiredWorks
        .filter((work) => work.description.trim() !== "")
        .map((work, index) => ({
          description: work.description.trim(),
          displayOrder: index,
          isRequired: Boolean(work.isRequired),
          ...(work.estimatedCost === "" ? {} : { estimatedCost: Number(work.estimatedCost) }),
        }))

      const expectedDeliveryAt = buildExpectedDelivery(
        values.deliveryDate,
        values.deliveryTime
      )

      createCard.mutate(
        {
          customerId,
          vehicleOwnershipId: ownershipId,
          receivedAt: new Date().toISOString(),
          mileage: values.mileage === "" ? 0 : Number(values.mileage),
          fuelLevel: toApiFuelLevel(values.fuelLevel),
          customerApproved: Boolean(values.approved),
          ...(values.complaint?.trim() ? { customerComplaint: values.complaint.trim() } : {}),
          ...(values.inspectionNotes?.trim()
            ? { inspectionNotes: values.inspectionNotes.trim() }
            : {}),
          ...(values.approved
            ? {
                customerApprovalName: values.approvalName?.trim() || values.customerName,
                customerApprovedAt: new Date().toISOString(),
              }
            : {}),
          ...(expectedDeliveryAt ? { expectedDeliveryAt } : {}),
          ...(values.visitReasonIds.length
            ? { visitReasonIds: values.visitReasonIds.map(Number) }
            : {}),
          ...(values.conditionOptionIds.length
            ? { vehicleConditionOptionIds: values.conditionOptionIds.map(Number) }
            : {}),
          ...(values.itemOptionIds.length
            ? { vehicleItemOptionIds: values.itemOptionIds.map(Number) }
            : {}),
          ...(requiredWorks.length ? { requiredWorks } : {}),
        },
        {
          onSuccess: (card) => {
            setCreatedCard({ id: card.id, cardNumber: card.cardNumber })
            setStep(4)
            setIsTransitioning(false)
          },
          onError: (error) => {
            form.setError("root", { message: (error as Error).message })
            setIsTransitioning(false)
          },
        }
      )
    } catch (error) {
      form.setError("root", { message: (error as Error).message })
      setIsTransitioning(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("newCard")}
        description={t("subtitle")}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <WizardSteps current={step as WizardStep} />

      <form onSubmit={handleSave} noValidate className="space-y-4 relative overflow-visible">
        {step === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User2 className="h-4 w-4 text-primary" />
                {t("customer.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  {t("customer.select")}
                </label>
                <CustomerSelect
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                  onSelectCustomer={(customer) => {
                    form.setValue("customerName", customer.name)
                    form.setValue("customerPhone", customer.phone)
                    form.setValue("customerEmail", customer.email ?? "")
                    form.clearErrors(["customerName", "customerPhone"])
                  }}
                />
              </div>
              <div className="border-t border-border pt-4">
                <p className="mb-3 text-xs text-text-muted">{t("customer.createHint")}</p>
                <CustomerFields control={form.control} />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-primary" />
                {t("vehicle.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-text-secondary">
                  {t("vehicle.select")}
                </label>
                <VehicleSelect value={selectedVehicleId} onChange={handleVehicleSelect} />
              </div>
              {vehicleConflict && (
                <div className="flex flex-col gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-primary">
                    {t("vehicle.ownershipMismatch", { name: vehicleConflict.owner.name })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={adoptVehicleOwner}
                    >
                      {t("vehicle.useOwner")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setVehicleConflict(null)}
                    >
                      {tCommon("common.cancel")}
                    </Button>
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-4">
                <p className="mb-3 text-xs text-text-muted">{t("vehicle.createHint")}</p>
                <VehicleFields control={form.control} />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  {t("reason.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-6">
                <WorkSection control={form.control} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-6">
                <DeliverySection control={form.control} />
              </CardContent>
            </Card>
          </>
        )}

        {step === 4 && createdCard && (
          <MediaReceiptStep cardId={createdCard.id} cardNumber={createdCard.cardNumber} />
        )}

        {form.formState.errors.root && (
          <p className="text-sm text-primary">{form.formState.errors.root.message}</p>
        )}

        {step < 4 && (
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep((step - 1) as StepNumber)}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t("wizard.back")}
              </Button>
            ) : (
              <div />
            )}
            {step === 3 ? (
              <SubmitButton
                isLoading={isTransitioning || createCard.isPending}
                text={t("wizard.saveCard")}
                icon={<ClipboardList className="h-4 w-4" />}
              />
            ) : (
              <Button
                type="button"
                onClick={() => {
                  setIsTransitioning(true)
                  goToStep((step + 1) as StepNumber).catch(() => setIsTransitioning(false))
                }}
                disabled={isTransitioning}
                className="gap-1.5"
              >
                {t("wizard.next")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default ReceiptCreatePage