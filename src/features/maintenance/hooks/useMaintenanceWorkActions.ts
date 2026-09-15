import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { dashboardQueryKeys } from "@/features/dashboard/services/dashboard-query-keys"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export type WorkTargetStatus = "PENDING" | "IN_PROGRESS"

function useInvalidateCardWorkState() {
  const queryClient = useQueryClient()

  return (cardId: number) => {
    const id = String(cardId)
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(id) })
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.timeline(id) })
    void queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.workActivity(id) })
    void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats() })
  }
}

export function useStartWork() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateCardWorkState()

  return useMutation({
    mutationFn: ({ cardId, workItemId }: { cardId: number; workItemId: number }) =>
      maintenanceApi.startWork(cardId, workItemId),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("work.messages.started"))
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("errors.workStartFailed")),
  })
}

export function useCompleteWork() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateCardWorkState()

  return useMutation({
    mutationFn: ({ cardId, workItemId }: { cardId: number; workItemId: number }) =>
      maintenanceApi.completeWork(cardId, workItemId),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("work.messages.completed"))
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("errors.workCompleteFailed")),
  })
}

export function useCancelWork() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateCardWorkState()

  return useMutation({
    mutationFn: ({ cardId, workItemId, reason }: { cardId: number; workItemId: number; reason: string }) =>
      maintenanceApi.cancelWork(cardId, workItemId, reason),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("work.messages.cancelled"))
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("errors.workCancelFailed")),
  })
}

export function useReopenWork() {
  const { t } = useTranslation("maintenance")
  const invalidate = useInvalidateCardWorkState()

  return useMutation({
    mutationFn: ({ cardId, workItemId, reason, targetStatus }: { cardId: number; workItemId: number; reason: string; targetStatus?: WorkTargetStatus }) =>
      maintenanceApi.reopenWork(cardId, workItemId, { reason, targetStatus }),
    onSuccess: (_data, variables) => {
      invalidate(variables.cardId)
      toast.success(t("work.messages.reopened"))
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : t("errors.workReopenFailed")),
  })
}