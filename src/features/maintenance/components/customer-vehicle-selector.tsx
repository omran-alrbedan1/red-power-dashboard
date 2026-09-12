import { useTranslation } from "react-i18next"
import { Users, Car } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSelectorData } from "../hooks/useSelectorData"

export interface SelectorValue {
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehicleMake: string
  vehicleModel: string
  vehiclePlate: string
  vehicleYear?: number | ""
  vehicleVin?: string
  vehicleMileage?: number | ""
  customerId?: number
  vehicleId?: number
  vehicleOwnershipId?: number
}

interface CustomerVehicleSelectorProps {
  onSelect: (value: SelectorValue) => void
  onNewCustomer: () => void
}

export const CustomerVehicleSelector: React.FC<CustomerVehicleSelectorProps> = ({
  onSelect,
  onNewCustomer,
}) => {
  const { t } = useTranslation("maintenance")
  const selectorQuery = useSelectorData()
  const data = selectorQuery.data

  const customers = data?.customers ?? []
  const vehicles = data?.vehicles ?? []

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c) => c.id === Number(customerId))
    if (!customer) return
    onSelect({
      customerName: customer.name,
      customerPhone: customer.phone,
      customerId: customer.id,
      vehicleMake: "",
      vehicleModel: "",
      vehiclePlate: "",
      vehicleYear: "",
      customerEmail: undefined,
    })
  }

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === Number(vehicleId))
    if (!vehicle) return
    onSelect({
      customerId: vehicle.currentOwnership?.customerId,
      vehicleId: vehicle.id,
      vehicleOwnershipId: vehicle.currentOwnership?.id,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehiclePlate: vehicle.plateNumber,
      customerName: "",
      customerPhone: "",
      vehicleYear: vehicle.manufactureYear,
      vehicleVin: vehicle.vin,
    })
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Car className="h-4 w-4 text-primary" />
          {t("sections.customer")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Users className="h-3.5 w-3.5 text-primary" />
            {t("customer.select")}
          </label>
          <Select
            disabled={selectorQuery.isLoading}
            onValueChange={handleCustomerChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("customer.noSelection")} />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name} — {c.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Car className="h-3.5 w-3.5 text-primary" />
            {t("vehicle.select")}
          </label>
          <Select
            disabled={selectorQuery.isLoading}
            onValueChange={handleVehicleChange}
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
        </div>

        <div className="sm:col-span-2">
          <Button variant="link" size="sm" className="p-0 h-auto" onClick={onNewCustomer}>
            + {t("customer.create")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
