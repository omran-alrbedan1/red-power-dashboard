import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"
import { maintenanceApi, type CreateWorkItemInput, type UpdateWorkItemInput } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

function useInvalidateMaintenanceCard() {
  const queryClient = useQueryClient()

  return (cardId: number) => {
    const id = String(cardId)
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(id) })
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.workActivity(id) })
    void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
  }
}

export function useCreateWorkItem() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateMaintenanceCard()

  return useMutation({
    mutationFn: (input: CreateWorkItemInput) => maintenanceApi.createWorkItem(input),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("messages.workCreated"))
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("errors.workCreateFailed")),
  })
}

export function useUpdateWorkItem() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateMaintenanceCard()

  return useMutation({
    mutationFn: ({ workItemId, input }: { workItemId: number; input: UpdateWorkItemInput }) => maintenanceApi.updateWorkItem(workItemId, input),
    onSuccess: (_data, variables) => {
      invalidate(variables.input.cardId)
      toast.success(t("messages.workUpdated"))
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("errors.workUpdateFailed")),
  })
}

export function useDeleteWorkItem() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateMaintenanceCard()

  return useMutation({
    mutationFn: ({ cardId, workItemId }: { cardId: number; workItemId: number }) => maintenanceApi.deleteWorkItem(cardId, workItemId),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("messages.workDeleted"))
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : t("errors.workDeleteFailed")),
  })
}
