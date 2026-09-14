import type { AppRole } from "@/features/auth/types/auth.types"

export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  role: AppRole
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export const getEmployeeFullName = (employee: Pick<Employee, "firstName" | "lastName" | "email">) =>
  [employee.firstName, employee.lastName].filter(Boolean).join(" ") || employee.email