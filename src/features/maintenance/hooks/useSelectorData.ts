import { useCustomers } from "@/features/customers"
import { useVehicles } from "@/features/vehicles"

export function useSelectorData() {
  const customersQuery = useCustomers({ page: 1, limit: 100, isActive: true })
  const vehiclesQuery = useVehicles({ page: 1, limit: 100, isActive: true })
  return {
    data: {
      customers: customersQuery.data?.items ?? [],
      vehicles: (vehiclesQuery.data?.items ?? []).filter((vehicle) => vehicle.currentOwnership).map((vehicle) => ({
        id: vehicle.id,
        customerId: vehicle.currentOwnership?.customer.id ?? "",
        vehicleOwnershipId: vehicle.currentOwnership?.id ?? "",
        make: vehicle.make,
        model: vehicle.model,
        plateNumber: vehicle.plateNumber,
        manufactureYear: vehicle.manufactureYear,
        vin: vehicle.vin,
        transmission: vehicle.transmission,
      })),
    },
    isLoading: customersQuery.isLoading || vehiclesQuery.isLoading,
    isError: customersQuery.isError || vehiclesQuery.isError,
  }
}
