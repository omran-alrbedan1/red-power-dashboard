import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { normalizeApiError } from "@/lib/api/api-error"
import { VehicleForm } from "../components/vehicle-form"
import { useCreateVehicle } from "../hooks/useVehicles"
import type { VehicleFormValues } from "../validation/vehicle.validation"

export default function VehicleCreatePage(){const {t}=useTranslation("vehicles");const nav=useNavigate();const mutation=useCreateVehicle();const submit=(v:VehicleFormValues)=>mutation.mutate({...v,vin:v.vin||undefined,color:v.color||undefined},{onSuccess:x=>nav(`/vehicles/${x.id}`,{replace:true})});return <div className="flex flex-col gap-4"><PageHeader title={t("add")} description={t("subtitle")} showBackButton backButtonLabel={t("back")} onBackClick={()=>nav("/vehicles")}/><Card><CardContent className="pt-6"><VehicleForm onSubmit={submit} submitting={mutation.isPending} error={mutation.error?normalizeApiError(mutation.error).message:undefined}/></CardContent></Card></div>}
