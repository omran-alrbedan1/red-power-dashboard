import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { User, Phone, Mail, Pencil, Power } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ErrorState from "@/components/shared/states/ErrorState"
import { ApiClientError } from "@/lib/api/api-error"
import { useCustomer } from "../hooks/useCustomer"
import { useCustomerMaintenanceHistory, useSetCustomerActive } from "../hooks/useCustomers"
import { CustomerVehicles } from "../components/customer-vehicles"

const DetailItem=({icon:Icon,label,value}:{icon:React.ElementType;label:string;value?:string|null})=>value?<div className="flex items-start gap-2"><Icon className="mt-0.5 h-4 w-4 text-primary"/><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div></div>:null

export default function CustomerDetailsPage(){
  const {t}=useTranslation("customers");const {customerId}=useParams<{customerId:string}>();const navigate=useNavigate();const [page,setPage]=useState(1);const customerQuery=useCustomer(customerId);const history=useCustomerMaintenanceHistory(customerId,{page,limit:10});const active=useSetCustomerActive()
  if(customerQuery.isError){const missing=customerQuery.error instanceof ApiClientError&&customerQuery.error.statusCode===404;return <ErrorState variant={missing?"404":"default"} title={missing?t("notFound"):t("loadError")} description={customerQuery.error.message} retry={missing?undefined:()=>void customerQuery.refetch()}/>}
  if(!customerQuery.data)return <div className="space-y-4" aria-busy="true"><div className="h-28 animate-pulse rounded-xl bg-muted/40"/><div className="h-40 animate-pulse rounded-xl bg-muted/40"/></div>
  const customer=customerQuery.data
  return <div className="flex flex-col gap-4"><PageHeader title={customer.name} description={t("details")} showBackButton backButtonLabel={t("backToList")} onBackClick={()=>navigate("/customers")} rightContent={<div className="flex gap-2"><Button variant="outline" disabled={active.isPending} onClick={()=>{if(window.confirm(t(customer.isActive?"confirmDeactivate":"confirmActivate")))active.mutate({id:customer.id,isActive:!customer.isActive})}}><Power className="me-2 h-4 w-4"/>{t(customer.isActive?"deactivate":"activate")}</Button><Button variant="outline" onClick={()=>navigate(`/customers/${customer.id}/edit`)}><Pencil className="me-2 h-4 w-4"/>{t("editCustomer")}</Button></div>}/>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/>{t("details")}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><DetailItem icon={User} label={t("fields.name")} value={customer.name}/><DetailItem icon={Phone} label={t("fields.phone")} value={customer.phone}/><DetailItem icon={Mail} label={t("fields.email")} value={customer.email}/></CardContent></Card>
    <CustomerVehicles vehicles={customer.currentVehicles} onVehicleClick={id=>navigate(`/vehicles/${id}`)}/>
    <Card><CardHeader><CardTitle>{t("history.title")}</CardTitle></CardHeader><CardContent>{history.isError?<p role="alert" className="text-primary">{history.error.message}</p>:(history.data?.history.items??[]).length===0?<p className="text-muted-foreground">{t("history.noHistory")}</p>:<div className="space-y-2">{history.data!.history.items.map(item=><button key={item.id} onClick={()=>navigate(`/maintenance/${item.id}`)} className="flex w-full justify-between rounded border p-3 text-start"><span>{item.cardNumber}</span><BadgeText value={item.status}/></button>)}<div className="flex justify-end gap-2"><Button variant="outline" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>{t("pagination.previous")}</Button><Button variant="outline" disabled={!history.data?.history.meta.hasNextPage} onClick={()=>setPage(p=>p+1)}>{t("pagination.next")}</Button></div></div>}</CardContent></Card>
  </div>
}

const BadgeText=({value}:{value:string})=><span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">{value}</span>
