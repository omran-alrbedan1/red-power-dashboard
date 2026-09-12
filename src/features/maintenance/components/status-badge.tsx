import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import type { MaintenanceCardStatus } from "../types/maintenance-detail.types"

const STATUS_TONES: Record<MaintenanceCardStatus, string> = {
  open: "bg-sky-500/15 text-sky-400",
  closed: "bg-green-500/15 text-green-500",
}

export const MaintenanceStatusBadge: React.FC<{
  status: MaintenanceCardStatus
}> = ({ status }) => {
  const { t } = useTranslation("maintenance")
  return (
    <Badge className={STATUS_TONES[status]}>
      {t(`statuses.${status}`)}
    </Badge>
  )
}