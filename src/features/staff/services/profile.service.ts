import { API_ENDPOINTS } from "@/lib/api/api.endpoints"
import { httpClient } from "@/lib/api/http-client"
export const profileService = { async changePassword(input: { currentPassword: string; newPassword: string }) { await httpClient.patch(API_ENDPOINTS.users.password, input) } }
