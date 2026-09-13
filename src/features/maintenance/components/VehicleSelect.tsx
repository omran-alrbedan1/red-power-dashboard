import { useTranslation } from "react-i18next"
import { RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSelectorData } from "../hooks/useSelectorData"

export interface VehicleSelectSelection {
  vehicleId: number
  ownershipId: number
  make: string
  model: string
  plateNumber: string
  manufactureYear?: number
  vin?: string
  ownerCustomerId?: number
  ownerCustomer?: { id: number; name: string; phone: string; email?: string }
}

interface VehicleSelectProps {
  value?: number | null
  onChange: (selection: VehicleSelectSelection | null) => void
}

export const VehicleSelect: React.FC<VehicleSelectProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const selectorQuery = useSelectorData()
  const vehicles = selectorQuery.data?.vehicles ?? []
  const customers = selectorQuery.data?.customers ?? []

  const handleChange = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === Number(vehicleId))
    if (!vehicle) return
    const ownership = vehicle.currentOwnership
    const ownerCustomer = ownership
      ? customers.find((c) => c.id === ownership.customerId)
      : undefined
    onChange({
      vehicleId: vehicle.id,
      ownershipId: ownership?.id as number,
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      manufactureYear: vehicle.manufactureYear,
      vin: vehicle.vin,
      ownerCustomerId: ownership?.customerId,
      ownerCustomer,
    })
  }

  return (
    <div className="space-y-2">
      <Select
        disabled={selectorQuery.isLoading}
        value={value ? String(value) : undefined}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={t(selectorQuery.isLoading ? "vehicle.loading" : "vehicle.noSelection")}
          />
        </SelectTrigger>
        <SelectContent>
          {vehicles.length === 0 &&
            !selectorQuery.isLoading &&
            !selectorQuery.isError && (
              <div className="px-2 py-4 text-center text-xs text-text-muted">
                {t("vehicle.empty")}
              </div>
            )}
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={String(vehicle.id)}>
              {vehicle.make} {vehicle.model} ({vehicle.plateNumber})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectorQuery.isError && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <p className="text-xs font-medium text-primary">{t("vehicle.selectError")}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => selectorQuery.refetch()}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {tCommon("common.retry")}
          </Button>
        </div>
      )}
    </div>
  )
}