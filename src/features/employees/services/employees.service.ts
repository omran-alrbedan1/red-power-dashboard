import { apiRequest } from "@/lib/api/client"
import { cleanParams } from "@/lib/api/params"
import type { ApiPaginated } from "@/lib/api/contracts"
import type { Employee } from "../types/employee.types"

export interface EmployeeListParams {
  page: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface CreateEmployeeInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const employeesService = {
  list: (params: EmployeeListParams) =>
    apiRequest<ApiPaginated<Employee>>({
      url: "/users",
      params: cleanParams({ ...params }),
    }),

  create: (input: CreateEmployeeInput) =>
    apiRequest<Employee>({
      method: "POST",
      url: "/users",
      data: input,
    }),

  activate: (id: number) =>
    apiRequest<Employee>({
      method: "PATCH",
      url: `/users/${id}/activate`,
    }),

  deactivate: (id: number) =>
    apiRequest<Employee>({
      method: "PATCH",
      url: `/users/${id}/deactivate`,
    }),
}