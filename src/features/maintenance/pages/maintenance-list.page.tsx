import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CalendarDays, Car, FileText, Plus, Search, User, Wrench } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import ErrorState from "@/components/shared/states/ErrorState"
import { formatDate } from "@/lib/formatter"
import { useMaintenanceCards } from "../hooks/useMaintenanceCards"
import { MaintenanceStatusBadge } from "../components/status-badge"
import type { MaintenanceCardListItem, MaintenanceStatus } from "../types/maintenance.types"

export default function MaintenanceListPage() {
  const { t, i18n } = useTranslation("maintenance")
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<MaintenanceStatus | "ALL">("ALL")
  const [receivedFrom, setReceivedFrom] = useState("")
  const [receivedTo, setReceivedTo] = useState("")
  const params = { page, limit: 10, ...(search && { search }), ...(status !== "ALL" && { status }), ...(receivedFrom && { receivedFrom: new Date(`${receivedFrom}T00:00:00`).toISOString() }), ...(receivedTo && { receivedTo: new Date(`${receivedTo}T23:59:59`).toISOString() }) }
  const query = useMaintenanceCards(params)
  const apply = () => { setPage(1); setSearch(draft.trim()) }
  const columns: Column<MaintenanceCardListItem>[] = [
    { key: "cardNumber", header: t("receiptNumber"), headerIcon: FileText, cell: c => <b dir="ltr">{c.cardNumber}</b> },
    { key: "customer", header: t("list.customer"), headerIcon: User, cell: c => c.customer.name },
    { key: "vehicle", header: t("list.vehicle"), headerIcon: Car, cell: c => <span>{c.vehicleOwnership.vehicle.make} {c.vehicleOwnership.vehicle.model} <span dir="ltr">({c.vehicleOwnership.vehicle.plateNumber})</span></span> },
    { key: "status", header: t("status"), headerIcon: Wrench, cell: c => <MaintenanceStatusBadge status={c.status} /> },
    { key: "receivedAt", header: t("createdAt"), headerIcon: CalendarDays, cell: c => formatDate(c.receivedAt, i18n.language === "ar" ? "ar-JO" : "en-GB") },
  ]
  if (query.isError) return <ErrorState variant="default" retry={() => void query.refetch()} />
  return <div className="flex flex-col gap-4">
    <PageHeader title={t("title")} description={t("subtitle")} rightContent={<Button onClick={() => navigate("/maintenance/new")}><Plus className="me-2 h-4 w-4" />{t("addCard")}</Button>} />
    <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_180px_160px_160px_auto]">
      <div className="relative"><Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground"/><Input className="ps-9" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === "Enter" && apply()} placeholder={t("filter.search", "ابحث برقم البطاقة")}/></div>
      <Select value={status} onValueChange={v => { setPage(1); setStatus(v as MaintenanceStatus | "ALL") }}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="ALL">{t("filter.all", "الكل")}</SelectItem><SelectItem value="OPEN">{t("statuses.OPEN")}</SelectItem><SelectItem value="CLOSED">{t("statuses.CLOSED")}</SelectItem></SelectContent></Select>
      <Input type="date" value={receivedFrom} onChange={e => { setPage(1); setReceivedFrom(e.target.value) }} aria-label={t("filter.from", "من")}/>
      <Input type="date" value={receivedTo} onChange={e => { setPage(1); setReceivedTo(e.target.value) }} aria-label={t("filter.to", "إلى")}/>
      <Button onClick={apply}>{t("filter.apply", "تطبيق")}</Button>
    </div>
    <DataTable data={query.data?.items ?? []} columns={columns} loading={query.isLoading} pagination={{ total: query.data?.meta.total ?? 0, page, lastPage: query.data?.meta.totalPages ?? 1, perPage: 10 }} onPageChange={setPage} getRowId={c => c.id} onRowClick={c => navigate(`/maintenance/${c.id}`)} emptyMessage={t("empty")} />
  </div>
}
