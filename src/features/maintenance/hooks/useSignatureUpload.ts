import { useMutation, useQueryClient } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"
import { maintenanceQueryKeys } from "../services/maintenance-query-keys"

export function useSignatureUpload() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, file }: { cardId: number; file: File }) =>
      maintenanceApi.uploadSignature(cardId, file),
    onSuccess: (data) => {
      // Only invalidate on success - card remains available on failure
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: maintenanceQueryKeys.list() })
    },
  })
}
