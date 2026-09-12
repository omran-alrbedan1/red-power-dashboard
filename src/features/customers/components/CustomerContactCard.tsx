import React from "react"
import { useTranslation } from "react-i18next"
import {
  CheckCircle2,
  Circle,
  Mail,
  Pencil,
  Phone,
  Power,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DetailItem from "@/components/shared/custom/DetailItem"

import type { Customer } from "../types/customer.types"

interface CustomerContactCardProps {
  customer: Customer
  onEdit: () => void
  onToggleStatus: () => void
}

export const CustomerContactCard: React.FC<
  CustomerContactCardProps
> = ({
  customer,
  onEdit,
  onToggleStatus,
}) => {
  const { t } = useTranslation("customers")

  const isActive = customer.isActive
  const StatusIcon = isActive
    ? CheckCircle2
    : Circle

  return (
    <section className="overflow-hidden rounded-2xl border border-border/60 bg-background-card shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-text-primary">
                {t("details", "Customer Details")}
              </h2>

              <Badge
                className={`
                  gap-1.5 text-[11px] font-medium
                  ${
                    isActive
                      ? "border border-primary/25 bg-primary/10 text-primary"
                      : "border border-border bg-background-secondary text-text-secondary"
                  }
                `}
              >
                <StatusIcon
                  className={
                    isActive
                      ? "h-3.5 w-3.5"
                      : "h-2.5 w-2.5 fill-current"
                  }
                />
                {t(
                  isActive
                    ? "status.active"
                    : "status.inactive",
                )}
              </Badge>
            </div>

            <p className="mt-0.5 text-xs text-text-muted">
              {t(
                "detailsSubtitle",
                "Customer contact information",
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-10 gap-2 rounded-xl px-4"
          >
            <Pencil className="h-4 w-4" />
            {t("actions.edit", "Edit")}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onToggleStatus}
            className={`
              h-10 gap-2 rounded-xl px-4
              ${
                isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            `}
          >
            <Power className="h-4 w-4" />
            {t(
              isActive
                ? "dialogs.deactivate.title"
                : "dialogs.activate.title",
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <DetailItem
          icon={Phone}
          label={t("fields.phone", "Phone number")}
          value={customer.phone}
          ltr
        />

        <DetailItem
          icon={Mail}
          label={t("fields.email", "Email address")}
          value={customer.email}
          ltr
        />
      </div>
    </section>
  )
}