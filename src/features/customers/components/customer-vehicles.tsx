import { useTranslation } from "react-i18next"
import { Car, Plus, CalendarDays, Palette, Settings2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Vehicle, TransmissionType } from "../types/vehicle.types"

const TRANSMISSION_KEYS: Record<TransmissionType, string> = {
  automatic: "vehicles.transmissionTypes.automatic",
  manual: "vehicles.transmissionTypes.manual",
}

interface CustomerVehiclesProps {
  vehicles: Vehicle[]
  onAddClick: () => void
}

const DetailItem: React.FC<{
  icon: React.ElementType
  label: string
  value?: string
}> = ({ icon: Icon, label, value }) => {
  if (!value) return null
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span>{label}:</span>
      <span className="text-text-primary">{value}</span>
    </div>
  )
}

export const CustomerVehicles: React.FC<CustomerVehiclesProps> = ({
  vehicles,
  onAddClick,
}) => {
  const { t } = useTranslation("customers")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg text-text-primary">
          {t("vehicles.title")}
        </CardTitle>
        <Button onClick={onAddClick} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          {t("vehicles.addVehicle")}
        </Button>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("vehicles.noVehicles")}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-border/60 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {vehicle.plateNumber}
                        </p>
                      </div>
                    </div>
                    {vehicle.vin && (
                      <Badge variant="outline" className="text-[10px]">
                        {vehicle.vin.slice(0, 8)}…
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    <DetailItem
                      icon={CalendarDays}
                      label={t("vehicles.fields.year")}
                      value={String(vehicle.manufactureYear)}
                    />
                    <DetailItem
                      icon={Palette}
                      label={t("vehicles.fields.color")}
                      value={vehicle.color}
                    />
                    {vehicle.transmission && (
                      <DetailItem
                        icon={Settings2}
                        label={t("vehicles.fields.transmissionType")}
                        value={t(TRANSMISSION_KEYS[vehicle.transmission])}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
