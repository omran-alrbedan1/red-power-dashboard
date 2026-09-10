import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { normalizeApiError } from "@/lib/api/api-error"
import { CustomerVehicleSelector, type SelectorValue } from "../components/customer-vehicle-selector"
import { useCreateMaintenanceCard, useMaintenanceOptions } from "../hooks/useMaintenanceCards"
import { FUEL_LEVELS, type FuelLevel, type MaintenanceOption } from "../types/maintenance.types"

function OptionPicker({ title, options, selected, onChange }: { title: string; options: MaintenanceOption[]; selected: string[]; onChange: (ids: string[]) => void }) {
  return <fieldset className="space-y-2"><legend className="text-sm font-medium">{title}</legend><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{options.map(option => <label key={option.id} className="flex items-center gap-2 rounded-md border p-3 text-sm"><input type="checkbox" checked={selected.includes(option.id)} onChange={e => onChange(e.target.checked ? [...selected, option.id] : selected.filter(id => id !== option.id))}/>{option.label}</label>)}</div></fieldset>
}

export default function ReceiptCreatePage() {
  const { t } = useTranslation("maintenance")
  const navigate = useNavigate()
  const mutation = useCreateMaintenanceCard()
  const reasons = useMaintenanceOptions("visit-reasons")
  const conditions = useMaintenanceOptions("vehicle-conditions")
  const items = useMaintenanceOptions("vehicle-items")
  const [selection, setSelection] = useState<SelectorValue | null>(null)
  const [mileage, setMileage] = useState("")
  const [fuelLevel, setFuelLevel] = useState<FuelLevel | "">("")
  const [receivedAt, setReceivedAt] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16))
  const [expectedDeliveryAt, setExpectedDeliveryAt] = useState("")
  const [complaint, setComplaint] = useState("")
  const [notes, setNotes] = useState("")
  const [reasonIds, setReasonIds] = useState<string[]>([])
  const [conditionIds, setConditionIds] = useState<string[]>([])
  const [itemIds, setItemIds] = useState<string[]>([])
  const [approved, setApproved] = useState(false)
  const [approvalName, setApprovalName] = useState("")
  const [approvedAt, setApprovedAt] = useState("")
  const [error, setError] = useState("")
  const optionsError = reasons.isError || conditions.isError || items.isError

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("")
    if (!selection?.customerId || !selection.vehicleOwnershipId || !mileage || !fuelLevel) { setError(t("validation.liveRequired")); return }
    if (approved && (!approvalName.trim() || !approvedAt)) { setError(t("validation.approvalRequired")); return }
    try {
      const card = await mutation.mutateAsync({ customerId: selection.customerId, vehicleOwnershipId: selection.vehicleOwnershipId, receivedAt: new Date(receivedAt).toISOString(), ...(expectedDeliveryAt && { expectedDeliveryAt: new Date(expectedDeliveryAt).toISOString() }), mileage: Number(mileage), fuelLevel, customerComplaint: complaint.trim() || undefined, inspectionNotes: notes.trim() || undefined, customerApproved: approved, ...(approved && { customerApprovalName: approvalName.trim(), customerApprovedAt: new Date(approvedAt).toISOString() }), visitReasonIds: reasonIds, vehicleConditionOptionIds: conditionIds, vehicleItemOptionIds: itemIds })
      navigate(`/maintenance/${card.id}`, { replace: true })
    } catch (cause) { setError(normalizeApiError(cause).message) }
  }

  return <div className="flex flex-col gap-4"><PageHeader title={t("newCard")} description={t("create.backendNumber")} showBackButton backButtonLabel={t("backToList")}/>
    <CustomerVehicleSelector onSelect={setSelection} onNewCustomer={() => navigate("/customers/new")}/>
    <form onSubmit={submit} className="space-y-4">
      <Card><CardHeader><CardTitle>{t("create.reception")}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1"><span>{t("vehicle.mileage")} *</span><Input type="number" min={0} step={1} value={mileage} onChange={e => setMileage(e.target.value)}/></label>
        <label className="space-y-1"><span>{t("condition.fuelLevel")} *</span><Select value={fuelLevel} onValueChange={v => setFuelLevel(v as FuelLevel)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{FUEL_LEVELS.map(level => <SelectItem key={level} value={level}>{t(`fuelLevels.${level}`)}</SelectItem>)}</SelectContent></Select></label>
        <label className="space-y-1"><span>{t("create.receivedAt")} *</span><Input type="datetime-local" value={receivedAt} onChange={e => setReceivedAt(e.target.value)}/></label>
        <label className="space-y-1"><span>{t("approval.deliveryDate")}</span><Input type="datetime-local" value={expectedDeliveryAt} onChange={e => setExpectedDeliveryAt(e.target.value)}/></label>
        <label className="space-y-1 sm:col-span-2"><span>{t("reason.complaint")}</span><Textarea value={complaint} onChange={e => setComplaint(e.target.value)}/></label>
        <label className="space-y-1 sm:col-span-2"><span>{t("condition.otherNotes")}</span><Textarea value={notes} onChange={e => setNotes(e.target.value)}/></label>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>{t("create.options")}</CardTitle></CardHeader><CardContent className="space-y-5">{optionsError && <p className="text-sm text-destructive">{t("errors.options")}</p>}<OptionPicker title={t("reason.title")} options={reasons.data ?? []} selected={reasonIds} onChange={setReasonIds}/><OptionPicker title={t("sections.condition")} options={conditions.data ?? []} selected={conditionIds} onChange={setConditionIds}/><OptionPicker title={t("sections.itemsLeft")} options={items.data ?? []} selected={itemIds} onChange={setItemIds}/></CardContent></Card>
      <Card><CardHeader><CardTitle>{t("sections.approval")}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><label className="flex items-center gap-2"><input type="checkbox" checked={approved} onChange={e => setApproved(e.target.checked)}/>{t("approval.approved")}</label>{approved && <><label className="space-y-1"><span>{t("approval.name")}</span><Input value={approvalName} onChange={e => setApprovalName(e.target.value)}/></label><label className="space-y-1"><span>{t("approval.date")}</span><Input type="datetime-local" value={approvedAt} onChange={e => setApprovedAt(e.target.value)}/></label></>}</CardContent></Card>
      {error && <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={mutation.isPending || optionsError}>{mutation.isPending ? t("saving") : t("save")}</Button>
    </form>
  </div>
}
