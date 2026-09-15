import type { ReactNode } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BadgeCheck, Boxes, Calendar, Car, ClipboardList, FileText, Fuel, History, LockKeyhole, Mail, Pencil, Unlock, User2, Wrench } from "lucide-react"

import PageHeader from "@/components/shared/headers/PageHeader"
import EmptyState from "@/components/shared/states/EmptyState"
import ErrorState from "@/components/shared/states/ErrorState"
import { Button } from "@/components/ui/button"

import { useAuth } from "@/features/auth/context/AuthContext"
import { formatDateTime } from "@/lib/formatter"
import { canEditMaintenanceCard, isSuperAdmin } from "@/lib/permissions"

import { ActivityTimeline } from "../components/ActivityTimeline"
import { CloseCardDialog } from "../components/CloseCardDialog"
import { ClosureGuardBadge } from "../components/ClosureGuardBadge"
import { MaintenanceWorkList } from "../components/work/MaintenanceWorkList"
import { MaintenanceMediaSection } from "../components/sections/MaintenanceMediaSection"
import { useMaintenanceActivity } from "../hooks/useMaintenanceActivity"
import { useMaintenanceCard } from "../hooks/useMaintenanceCard"
import { useReopenCard } from "../hooks/useReopenCard"
import { images } from "@/constants/images"

interface SectionCardProps {
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
}

function SectionCard({ icon, title, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}>
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
        <h2 className="text-base font-bold text-foreground">{title}</h2>
      </div>

      {children}
    </section>
  )
}

interface DetailItemProps {
  label: string
  value?: ReactNode
  ltr?: boolean
  className?: string
}

function DetailItem({ label, value, ltr = false, className = "" }: DetailItemProps) {
  return (
    <div className={`flex min-w-0 items-center justify-between gap-4 ${className}`}>
      <span className="shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words text-sm font-semibold text-foreground" dir={ltr ? "ltr" : undefined}>{value ?? "—"}</span>
    </div>
  )
}

interface OptionPillsProps {
  values: Array<{
    id: number
    label: string
  }>
}

function OptionPills({ values }: OptionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((option) => (
        <span key={option.id} className="inline-flex items-center rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground">{option.label}</span>
      ))}
    </div>
  )
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const isOpen = status === "open"

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${isOpen ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
      <span className={`size-2 rounded-full ${isOpen ? "bg-emerald-500" : "bg-muted-foreground"}`} />
      {label}
    </span>
  )
}

const ReceiptDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation("maintenance")
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: card, isLoading, isError } = useMaintenanceCard(cardId)
  const { data: activityEvents = [], isLoading: isActivityLoading, isError: isActivityError, refetch: retryActivity } = useMaintenanceActivity(cardId)
  const reopenCard = useReopenCard()

  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)

  const direction = i18n.dir()
  const locale = direction === "rtl" ? "ar-SA" : "en-GB"
  const isSuperAdminUser = isSuperAdmin(user?.role)
  const canEdit = canEditMaintenanceCard(user?.role)

  const handleReopen = () => {
    if (!cardId) return
    reopenCard.mutate(Number(cardId))
  }

  if (isLoading) {
    return (
      <div dir={direction} className="flex min-h-[300px] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-sm font-medium text-muted-foreground">{t("saving")}</p>
      </div>
    )
  }

  if (isError) {
    return <ErrorState variant="default" retry={() => window.location.reload()} />
  }

  if (!card) {
    return <EmptyState title={t("empty")} description="" />
  }

  const isCardClosed = card.status === "closed"

  const canClose = card.requiredWorks.filter((work) => work.isRequired).every((work) => work.status === "completed" || work.status === "cancelled")

  return (
    <div dir={direction} className="mx-auto max-w-7xl space-y-6">
      <PageHeader title={t("details")} backgroundImage={images.cardDetailsHero} description={`${t("receiptNumber")}: ${card.cardNumber}`} showBackButton backButtonLabel={t("backToList")} />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-5 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <StatusBadge status={card.status} label={t(`statuses.${card.status}`)} />

              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" />
                  <span>{t("receivedAt")}</span>
                </div>

                <p className="mt-1 text-xs font-semibold text-foreground">{formatDateTime(card.receivedAt, locale)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Mail className="size-4" />
              </span>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t("customer.email")}</p>
                <p className="mt-1 truncate text-xs font-semibold text-foreground" dir="ltr">{card.customer?.email || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>

              <div>
                <p className="text-xs text-muted-foreground">{t("receiptNumber")}</p>
                <p className="mt-1 text-xs font-semibold text-foreground" dir="ltr">{card.cardNumber}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isCardClosed && canEdit && (
              <Button type="button" onClick={() => navigate(`/maintenance/${card.id}/edit`)} className="gap-2">
                <Pencil className="size-4" />
                {t("editCard")}
              </Button>
            )}

            {!isCardClosed && (
              <Button type="button" variant="outline" disabled={!canClose} onClick={() => setIsCloseDialogOpen(true)} className="gap-2">
                <LockKeyhole className="size-4" />
                {t("closeCard.close")}
              </Button>
            )}

            {isCardClosed && isSuperAdminUser && (
              <Button type="button" variant="outline" disabled={reopenCard.isPending} onClick={handleReopen} className="gap-2">
                <Unlock className="size-4" />
                {reopenCard.isPending ? t("saving") : t("reopenCard.reopen")}
              </Button>
            )}
          </div>
        </div>

        {!isCardClosed && (
          <div className="mt-5 border-t border-border pt-4">
            <ClosureGuardBadge requiredWorks={card.requiredWorks} />
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
            <SectionCard icon={<User2 className="size-4" />} title={t("sections.customer")} className="lg:col-span-4">
              <div className="space-y-4">
                <DetailItem label={t("customer.name")} value={card.customer?.name} />
                <DetailItem label={t("customer.phone")} value={card.customer?.phone} ltr />
                {card.customer?.email && <DetailItem label={t("customer.email")} value={card.customer.email} ltr />}
              </div>
            </SectionCard>

            <SectionCard icon={<Car className="size-4" />} title={t("sections.vehicle")} className="lg:col-span-8">
              <div className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
                <DetailItem label={t("vehicle.make")} value={card.vehicle?.make} />
                <DetailItem label={t("vehicle.plateNumber")} value={card.vehicle?.plateNumber} ltr />
                <DetailItem label={t("vehicle.model")} value={card.vehicle?.model} />
                <DetailItem label={t("vehicle.vin")} value={card.vehicle?.vin} ltr />
                <DetailItem label={t("vehicle.year")} value={card.vehicle?.manufactureYear} ltr />
                <DetailItem label={t("vehicle.transmissionType")} value={card.vehicle?.transmission ? t(`vehicle.transmission_type.${card.vehicle.transmission}`) : undefined} />
                <DetailItem label={t("vehicle.mileage")} value={`${card.mileage} ${t("units.km")}`} ltr />
              </div>
            </SectionCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard icon={<ClipboardList className="size-4" />} title={t("sections.reason")}>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{t("reason.title")}</p>
                  {card.visitReasons.length > 0 ? <OptionPills values={card.visitReasons} /> : <p className="text-sm text-muted-foreground">—</p>}
                </div>

                {card.customerComplaint && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{t("reason.complaint")}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{card.customerComplaint}</p>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard icon={<Fuel className="size-4" />} title={t("sections.condition")}>
              <div className="space-y-5">
                <DetailItem label={t("condition.fuelLevel")} value={t(`condition.fuelLevels.${card.fuelLevel}`)} />

                {card.conditionOptions.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{t("condition.options")}</p>
                    <OptionPills values={card.conditionOptions} />
                  </div>
                )}

                {card.inspectionNotes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{t("condition.otherNotes")}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{card.inspectionNotes}</p>
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard icon={<Boxes className="size-4" />} title={t("sections.itemsLeft")}>
              {card.itemOptions.length > 0 ? <OptionPills values={card.itemOptions} /> : <p className="text-sm text-muted-foreground">—</p>}
            </SectionCard>
          </div>

          <SectionCard icon={<Wrench className="size-4" />} title={t("sections.work")}>
            <MaintenanceWorkList cardId={card.id} works={card.requiredWorks} readOnly={isCardClosed} />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard icon={<BadgeCheck className="size-4" />} title={t("sections.approval")}>
              <div className="space-y-4">
                <DetailItem label={t("approval.status")} value={card.customerApproved ? t("approval.approved") : t("approval.notApproved")} />

                {card.customerApprovalName && <DetailItem label={t("approval.customerName")} value={card.customerApprovalName} />}

                {card.customerApprovedAt && <DetailItem label={t("approval.approvedAt")} value={formatDateTime(card.customerApprovedAt, locale)} />}

                {card.expectedDeliveryAt && <DetailItem label={t("approval.deliveryDate")} value={formatDateTime(card.expectedDeliveryAt, locale)} />}
              </div>
            </SectionCard>

            <SectionCard icon={<FileText className="size-4" />} title={t("media.title")}>
              <MaintenanceMediaSection cardId={card.id} />
            </SectionCard>
          </div>

      <SectionCard icon={<History className="size-4" />} title={t("activity.title")}>
        {isActivityLoading ? (
          <div className="space-y-3">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            <p className="text-sm font-medium text-muted-foreground">{t("saving")}</p>
          </div>
        ) : isActivityError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">{t("errors.workActivityFailed")}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => retryActivity()}>
              {t("media.retry")}
            </Button>
          </div>
        ) : (
          <ActivityTimeline events={activityEvents} />
        )}
      </SectionCard>

      <CloseCardDialog card={card} open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen} />
    </div>
  )
}

export default ReceiptDetailsPage
