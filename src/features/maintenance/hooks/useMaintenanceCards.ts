import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  maintenanceApi,
  type CreateMaintenanceCardInput,
  type MaintenanceCardListParams,
} from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"

const STALE_TIME = 30 * 1000
const GC_TIME = 5 * 60 * 1000

export function useMaintenanceCards(params: MaintenanceCardListParams) {
  const { page, limit, search, status, receivedFrom, receivedTo, customerId, vehicleId } = params
  return useQuery({
    queryKey: [
      ...maintenanceQueryKeys.list(),
      { page, limit, search, status, receivedFrom, receivedTo, customerId, vehicleId },
    ],
    queryFn: () =>
      maintenanceApi.list({ page, limit, search, status, receivedFrom, receivedTo, customerId, vehicleId }),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useCreateMaintenanceCard() {
  const { t } = useTranslation("maintenance")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMaintenanceCardInput) => maintenanceApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.selectorData() })
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
      toast.success(t("messages.cardCreated", "Card created successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.createFailed", "Failed to create the card"))
    },
  })
}