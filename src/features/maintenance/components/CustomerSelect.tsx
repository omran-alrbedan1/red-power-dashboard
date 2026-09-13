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

export interface SelectorCustomer {
  id: number
  name: string
  phone: string
  email?: string
}

interface CustomerSelectProps {
  value?: number | null
  onChange: (customerId: number | null) => void
  onSelectCustomer?: (customer: SelectorCustomer) => void
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  value,
  onChange,
  onSelectCustomer,
}) => {
  const { t } = useTranslation("maintenance")
  const { t: tCommon } = useTranslation("common")
  const selectorQuery = useSelectorData()
  const customers = selectorQuery.data?.customers ?? []

  const handleChange = (customerId: string) => {
    const id = Number(customerId)
    onChange(id)
    const customer = customers.find((c) => c.id === id)
    if (customer) onSelectCustomer?.(customer)
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
            placeholder={t(selectorQuery.isLoading ? "customer.loading" : "customer.noSelection")}
          />
        </SelectTrigger>
        <SelectContent>
          {customers.length === 0 &&
            !selectorQuery.isLoading &&
            !selectorQuery.isError && (
              <div className="px-2 py-4 text-center text-xs text-text-muted">
                {t("customer.empty")}
              </div>
            )}
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={String(customer.id)}>
              {customer.name} — {customer.phone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectorQuery.isError && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
          <p className="text-xs font-medium text-primary">{t("customer.selectError")}</p>
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