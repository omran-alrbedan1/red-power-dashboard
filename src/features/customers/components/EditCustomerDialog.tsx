import React from "react"
import { useTranslation } from "react-i18next"
import { Pencil } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CustomerForm } from "./CustomerForm"

import type { Customer } from "../types/customer.types"
import type { CustomerFormValues } from "../validation/customer.validation"

interface EditCustomerDialogProps {
  open: boolean
  customer: Customer
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CustomerFormValues) => void
  isSubmitting?: boolean
}

export const EditCustomerDialog: React.FC<EditCustomerDialogProps> = ({
  open,
  customer,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const { t } = useTranslation("customers")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 rtl:text-start">
            <div className="rounded-xl bg-primary p-2.5">
              <Pencil className="h-5 w-5 text-white" />
            </div>

            <div>
              <DialogTitle>
                {t("editCustomer", "Edit Customer")}
              </DialogTitle>

              <DialogDescription>
                {t(
                  "editCustomerDescription",
                  "Update the customer's contact information.",
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <CustomerForm
          key={customer.id}
          defaultValues={{
            name: customer.name,
            phone: customer.phone,
            email: customer.email ?? "",
          }}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitLabel={t("editCustomer", "Edit Customer")}
          submitIcon={<Pencil className="h-4 w-4" />}
        />
      </DialogContent>
    </Dialog>
  )
}