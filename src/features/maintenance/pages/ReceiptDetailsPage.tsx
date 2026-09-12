import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import {
  User2,
  Car,
  ClipboardList,
  Wrench,
  BadgeCheck,
  Boxes,
  Fuel,
  History,
  LockKeyhole,
  Unlock,
} from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EmptyState from "@/components/shared/states/EmptyState"
import ErrorState from "@/components/shared/states/ErrorState"
import { useMaintenanceCard } from "../hooks/useMaintenanceCard"
import { useAuth } from "@/features/auth/context/AuthContext"
import { useReopenCard } from "../hooks/useReopenCard"
import { ReceiptHeader } from "../components/sections/ReceiptHeader"
import { ActivityTimeline } from "../components/ActivityTimeline"
import { CloseCardDialog } from "../components/CloseCardDialog"
import { ClosureGuardBadge } from "../components/ClosureGuardBadge"
import { formatDateTime } from "@/lib/formatter"

const ReceiptDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation("maintenance")
  const isAr = i18n.language === "ar"
  const { cardId } = useParams<{ cardId: string }>()
  const { user } = useAuth()
  const { data: card, isLoading, isError } = useMaintenanceCard(cardId)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const isCardClosed = card?.status === "closed"
  const isSuperAdmin = user?.role === "super_admin"
  const reopenCard = useReopenCard()

  const handleReopen = () => {
    if (cardId) {
      reopenCard.mutate(Number(cardId))
    }
  }

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

  const workTotal = card.requiredWorks.reduce((sum, item) => {
    const cost = Number(item.estimatedCost) || 0
    return sum + cost
  }, 0)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("details")}
        description={`${t("receiptNumber")}: ${card.cardNumber}`}
        showBackButton
        backButtonLabel={t("backToList")}
      />

      <Card>
        <CardHeader>
          <ReceiptHeader
            receiptNumber={card.cardNumber}
            status={card.status}
            createdAt={card.receivedAt}
          />
        </CardHeader>
      </Card>

      {card.status !== "closed" && (
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
            <ClosureGuardBadge requiredWorks={card.requiredWorks} />
          </CardContent>
        </Card>
      )}

      {isCardClosed && isSuperAdmin && (
        <Card>
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">{t("reopenCard.title")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("reopenCard.summary")}</p>
            </div>
            <Button className="shrink-0" variant="outline" onClick={handleReopen} disabled={reopenCard.isPending}>
              <Unlock className="h-4 w-4" />
              {reopenCard.isPending ? t("saving") : t("reopenCard.reopen")}
            </Button>
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
              <p className="font-medium text-text-primary">{card.customer.name}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("customer.phone")}</label>
              <p className="font-medium text-text-primary ltr" dir="ltr">
                {card.customer.phone}
              </p>
            </div>
            {card.customer.email && (
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">{t("customer.email")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.customer.email}
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
              <p className="font-medium text-text-primary">{card.vehicle.make}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.model")}</label>
              <p className="font-medium text-text-primary">{card.vehicle.model}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.plateNumber")}</label>
              <p className="font-medium text-text-primary ltr" dir="ltr">
                {card.vehicle.plateNumber}
              </p>
            </div>
            {card.vehicle.manufactureYear && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.year")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.vehicle.manufactureYear}
                </p>
              </div>
            )}
            {card.vehicle.vin && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.vin")}</label>
                <p className="font-medium text-text-primary ltr" dir="ltr">
                  {card.vehicle.vin}
                </p>
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground">{t("vehicle.mileage")}</label>
              <p className="font-medium text-text-primary ltr" dir="ltr">
                {card.mileage} {t("units.km")}
              </p>
            </div>
            {card.vehicle.transmission && (
              <div>
                <label className="text-xs text-muted-foreground">{t("vehicle.transmissionType")}</label>
                <p className="font-medium text-text-primary">
                  {t(`vehicle.transmission_type.${card.vehicle.transmission}`)}
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
              {card.visitReasons.map((reason) => reason.label).join("، ") || "-"}
            </p>
          </div>
          {card.customerComplaint && (
            <div>
              <label className="text-xs text-muted-foreground">{t("reason.complaint")}</label>
              <p className="font-medium text-text-primary">{card.customerComplaint}</p>
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
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">{t("condition.fuelLevel")}</label>
            <p className="font-medium text-text-primary">
              {t(`condition.fuelLevels.${card.fuelLevel}`)}
            </p>
          </div>
          {card.conditionOptions.length > 0 && (
            <div>
              <label className="text-xs text-muted-foreground">{t("condition.options")}</label>
              <div className="flex flex-wrap gap-2">
                {card.conditionOptions.map((option) => (
                  <span
                    key={option.id}
                    className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm"
                  >
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {card.inspectionNotes && (
            <div>
              <label className="text-xs text-muted-foreground">{t("condition.otherNotes")}</label>
              <p className="font-medium text-text-primary">{card.inspectionNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {card.itemOptions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Boxes className="h-4 w-4 text-primary" />
              {t("sections.itemsLeft")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {card.itemOptions.map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm"
                >
                  {option.label}
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
          {card.requiredWorks.length > 0 ? (
            <div className="space-y-3">
              {card.requiredWorks.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <div className="lg:col-span-2 flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-muted-foreground">{t("work.description")}</label>
                      <p className="font-medium text-text-primary">{item.description}</p>
                    </div>
                    {item.isRequired && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {t("work.required")}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("work.estimate")}</label>
                    <p className="font-medium text-text-primary ltr" dir="ltr">
                      {item.estimatedCost !== null ? item.estimatedCost : "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">{t("work.status")}</label>
                    <p className="font-medium text-text-primary">
                      {t(`work.statuses.${item.status}`)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
                <span className="text-sm text-muted-foreground">{t("work.total")}</span>
                <span className="text-base font-semibold text-text-primary">{workTotal}</span>
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
                {card.customerApproved ? t("approval.approved") : t("approval.notApproved")}
              </p>
            </div>
            {card.customerApproved && card.customerApprovalName && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.customerName")}</label>
                <p className="font-medium text-text-primary">{card.customerApprovalName}</p>
              </div>
            )}
            {card.customerApproved && card.customerApprovedAt && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.approvedAt")}</label>
                <p className="font-medium text-text-primary">
                  {formatDateTime(card.customerApprovedAt, isAr ? "ar-SA" : "en-GB")}
                </p>
              </div>
            )}
            {card.expectedDeliveryAt && (
              <div>
                <label className="text-xs text-muted-foreground">{t("approval.deliveryDate")}</label>
                <p className="font-medium text-text-primary">
                  {formatDateTime(card.expectedDeliveryAt, isAr ? "ar-SA" : "en-GB")}
                </p>
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
          <ActivityTimeline events={card.statusEvents} />
        </CardContent>
      </Card>

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