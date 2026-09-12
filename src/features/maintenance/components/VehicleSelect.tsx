import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelectorData } from "../hooks/useSelectorData"

export interface VehicleSelectSelection {
  vehicleId: number
  ownershipId: number
  make: string
  model: string
  plateNumber: string
  manufactureYear?: number
  vin?: string
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
  const selectorQuery = useSelectorData()
  const vehicles = selectorQuery.data?.vehicles ?? []

  const handleChange = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === Number(vehicleId))
    if (!vehicle) return
    onChange({
      vehicleId: vehicle.id,
      ownershipId: vehicle.currentOwnership?.id as number,
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      manufactureYear: vehicle.manufactureYear,
      vin: vehicle.vin,
    })
  }

  return (
    <Select
      disabled={selectorQuery.isLoading}
      value={value ? String(value) : undefined}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("vehicle.noSelection")} />
      </SelectTrigger>
      <SelectContent>
        {vehicles.map((v) => (
          <SelectItem key={v.id} value={String(v.id)}>
            {v.make} {v.model} ({v.plateNumber})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}