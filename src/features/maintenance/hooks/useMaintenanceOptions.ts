import { useQuery } from "@tanstack/react-query"
import { maintenanceApi } from "../services/maintenance-api.service"

export function useMaintenanceOptions(kind: "visit-reasons" | "vehicle-conditions" | "vehicle-items") {
  return useQuery({ queryKey: ["maintenance-options", kind], queryFn: () => maintenanceApi.options(kind) })
}
