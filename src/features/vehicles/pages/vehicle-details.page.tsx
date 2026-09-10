import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Car, Pencil, Power, Repeat2, User } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { normalizeApiError } from "@/lib/api/api-error"
import { formatDate } from "@/lib/formatter"
import { useCustomers } from "@/features/customers/hooks/useCustomers"
import { useSetVehicleActive, useTransferVehicleOwnership, useVehicle, useVehicleMaintenanceHistory, useVehicleOwnership } from "../hooks/useVehicles"

export default function VehicleDetailsPage(){
  const {t}=useTranslation("vehicles");const {vehicleId}=useParams<{vehicleId:string}>();const nav=useNavigate();const [target,setTarget]=useState("");const [historyPage,setHistoryPage]=useState(1)
  const vehicle=useVehicle(vehicleId);const ownership=useVehicleOwnership(vehicleId);const history=useVehicleMaintenanceHistory(vehicleId,{page:historyPage,limit:10});const customers=useCustomers({page:1,limit:100,isActive:true});const activeMutation=useSetVehicleActive();const transfer=useTransferVehicleOwnership()
  if(vehicle.isError) return <ErrorState title={t("loadError")} description={vehicle.error.message} retry={()=>void vehicle.refetch()}/>
  if(vehicle.isLoading||!vehicle.data)return <div className="h-80 animate-pulse rounded-xl bg-muted/40" aria-busy="true"/>
  const v=vehicle.data;const current=ownership.data?.currentOwner??v.currentOwnership
  return <div className="flex flex-col gap-4"><PageHeader title={`${v.make} ${v.model}`} description={v.plateNumber} showBackButton backButtonLabel={t("back")} onBackClick={()=>nav("/vehicles")} rightContent={<Button variant="outline" onClick={()=>nav(`/vehicles/${v.id}/edit`)}><Pencil className="me-2 h-4 w-4"/>{t("edit")}</Button>}/>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-primary"/>{t("details")}</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><p>{t("fields.make")}: {v.make}</p><p>{t("fields.model")}: {v.model}</p><p>{t("fields.year")}: {v.manufactureYear}</p><p dir="ltr">{t("fields.plate")}: {v.plateNumber}</p><p dir="ltr">{t("fields.vin")}: {v.vin??"—"}</p><p>{t("fields.color")}: {v.color??"—"}</p><p>{t("fields.transmission")}: {t(`transmission.${v.transmission}`)}</p><Badge className="w-fit" variant={v.isActive?"default":"secondary"}>{t(v.isActive?"active":"inactive")}</Badge><Button className="w-fit" variant="outline" disabled={activeMutation.isPending} onClick={()=>{if(window.confirm(t(v.isActive?"confirmDeactivate":"confirmActivate")))activeMutation.mutate({id:v.id,isActive:!v.isActive})}}><Power className="me-2 h-4 w-4"/>{t(v.isActive?"deactivate":"activate")}</Button></CardContent></Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/>{t("ownership.title")}</CardTitle></CardHeader><CardContent className="space-y-4"><p>{t("ownership.current")}: <strong>{current?.customer.name??"—"}</strong></p><div className="flex flex-col gap-2 sm:flex-row"><Select value={target} onValueChange={setTarget}><SelectTrigger><SelectValue placeholder={t("ownership.target")}/></SelectTrigger><SelectContent>{(customers.data?.items??[]).filter(c=>c.id!==current?.customer.id).map(c=><SelectItem key={c.id} value={c.id}>{c.name} — {c.phone}</SelectItem>)}</SelectContent></Select><Button disabled={!target||transfer.isPending||!v.isActive} onClick={()=>transfer.mutate({vehicleId:v.id,customerId:target,previousCustomerId:current?.customer.id},{onSuccess:()=>setTarget("")})}><Repeat2 className="me-2 h-4 w-4"/>{t("ownership.transfer")}</Button></div>{transfer.error&&<p role="alert" className="text-sm text-primary">{normalizeApiError(transfer.error).message}</p>}<div className="space-y-2">{(ownership.data?.history??[]).map(o=><div key={o.id} className="rounded border p-3 text-sm"><strong>{o.customer.name}</strong> · {formatDate(o.startedAt)} — {o.endedAt?formatDate(o.endedAt):t("ownership.current")}</div>)}</div></CardContent></Card>
    <Card><CardHeader><CardTitle>{t("history")}</CardTitle></CardHeader><CardContent>{history.isError?<p className="text-primary">{history.error.message}</p>:(history.data?.history.items??[]).length===0?<p className="text-muted-foreground">{t("noHistory")}</p>:<div className="space-y-2">{history.data!.history.items.map(h=><button className="flex w-full justify-between rounded border p-3 text-start" key={h.id} onClick={()=>nav(`/maintenance/${h.id}`)}><span>{h.cardNumber}</span><span>{formatDate(h.receivedAt)}</span><Badge>{h.status}</Badge></button>)}<div className="flex justify-end gap-2"><Button variant="outline" disabled={historyPage<=1} onClick={()=>setHistoryPage(p=>p-1)}>{t("previous")}</Button><Button variant="outline" disabled={!history.data?.history.meta.hasNextPage} onClick={()=>setHistoryPage(p=>p+1)}>{t("next")}</Button></div></div>}</CardContent></Card>
  </div>
}
