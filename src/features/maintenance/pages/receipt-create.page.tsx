import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  User2,
  ClipboardList,
  Plus,
} from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import ErrorState from "@/components/shared/states/ErrorState"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useCreateMaintenanceCard } from "../hooks/useMaintenanceCards"
import {
  createReceiptFormSchema,
  type ReceiptFormInputValues,
  type ReceiptFormValues,
  type WorkItemRowValues,
} from "../validation/maintenance.validation"
import { CustomerVehicleSelector } from "../components/customer-vehicle-selector"
import type { SelectorValue } from "../components/customer-vehicle-selector"
import { CustomerVehicleSection } from "../components/sections/customer-vehicle-section"
import { VisitSection } from "../components/sections/visit-section"
import { WorkSection } from "../components/sections/work-section"
import { DeliverySection } from "../components/sections/delivery-section"

const emptyWorkItem = (): WorkItemRowValues => ({
  description: "",
  estimatedCost: "",
  quantity: "",
  progress: 0,
  assignee: "",
  status: "pending",
  isRequired: false,
})

const ReceiptCreatePage: React.FC = () => {
  const { t } = useTranslation("maintenance")
  const navigate = useNavigate()
  const createCard = useCreateMaintenanceCard()
  const { user } = useAuth()
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>()
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>()

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
      vehicleFuel: "",
      vehicleTransmission: "",
      visitReason: "",
      otherReason: "",
      complaint: "",
      fuelLevel: "",
      externalCondition: "",
      warningLights: false,
      tires: "",
      battery: "",
      glass: "",
      body: "",
      otherNotes: "",
      itemsLeft: [],
      workItems: [emptyWorkItem()],
      approved: false,
      approvalAmount: "",
      deliveryDate: undefined,
      deliveryTime: undefined,
      receiverName: user?.name ?? "",
    },
  })

  const handleSelector = (value: SelectorValue) => {
    form.setValue("customerName", value.customerName ?? form.getValues("customerName"))
    form.setValue("customerPhone", value.customerPhone ?? form.getValues("customerPhone"))
    if (value.customerEmail !== undefined)
      form.setValue("customerEmail", value.customerEmail)
    if (value.vehicleMake !== undefined)
      form.setValue("vehicleMake", value.vehicleMake)
    if (value.vehicleModel !== undefined)
      form.setValue("vehicleModel", value.vehicleModel)
    if (value.vehiclePlate !== undefined)
      form.setValue("vehiclePlate", value.vehiclePlate)
    if (value.vehicleYear !== undefined)
      form.setValue("vehicleYear", value.vehicleYear)
    if (value.vehicleVin !== undefined)
      form.setValue("vehicleVin", value.vehicleVin)
    if (value.vehicleMileage !== undefined)
      form.setValue("vehicleMileage", value.vehicleMileage)
    
    if (value.customerId !== undefined) {
      setSelectedCustomerId(value.customerId)
    }
    if (value.vehicleId !== undefined) {
      setSelectedVehicleId(value.vehicleId)
    }
  }

  const handleSubmit = (values: ReceiptFormValues) => {
    const workItems = values.workItems
      .filter((w) => w.description.trim() !== "")
      .map((w) => ({
        id: "",
        description: w.description,
        estimatedCost: Number(w.estimatedCost) || 0,
        quantity: w.quantity ? Number(w.quantity) : undefined,
        progress: Number(w.progress) || 0,
        assignee: w.assignee || undefined,
        status: w.status,
        isRequired: Boolean(w.isRequired),
      }))

    createCard.mutate(
      {
        status: "open",
        customerId: selectedCustomerId,
        customerSnapshot: {
          name: values.customerName,
          phone: values.customerPhone,
          email: values.customerEmail || undefined,
        },
        vehicleId: selectedVehicleId,
        vehicleSnapshot: {
          make: values.vehicleMake,
          model: values.vehicleModel,
          plateNumber: values.vehiclePlate,
          year: values.vehicleYear ? Number(values.vehicleYear) : undefined,
          vin: values.vehicleVin || undefined,
          mileage: values.vehicleMileage ? Number(values.vehicleMileage) : undefined,
          fuelType: values.vehicleFuel || undefined,
          transmissionType: values.vehicleTransmission || undefined,
        },
        visitReason:
          values.visitReason === "other" && values.otherReason
            ? values.otherReason
            : values.visitReason,
        isOtherReason: values.visitReason === "other",
        complaint: values.complaint || undefined,
        condition: {
          fuelLevel: (values.fuelLevel as any) || undefined,
          externalCondition: values.externalCondition || undefined,
          warningLights: values.warningLights || undefined,
          tires: values.tires || undefined,
          battery: values.battery || undefined,
          glass: values.glass || undefined,
          body: values.body || undefined,
          otherNotes: values.otherNotes || undefined,
        },
        itemsLeftInCar: values.itemsLeft,
        workItems,
        approval: {
          approved: Boolean(values.approved),
          approvedAt: values.approved ? new Date().toISOString() : undefined,
          approvedByName: values.approved ? values.customerName : undefined,
          amount: values.approvalAmount ? Number(values.approvalAmount) : undefined,
        },
        expectedDelivery: {
          date: values.deliveryDate
            ? new Date(values.deliveryDate).toISOString()
            : undefined,
          time: values.deliveryTime
            ? new Date(values.deliveryTime).toISOString()
            : undefined,
        },
        receiverName: values.receiverName || undefined,
      },
      {
        onSuccess: (card) => navigate(`/maintenance/${card.id}`, { replace: true }),
      },
    )
  }

  if (createCard.isError) {
    return <ErrorState variant="default" retry={() => createCard.reset()} />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("newCard")}
        description={t("subtitle")}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <CustomerVehicleSelector
        onSelect={handleSelector}
        onNewCustomer={() => navigate("/customers/new")}
      />

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 relative overflow-visible"
        noValidate
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <User2 className="h-4 w-4 text-primary" />
              {t("sections.header")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerVehicleSection control={form.control} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ClipboardList className="h-4 w-4 text-primary" />
              {t("reason.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VisitSection control={form.control} />
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

        <SubmitButton
          isLoading={createCard.isPending}
          text={t("save")}
          icon={<Plus className="h-4 w-4" />}
        />
      </form>
    </div>
  )
}

export default ReceiptCreatePage
