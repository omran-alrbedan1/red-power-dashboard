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
import { useCustomerVehicles } from "../hooks/useCustomerVehicles"

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
  customerId?: number | null
}

export const VehicleSelect: React.FC<VehicleSelectProps> = ({
  value,
  onChange,
  customerId,
}) => {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const selectorQuery = useSelectorData()
  const customerVehiclesQuery = useCustomerVehicles(customerId)
  const customers = selectorQuery.data?.customers ?? []
  const vehicles =
    customerId != null
      ? (customerVehiclesQuery.data ?? [])
      : (selectorQuery.data?.vehicles ?? [])

  const isLoading = selectorQuery.isLoading || (customerId != null && customerVehiclesQuery.isLoading)
  const hasError =
    selectorQuery.isError || (customerId != null && customerVehiclesQuery.isError)

  const refetch = () => {
    if (customerId != null) {
      void customerVehiclesQuery.refetch()
    } else {
      void selectorQuery.refetch()
    }
  }

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
        disabled={isLoading}
        value={value ? String(value) : undefined}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={t(isLoading ? "vehicle.loading" : "vehicle.noSelection")}
          />
        </SelectTrigger>
        <SelectContent>
          {vehicles.length === 0 &&
            !isLoading &&
            !hasError && (
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
      {hasError && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <p className="text-xs font-medium text-primary">{t("vehicle.selectError")}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={refetch}
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