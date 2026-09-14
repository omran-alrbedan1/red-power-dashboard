import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { ApiError, isErrorType } from "@/lib/api/api-error"
import { maintenanceOptionService } from "../services/maintenance-option.service"
import { maintenanceOptionKeys } from "../services/maintenance-option-query-keys"
import type { MaintenanceOptionFilterValues } from "../configs/maintenance-option-filter.config"
import type {
  CreateMaintenanceOptionInput,
  MaintenanceOptionKind,
  UpdateMaintenanceOptionInput,
} from "../types/maintenance-option.types"

const STALE_TIME = 2 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function useInvalidateKind(kind: MaintenanceOptionKind) {
  const queryClient = useQueryClient()
  return () =>
    queryClient.invalidateQueries({
      queryKey: maintenanceOptionKeys.withKind(kind),
    })
}

function domainMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof ApiError) return error.message
  return fallback
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export function useMaintenanceOptions(
  kind: MaintenanceOptionKind,
  page: number,
  limit: number,
  filters?: MaintenanceOptionFilterValues,
) {
  const search = filters?.search.trim() || undefined
  const isActive =
    filters?.status === "active"
      ? true
      : filters?.status === "inactive"
        ? false
        : undefined

  return useQuery({
    queryKey: maintenanceOptionKeys.list(kind, page, limit, search, isActive),
    queryFn: () => maintenanceOptionService.list(kind, { page, limit, search, isActive }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
  })
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export function useCreateMaintenanceOption(kind: MaintenanceOptionKind) {
  const { t } = useTranslation("maintenance-options")
  const invalidate = useInvalidateKind(kind)

  return useMutation({
    mutationFn: (input: CreateMaintenanceOptionInput) =>
      maintenanceOptionService.create(kind, input),
    onSuccess: () => {
      invalidate()
      toast.success(t("messages.created", "Option created successfully"))
    },
    onError: (error) => {
      toast.error(
        domainMessage(error, t("errors.createFailed", "Failed to create option")),
      )
    },
  })
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export function useUpdateMaintenanceOption(kind: MaintenanceOptionKind) {
  const { t } = useTranslation("maintenance-options")
  const invalidate = useInvalidateKind(kind)

  return useMutation({
    mutationFn: ({ id, ...input }: { id: number } & UpdateMaintenanceOptionInput) =>
      maintenanceOptionService.update(kind, id, input),
    onSuccess: () => {
      invalidate()
      toast.success(t("messages.updated", "Option updated successfully"))
    },
    onError: (error) => {
      toast.error(
        domainMessage(error, t("errors.updateFailed", "Failed to update option")),
      )
    },
  })
}

// ---------------------------------------------------------------------------
// Activate / Deactivate (single mutation, same endpoint shape)
// ---------------------------------------------------------------------------

export function useToggleMaintenanceOptionStatus(kind: MaintenanceOptionKind) {
  const { t } = useTranslation("maintenance-options")
  const invalidate = useInvalidateKind(kind)

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      isActive
        ? maintenanceOptionService.activate(kind, id)
        : maintenanceOptionService.deactivate(kind, id),
    onSuccess: (_data, variables) => {
      invalidate()
      toast.success(
        t(variables.isActive ? "messages.activated" : "messages.deactivated"),
      )
    },
    onError: (error, variables) => {
      toast.error(
        domainMessage(
          error,
          t(variables.isActive ? "errors.activateFailed" : "errors.deactivateFailed"),
        ),
      )
    },
  })
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export function useDeleteMaintenanceOption(kind: MaintenanceOptionKind) {
  const { t } = useTranslation("maintenance-options")
  const invalidate = useInvalidateKind(kind)

  return useMutation({
    mutationFn: (id: number) => maintenanceOptionService.remove(kind, id),
    onSuccess: () => {
      invalidate()
      toast.success(t("messages.deleted", "Option deleted successfully"))
    },
    onError: (error) => {
      if (error instanceof ApiError && isErrorType(error, "conflict")) {
        toast.error(
          t(
            "errors.deleteUsed",
            "This option cannot be deleted because it is already used by maintenance cards.",
          ),
        )
      } else {
        toast.error(
          domainMessage(error, t("errors.deleteFailed", "Failed to delete option")),
        )
      }
    },
  })
}