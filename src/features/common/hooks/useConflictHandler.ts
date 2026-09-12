import { useQueryClient } from "@tanstack/react-query"
import { ApiError, isErrorType } from "@/lib/api/api-error"

interface UseConflictHandlerOptions {
  onSuccess?: () => void
  onConflict?: (message: string) => void
  queryKeysToInvalidate?: unknown[][]
}

export function useConflictHandler(options: UseConflictHandlerOptions = {}) {
  const queryClient = useQueryClient()

  const handleConflict = (error: unknown) => {
    if (error instanceof ApiError && isErrorType(error, 'conflict')) {
      const message = error.message || "هذا العنصر تم تعديله من قبل مستخدم آخر. يرجى تحديث البيانات والمحاولة مرة أخرى."
      
      // Show conflict message
      if (options.onConflict) {
        options.onConflict(message)
      }

      // Refresh affected queries
      if (options.queryKeysToInvalidate) {
        options.queryKeysToInvalidate.forEach(key => {
          queryClient.invalidateQueries({ queryKey: key })
        })
      }

      return true
    }
    return false
  }

  return { handleConflict }
}
