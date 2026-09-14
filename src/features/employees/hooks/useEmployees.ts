import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  employeesService,
  type CreateEmployeeInput,
} from "../services/employees.service"
import { employeeQueryKeys } from "../services/employee-query-keys"
import type { EmployeeFilterValues } from "../configs/employee-filter.config"

const STALE_TIME = 5 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

export function useEmployees(
  page: number,
  limit: number,
  filters?: EmployeeFilterValues,
) {
  const search = filters?.search.trim() || undefined
  const isActive =
    filters?.status === "active"
      ? true
      : filters?.status === "inactive"
        ? false
        : undefined

  return useQuery({
    queryKey: employeeQueryKeys.list(page, limit, search, isActive),
    queryFn: () => employeesService.list({ page, limit, search, isActive }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  })
}

export function useCreateEmployee() {
  const { t } = useTranslation("employees")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => employeesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all })
      toast.success(t("messages.created", "Employee created successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.createFailed", "Failed to create employee"))
    },
  })
}

export function useActivateEmployee() {
  const { t } = useTranslation("employees")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => employeesService.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all })
      toast.success(t("messages.activated", "Employee activated successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.activateFailed", "Failed to activate employee"))
    },
  })
}

export function useDeactivateEmployee() {
  const { t } = useTranslation("employees")
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => employeesService.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all })
      toast.success(t("messages.deactivated", "Employee deactivated successfully"))
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : t("errors.deactivateFailed", "Failed to deactivate employee"))
    },
  })
}