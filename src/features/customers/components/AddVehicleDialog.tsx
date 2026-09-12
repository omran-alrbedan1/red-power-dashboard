import { useTranslation } from "react-i18next"
import { CarFront } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { VehicleForm } from "./VehicleForm"

import type { VehicleFormValues } from "../validation/customer.validation"

interface AddVehicleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: VehicleFormValues) => void
  isSubmitting?: boolean
}

export const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const { t } = useTranslation("customers")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 rtl:text-start">
            <div className="rounded-xl bg-primary p-2.5">
              <CarFront className="h-5 w-5 text-white" />
            </div>

            <div>
              <DialogTitle>
                {t("vehicles.addVehicle", "Add Vehicle")}
              </DialogTitle>

              <DialogDescription>
                {t(
                  "vehicles.addDescription",
                  "Add a vehicle to this customer.",
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <VehicleForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel={t("vehicles.addVehicle", "Add Vehicle")}
        />
      </DialogContent>
    </Dialog>
  )
}