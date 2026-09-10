import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import ErrorState from "@/components/shared/states/ErrorState"
import { normalizeApiError } from "@/lib/api/api-error"
import { VehicleForm } from "../components/vehicle-form"
import { useUpdateVehicle, useVehicle } from "../hooks/useVehicles"
import type { VehicleFormValues } from "../validation/vehicle.validation"

export default function VehicleEditPage(){const {t}=useTranslation("vehicles");const {vehicleId}=useParams<{vehicleId:string}>();const nav=useNavigate();const query=useVehicle(vehicleId);const mutation=useUpdateVehicle();if(query.isError)return <ErrorState title={t("loadError")} description={query.error.message} retry={()=>void query.refetch()}/>;if(!query.data||!vehicleId)return <div className="h-80 animate-pulse rounded-xl bg-muted/40"/>;const v=query.data;const submit=(x:VehicleFormValues)=>mutation.mutate({id:vehicleId,input:{make:x.make,model:x.model,manufactureYear:x.manufactureYear,plateNumber:x.plateNumber,vin:x.vin||undefined,color:x.color||undefined,transmission:x.transmission}},{onSuccess:()=>nav(`/vehicles/${vehicleId}`,{replace:true})});return <div className="flex flex-col gap-4"><PageHeader title={t("edit")} description={`${v.make} ${v.model}`} showBackButton backButtonLabel={t("back")} onBackClick={()=>nav(`/vehicles/${vehicleId}`)}/><Card><CardContent className="pt-6"><VehicleForm edit defaultValues={{make:v.make,model:v.model,manufactureYear:v.manufactureYear,plateNumber:v.plateNumber,vin:v.vin??"",color:v.color??"",transmission:v.transmission}} onSubmit={submit} submitting={mutation.isPending} error={mutation.error?normalizeApiError(mutation.error).message:undefined}/></CardContent></Card></div>}
