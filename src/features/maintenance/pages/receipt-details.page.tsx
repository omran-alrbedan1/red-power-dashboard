import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { User2, Car, ClipboardList, Wrench, BadgeCheck, Boxes, Fuel, History, Edit, LockKeyhole } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/shared/states/EmptyState"
import ErrorState from "@/components/shared/states/ErrorState"
import { useMaintenanceCard } from "../hooks/useMaintenanceCard"
import { useActivityTimeline } from "../hooks/useActivityTimeline"
import { ReceiptHeader } from "../components/sections/receipt-header"
import { ActivityTimeline } from "../components/activity-timeline"
import { WorkItemEdit } from "../components/work-item-edit"
import { CloseCardDialog } from "../components/close-card-dialog"
import { ClosureGuardBadge } from "../components/closure-guard-badge"
import { formatCurrency, formatDateTime } from "@/lib/formatter"

const ReceiptDetailsPage: React.FC = () => {
  const { t } = useTranslation("maintenance")
  const { cardId } = useParams<{ cardId: string }>()
  const { data: card, isLoading, isError } = useMaintenanceCard(cardId)
  const { data: activityEvents } = useActivityTimeline(cardId)
  const [editingWorkItem, setEditingWorkItem] = useState<string | null>(null)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{t("saving")}</div>
      </div>
    )
  }

  if (isError) {
    return <ErrorState variant="default" retry={() => window.location.reload()} />
  }

  if (!card) {
    return <EmptyState title={t("empty")} description="" />
  }

  const workTotal = card.workItems.reduce((sum, item) => {
    const cost = item.estimatedCost || 0
    const qty = item.quantity || 1
    return sum + cost * qty
  }, 0)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("details")}
        description={`${t("receiptNumber")}: ${card.receiptNumber}`}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <Card>
        <CardHeader>
          <ReceiptHeader
            receiptNumber={card.receiptNumber}
            status={card.status}
            createdAt={card.createdAt}
          />
        </CardHeader>
      </Card>

      {card.status !== "closed" && card.status !== "cancelled" && (
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">{t("closeCard.title")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("closeCard.summary")}</p>
            </div>
            <Button className="shrink-0" onClick={() => setIsCloseDialogOpen(true)}>
              <LockKeyhole className="h-4 w-4" />
              {t("closeCard.close")}
            </Button>
          </CardContent>
          <CardContent className="pt-0">
            <ClosureGuardBadge card={card} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User2 className="h-4 w-4 text-primary" />
            {t("sections.customer")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">{t("customer.name")}</label>
              <p className="font-medium text-text-primary">{card.customerSnapshot.name}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("customer.phone")}</label>
              <p className="font-medium text-text-primary ltr" dir="ltr">
                {card.customerSnapshot.phone}
              </p>
            </div>
            {card.customerSnapshot.email && (
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">{t("customer.email")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.customerSnapshot.email}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-primary" />
            {t("sections.vehicle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.make")}</label>
              <p className="font-medium text-text-primary">{card.vehicleSnapshot.make}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.model")}</label>
              <p className="font-medium text-text-primary">{card.vehicleSnapshot.model}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.plateNumber")}</label>
              <p className="font-medium text-text-primary ltr" dir="ltr">
                {card.vehicleSnapshot.plateNumber}
              </p>
            </div>
            {card.vehicleSnapshot.year && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.year")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.vehicleSnapshot.year}
                </p>
              </div>
            )}
            {card.vehicleSnapshot.vin && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.vin")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.vehicleSnapshot.vin}
                </p>
              </div>
            )}
            {card.vehicleSnapshot.mileage && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.mileage")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.vehicleSnapshot.mileage} كم
                </p>
              </div>
            )}
            {card.vehicleSnapshot.fuelType && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.fuelType")}</label>
                <p className="font-medium text-text-primary">
                  {t(`vehicle.fuel_type.${card.vehicleSnapshot.fuelType}`)}
                </p>
              </div>
            )}
            {card.vehicleSnapshot.transmissionType && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.transmissionType")}</label>
                <p className="font-medium text-text-primary">
                  {t(`vehicle.transmission_type.${card.vehicleSnapshot.transmissionType}`)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardList className="h-4 w-4 text-primary" />
            {t("sections.reason")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">{t("reason.title")}</label>
            <p className="font-medium text-text-primary">
              {card.isOtherReason
                ? card.visitReason
                : t(`reason.options.${card.visitReason}`) || card.visitReason}
            </p>
          </div>
          {card.complaint && (
            <div>
              <label className="text-xs text-muted-foreground">{t("reason.complaint")}</label>
              <p className="font-medium text-text-primary">{card.complaint}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Fuel className="h-4 w-4 text-primary" />
            {t("sections.condition")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {card.condition ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {card.condition.fuelLevel && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.fuelLevel")}</label>
                  <p className="font-medium text-text-primary">
                    {t(`condition.fuelLevels.${card.condition.fuelLevel}`)}
                  </p>
                </div>
              )}
              {card.condition.externalCondition && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.externalCondition")}</label>
                  <p className="font-medium text-text-primary">{card.condition.externalCondition}</p>
                </div>
              )}
              {card.condition.warningLights !== undefined && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.warningLights")}</label>
                  <p className="font-medium text-text-primary">
                    {card.condition.warningLights ? t("condition.yes") : t("condition.no")}
                  </p>
                </div>
              )}
              {card.condition.tires && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.tires")}</label>
                  <p className="font-medium text-text-primary">{card.condition.tires}</p>
                </div>
              )}
              {card.condition.battery && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.battery")}</label>
                  <p className="font-medium text-text-primary">{card.condition.battery}</p>
                </div>
              )}
              {card.condition.glass && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.glass")}</label>
                  <p className="font-medium text-text-primary">{card.condition.glass}</p>
                </div>
              )}
              {card.condition.body && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("condition.body")}</label>
                  <p className="font-medium text-text-primary">{card.condition.body}</p>
                </div>
              )}
              {card.condition.otherNotes && (
                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground">{t("condition.otherNotes")}</label>
                  <p className="font-medium text-text-primary">{card.condition.otherNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          )}
        </CardContent>
      </Card>

      {card.itemsLeftInCar && card.itemsLeftInCar.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Boxes className="h-4 w-4 text-primary" />
              {t("sections.itemsLeft")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {card.itemsLeftInCar.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 text-primary" />
            {t("sections.work")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {card.workItems.length > 0 ? (
            <div className="space-y-3">
              {card.workItems.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <div className="lg:col-span-2 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">{t("work.description")}</label>
                      <p className="font-medium text-text-primary">{item.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => setEditingWorkItem(item.id)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("work.estimate")}</label>
                    <p className="font-medium text-text-primary ltr" dir="ltr">
                      {formatCurrency(item.estimatedCost)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("work.status")}</label>
                    <p className="font-medium text-text-primary">
                      {t(`work.statuses.${item.status}`)}
                    </p>
                  </div>
                  {item.quantity && (
                    <div>
                      <label className="text-xs text-muted-foreground">{t("work.quantity")}</label>
                      <p className="font-medium text-text-primary ltr" dir="ltr">{item.quantity}</p>
                    </div>
                  )}
                  {item.assignee && (
                    <div>
                      <label className="text-xs text-muted-foreground">{t("work.assignee")}</label>
                      <p className="font-medium text-text-primary">{item.assignee}</p>
                    </div>
                  )}
                  {item.isRequired && (
                    <div>
                      <label className="text-xs text-muted-foreground">{t("work.required")}</label>
                      <p className="font-medium text-primary">{t("condition.yes")}</p>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <span className="text-sm text-muted-foreground">{t("work.total")}</span>
                <span className="text-base font-semibold text-text-primary">{formatCurrency(workTotal)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("work.noWork")}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <BadgeCheck className="h-4 w-4 text-primary" />
            {t("sections.approval")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">{t("approval.approved")}</label>
              <p className="font-medium text-text-primary">
                {card.approval?.approved ? t("approval.approved") : t("approval.notApproved")}
              </p>
            </div>
            {card.approval?.amount && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.amount")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {formatCurrency(card.approval.amount)}
                </p>
              </div>
            )}
            {card.expectedDelivery?.date && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.deliveryDate")}</label>
                <p className="font-medium text-text-primary">
                  {formatDateTime(card.expectedDelivery.date)}
                </p>
              </div>
            )}
            {card.expectedDelivery?.time && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.deliveryTime")}</label>
                <p className="font-medium text-text-primary">
                  {formatDateTime(card.expectedDelivery.time)}
                </p>
              </div>
            )}
            {card.receiverName && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.receiver")}</label>
                <p className="font-medium text-text-primary">{card.receiverName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="h-4 w-4 text-primary" />
            {t("activity.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline events={activityEvents ?? []} />
        </CardContent>
      </Card>

      {editingWorkItem && card && (
        <WorkItemEdit
          workItem={card.workItems.find((w) => w.id === editingWorkItem)!}
          cardId={cardId!}
          open={!!editingWorkItem}
          onOpenChange={(open) => !open && setEditingWorkItem(null)}
        />
      )}
      {card && (
        <CloseCardDialog
          card={card}
          open={isCloseDialogOpen}
          onOpenChange={setIsCloseDialogOpen}
        />
      )}
    </div>
  )
}

export default ReceiptDetailsPage
