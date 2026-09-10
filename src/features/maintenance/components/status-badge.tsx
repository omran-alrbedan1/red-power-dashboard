import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import type { MaintenanceStatus } from "../types/maintenance.types"

const STATUS_TONES: Record<MaintenanceStatus, string> = {
  OPEN: "bg-sky-500/15 text-sky-500",
  CLOSED: "bg-emerald-500/15 text-emerald-500",
}

export const MaintenanceStatusBadge: React.FC<{
  status: MaintenanceStatus
}> = ({ status }) => {
  const { t } = useTranslation("maintenance")
  return (
    <Badge className={STATUS_TONES[status]}>
      {t(`statuses.${status}`)}
    </Badge>
  )
}
