import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User2,
  Car,
  ClipboardList,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Upload,
} from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { cn } from "@/lib/utils"
import { customerService } from "@/features/customers/services/customer.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { useCreateMaintenanceCard } from "../hooks/useMaintenanceCards"
import { useMaintenanceOptions } from "../hooks/useMaintenanceOptions"
import { useUploadMaintenancePhotos } from "../hooks/useUploadMaintenancePhotos"
import { useUploadMaintenanceSignature } from "../hooks/useUploadMaintenanceSignature"
import type { ApiFuelLevel } from "../types/api-maintenance.types"
import {
  createReceiptFormSchema,
  type ReceiptFormInputValues,
  type ReceiptFormValues,
} from "../validation/maintenance.validation"
import { CustomerSelect } from "../components/CustomerSelect"
import { VehicleSelect } from "../components/VehicleSelect"
import { CustomerFields } from "../components/sections/CustomerFields"
import { VehicleFields } from "../components/sections/VehicleFields"
import { VisitSection } from "../components/sections/VisitSection"
import { WorkSection } from "../components/sections/WorkSection"
import { DeliverySection } from "../components/sections/DeliverySection"

type StepNumber = 1 | 2 | 3 | 4

const STEP_COUNT = 4

const STEP_ICONS = [User2, Car, ClipboardList, Camera]

const FUEL_UPPERCASE: Record<string, string> = {
  empty: "EMPTY",
  quarter: "QUARTER",
  half: "HALF",
  three_quarters: "THREE_QUARTERS",
  full: "FULL",
}

const ReceiptCreatePage: React.FC = () => {
  const { t } = useTranslation("maintenance")
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createCard = useCreateMaintenanceCard()
  const uploadPhotos = useUploadMaintenancePhotos()
  const uploadSignature = useUploadMaintenanceSignature()

  const visitReasonsQuery = useMaintenanceOptions("visit-reasons")
  const conditionOptionsQuery = useMaintenanceOptions("vehicle-conditions")
  const itemOptionsQuery = useMaintenanceOptions("vehicle-items")

  const [step, setStep] = useState<StepNumber>(1)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
  const [vehicleOwnershipId, setVehicleOwnershipId] = useState<number | null>(null)
  const [createdCard, setCreatedCard] = useState<{ id: number; cardNumber: string } | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)

  const optionValues = (options: { id: number; label: string }[] | undefined) =>
    (options ?? []).map((option) => ({ value: String(option.id), label: option.label }))

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

  const buildStepFields = (number: StepNumber): string[] => {
    if (number === 1) return ["customerName", "customerPhone", "customerEmail"]
    if (number === 2)
      return [
        "vehicleMake",
        "vehicleModel",
        "vehiclePlate",
        "vehicleYear",
        "vehicleVin",
        "vehicleTransmission",
      ]
    return [
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
  }

  const goToStep = async (next: StepNumber) => {
    if (next < step) {
      setStep(next)
      setIsTransitioning(false)
      return
    }
    const fields = buildStepFields(step)
    const valid = await form.trigger(fields as (keyof ReceiptFormValues)[])
    if (valid) {
      setStep(next)
      setIsTransitioning(false)
    } else {
      setIsTransitioning(false)
    }
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
    queryClient.invalidateQueries({ queryKey: ["customers"] })
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
        typeof formValues.vehicleYear === "number" ? formValues.vehicleYear : new Date().getFullYear(),
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

  const handleSave = form.handleSubmit(async (formValues) => {
    if (createdCard) return
    setIsTransitioning(true)
    form.clearErrors("root")
    try {
      const customerId = await resolveCustomerId(formValues)
      const ownershipId = await resolveOwnershipId(customerId, formValues)
      const requiredWorks = formValues.requiredWorks
        .filter((work) => work.description.trim() !== "")
        .map((work, index) => ({
          description: work.description.trim(),
          displayOrder: index,
          isRequired: Boolean(work.isRequired),
          ...(work.estimatedCost === "" ? {} : { estimatedCost: Number(work.estimatedCost) }),
        }))

      const expectedDeliveryAt = buildExpectedDelivery(formValues.deliveryDate, formValues.deliveryTime)

      createCard.mutate(
        {
          customerId,
          vehicleOwnershipId: ownershipId,
          receivedAt: new Date().toISOString(),
          mileage: formValues.mileage === "" ? 0 : Number(formValues.mileage),
          fuelLevel: (FUEL_UPPERCASE[formValues.fuelLevel] ?? "HALF") as ApiFuelLevel,
          customerApproved: Boolean(formValues.approved),
          ...(formValues.complaint?.trim() ? { customerComplaint: formValues.complaint.trim() } : {}),
          ...(formValues.inspectionNotes?.trim() ? { inspectionNotes: formValues.inspectionNotes.trim() } : {}),
          ...(formValues.approved
            ? {
                customerApprovalName: formValues.approvalName?.trim() || formValues.customerName,
                customerApprovedAt: new Date().toISOString(),
              }
            : {}),
          ...(expectedDeliveryAt ? { expectedDeliveryAt } : {}),
          ...(formValues.visitReasonIds.length
            ? { visitReasonIds: formValues.visitReasonIds.map(Number) }
            : {}),
          ...(formValues.conditionOptionIds.length
            ? { vehicleConditionOptionIds: formValues.conditionOptionIds.map(Number) }
            : {}),
          ...(formValues.itemOptionIds.length
            ? { vehicleItemOptionIds: formValues.itemOptionIds.map(Number) }
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
        },
      )
    } catch (error) {
      form.setError("root", { message: (error as Error).message })
      setIsTransitioning(false)
    }
  })

  const handleUploadPhotos = () => {
    if (!createdCard || photos.length === 0) return
    setMediaError(null)
    uploadPhotos.mutate(
      { cardId: createdCard.id, files: photos },
      { onError: (error) => setMediaError((error as Error).message) },
    )
  }

  const handleUploadSignature = () => {
    if (!createdCard || !signatureFile) return
    setMediaError(null)
    uploadSignature.mutate(
      { cardId: createdCard.id, file: signatureFile },
      { onError: (error) => setMediaError((error as Error).message) },
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("newCard")}
        description={t("subtitle")}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm">
        {Array.from({ length: STEP_COUNT }, (_, index) => index + 1).map((stepNumber) => {
          const Icon = STEP_ICONS[stepNumber - 1]
          const isActive = step === stepNumber
          const isDone = (stepNumber as StepNumber) < step
          return (
            <div key={stepNumber} className="flex flex-1 items-center gap-2 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    isActive && "bg-primary text-white",
                    isDone && "bg-primary/20 text-primary",
                    !isActive && !isDone && "bg-background-secondary text-text-muted"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span
                  className={cn(
                    "hidden text-sm sm:inline",
                    isActive ? "font-medium text-text-primary" : "text-text-muted"
                  )}
                >
                  {t(`wizard.step${stepNumber}`)}
                </span>
              </div>
              {stepNumber !== STEP_COUNT && <div className="h-px flex-1 bg-border" />}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSave} noValidate className="space-y-4">
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
                <CustomerSelect value={selectedCustomerId} onChange={setSelectedCustomerId} />
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
                <VehicleSelect
                  value={vehicleOwnershipId}
                  onChange={(selection) => {
                    setVehicleOwnershipId(selection?.ownershipId ?? null)
                    if (selection) {
                      form.setValue("vehicleMake", selection.make)
                      form.setValue("vehicleModel", selection.model)
                      form.setValue("vehiclePlate", selection.plateNumber)
                      form.setValue("vehicleYear", selection.manufactureYear ?? "")
                      form.setValue("vehicleVin", selection.vin ?? "")
                    }
                  }}
                />
              </div>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-primary" />
                {t("media.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-text-primary">
                {t("media.createdSummary", { cardNumber: createdCard.cardNumber })}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary">{t("media.photos")}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
                    onChange={(event) => setPhotos(Array.from(event.target.files ?? []))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadPhotos}
                    disabled={photos.length === 0 || uploadPhotos.isPending}
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    {t("media.uploadPhotos")}
                  </Button>
                </div>
                {uploadPhotos.isSuccess && (
                  <p className="text-sm text-emerald-600">{t("media.photosUploaded")}</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-text-secondary">{t("media.signature")}</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-primary"
                    onChange={(event) => setSignatureFile(event.target.files?.[0] ?? null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadSignature}
                    disabled={!signatureFile || uploadSignature.isPending}
                    className="gap-1.5"
                  >
                    <Upload className="h-4 w-4" />
                    {t("media.uploadSignature")}
                  </Button>
                </div>
                {uploadSignature.isSuccess && (
                  <p className="text-sm text-emerald-600">{t("media.signatureUploaded")}</p>
                )}
              </div>

              {mediaError && <p className="text-sm text-primary">{mediaError}</p>}
              {(uploadPhotos.isError || uploadSignature.isError) && !mediaError && (
                <p className="text-sm text-primary">{t("media.error")}</p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(`/maintenance/${createdCard.id}`, { replace: true })}
                >
                  {t("media.skip")}
                </Button>
                <Button
                  type="button"
                  className="gap-1.5"
                  onClick={() => navigate(`/maintenance/${createdCard.id}`, { replace: true })}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {t("media.done")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {form.formState.errors.root && (
          <p className="text-sm text-primary">{form.formState.errors.root.message}</p>
        )}

        {step < 4 && (
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => goToStep((step - 1) as StepNumber)} className="gap-1.5">
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

const buildExpectedDelivery = (
  date: Date | null | undefined,
  time: Date | null | undefined
): string | undefined => {
  if (!date) return undefined
  const target = new Date(date)
  if (time) {
    target.setHours(time.getHours(), time.getMinutes(), 0, 0)
  } else {
    target.setHours(23, 59, 0, 0)
  }
  return target.toISOString()
}

export default ReceiptCreatePage