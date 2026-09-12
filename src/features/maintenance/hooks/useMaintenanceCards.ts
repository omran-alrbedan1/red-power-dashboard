import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  maintenanceApi,
  type CreateMaintenanceCardInput,
  type MaintenanceCardListParams,
} from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

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
  })
}

export function useCreateMaintenanceCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMaintenanceCardInput) => maintenanceApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: ["history"] })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.selectorData() })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.dashboardStats() })
    },
  })
}