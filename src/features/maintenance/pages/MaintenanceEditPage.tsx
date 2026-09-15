import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LockKeyhole, Unlock } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import EmptyState from "@/components/shared/states/EmptyState"
import ErrorState from "@/components/shared/states/ErrorState"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/context/AuthContext"
import { ApiError } from "@/lib/api/client"
import { canEditMaintenanceCard, canReopenMaintenanceCard } from "@/lib/permissions"
import { EditMediaSection } from "../components/edit/EditMediaSection"
import { EditWorkItemsSection } from "../components/edit/EditWorkItemsSection"
import { MaintenanceEditForm } from "../components/edit/MaintenanceEditForm"
import { useMaintenanceCard } from "../hooks/useMaintenanceCard"
import { useReopenCard } from "../hooks/useReopenCard"
import { images } from "@/constants/images"




const MaintenanceEditPage: React.FC = () => {
  const { t, i18n } = useTranslation("maintenance")
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const cardQuery = useMaintenanceCard(cardId)
  const reopenCard = useReopenCard()
  const numericCardId = Number(cardId)
  const validCardId = Number.isInteger(numericCardId) && numericCardId > 0
  const detailsPath = validCardId ? `/maintenance/${numericCardId}` : "/maintenance"

  if (!validCardId) {
    return <div dir={i18n.dir()}><ErrorState variant="404" title={t("edit.notFoundTitle")} description={t("edit.notFoundDescription")} action={<Button onClick={() => navigate("/maintenance")}>{t("backToList")}</Button>} /></div>
  }

  if (cardQuery.isLoading) {
    return <div dir={i18n.dir()} className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-card"><p className="text-sm font-medium text-muted-foreground">{t("edit.loading")}</p></div>
  }

  if (cardQuery.isError) {
    const notFound = cardQuery.error instanceof ApiError && cardQuery.error.status === 404
    return <div dir={i18n.dir()}><ErrorState variant={notFound ? "404" : "default"} title={notFound ? t("edit.notFoundTitle") : t("edit.loadErrorTitle")} description={notFound ? t("edit.notFoundDescription") : t("edit.loadErrorDescription")} retry={notFound ? undefined : () => cardQuery.refetch()} action={notFound ? <Button onClick={() => navigate("/maintenance")}>{t("backToList")}</Button> : undefined} /></div>
  }

  const card = cardQuery.data
  if (!card) {
    return <div dir={i18n.dir()}><ErrorState variant="404" title={t("edit.notFoundTitle")} description={t("edit.notFoundDescription")} action={<Button onClick={() => navigate("/maintenance")}>{t("backToList")}</Button>} /></div>
  }

  if (!canEditMaintenanceCard(user?.role)) {
    return <div dir={i18n.dir()}><ErrorState variant="403" title={t("edit.forbiddenTitle")} description={t("edit.forbiddenDescription")} action={<Button onClick={() => navigate(detailsPath)}>{t("edit.backToDetails")}</Button>} /></div>
  }

  if (card.status === "closed") {
    const canReopen = canReopenMaintenanceCard(user?.role)
    return (
      <div dir={i18n.dir()} className="mx-auto max-w-5xl space-y-6">
        <PageHeader title={t("edit.title")} description={`${t("receiptNumber")}: ${card.cardNumber}`} showBackButton backButtonLabel={t("edit.backToDetails")} onBackClick={() => navigate(detailsPath)} />
        <EmptyState title={t("edit.closedTitle")} description={canReopen ? t("edit.closedSuperAdminDescription") : t("edit.closedAdminDescription")} icon={LockKeyhole} className="rounded-2xl border border-border" primaryAction={canReopen ? { label: reopenCard.isPending ? t("saving") : t("reopenCard.reopen"), icon: Unlock, onClick: () => reopenCard.mutate(card.id) } : undefined} secondaryAction={{ label: t("edit.backToDetails"), onClick: () => navigate(detailsPath) }} />
      </div>
    )
  }

  return (
    <div dir={i18n.dir()} className="mx-auto max-w-7xl space-y-6 relative overflow-visible">
      <PageHeader title={t("edit.title")} backgroundImage={images.cardDetailsHero} description={`${t("receiptNumber")}: ${card.cardNumber}`} showBackButton backButtonLabel={t("edit.backToDetails")} onBackClick={() => navigate(detailsPath)} />
      <MaintenanceEditForm card={card} onSaved={() => navigate(detailsPath)} onCancel={() => navigate(detailsPath)} />
      <EditWorkItemsSection cardId={card.id} works={card.requiredWorks} />
      <EditMediaSection cardId={card.id} />
    </div>
  )
}

export default MaintenanceEditPage
