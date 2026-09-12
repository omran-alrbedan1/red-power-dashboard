import { useQuery } from "@tanstack/react-query"
import { maintenanceService } from "../services/maintenance.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import type { StatusEvent } from "../types/activity.types"

export function useActivityTimeline(cardId: string | undefined) {
  const id = cardId ?? ""
  return useQuery({
    queryKey: maintenanceQueryKeys.timeline(id),
    queryFn: async () => {
      const card = await maintenanceService.getById(id)
      // Use server-provided statusEvents if available, otherwise fall back to activityEvents
      return (card?.statusEvents as StatusEvent[] | undefined) ?? card?.activityEvents ?? []
    },
    enabled: Boolean(id),
  })
}
