import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Car, Plus, Search, User, Hash } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import ErrorState from "@/components/shared/states/ErrorState"
import { EmptyState } from "@/components/shared/states"
import { Badge } from "@/components/ui/badge"
import { useVehicles } from "../hooks/useVehicles"
import type { VehicleWithOwner } from "../types/vehicle.types"

export default function VehiclesListPage() {
  const { t } = useTranslation("vehicles"); const navigate = useNavigate(); const [page,setPage]=useState(1); const [draft,setDraft]=useState(""); const [search,setSearch]=useState(""); const [active,setActive]=useState("true"); const limit=10
  const query=useVehicles({page,limit,search:search||undefined,isActive:active==="all"?undefined:active==="true"})
  const columns: Column<VehicleWithOwner>[]=[
    {key:"vehicle",header:t("table.vehicle"),headerIcon:Car,cell:v=><span className="font-medium">{v.make} {v.model}</span>},
    {key:"plate",header:t("fields.plate"),headerIcon:Hash,cell:v=><span dir="ltr">{v.plateNumber}</span>},
    {key:"owner",header:t("table.owner"),headerIcon:User,cell:v=>v.currentOwnership?.customer.name ?? "—"},
    {key:"status",header:t("table.status"),cell:v=><Badge variant={v.isActive?"default":"secondary"}>{t(v.isActive?"active":"inactive")}</Badge>},
  ]
  if(query.isError) return <ErrorState title={t("loadError")} description={query.error.message} retry={()=>void query.refetch()} />
  const data=query.data?.items??[]; const meta=query.data?.meta
  return <div className="flex flex-col gap-4"><PageHeader title={t("title")} description={t("subtitle")} rightContent={<Button onClick={()=>navigate("/vehicles/new")}><Plus className="me-2 h-4 w-4" />{t("add")}</Button>} />
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground"/><Input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setPage(1);setSearch(draft.trim())}}} className="ps-9" placeholder={t("search")} /></div><Select value={active} onValueChange={v=>{setPage(1);setActive(v)}}><SelectTrigger className="sm:w-44"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="true">{t("active")}</SelectItem><SelectItem value="false">{t("inactive")}</SelectItem><SelectItem value="all">{t("all")}</SelectItem></SelectContent></Select><Button onClick={()=>{setPage(1);setSearch(draft.trim())}}>{t("apply")}</Button></div>
    {!query.isLoading&&data.length===0?<EmptyState icon={Car} title={t("empty")} description={t("subtitle")} />:<DataTable data={data} columns={columns} loading={query.isLoading} pagination={{total:meta?.total??0,page:meta?.page??page,lastPage:meta?.totalPages??0,perPage:meta?.limit??limit}} onPageChange={setPage} getRowId={v=>v.id} onRowClick={v=>navigate(`/vehicles/${v.id}`)} />}
  </div>
}
