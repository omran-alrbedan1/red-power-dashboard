import { useTranslation } from "react-i18next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSelectorData } from "../hooks/useSelectorData"

interface CustomerSelectProps {
  value?: number | null
  onChange: (customerId: number | null) => void
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation("maintenance")
  const selectorQuery = useSelectorData()
  const customers = selectorQuery.data?.customers ?? []

  return (
    <Select
      disabled={selectorQuery.isLoading}
      value={value ? String(value) : undefined}
      onValueChange={(v) => onChange(Number(v))}
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
  )
}