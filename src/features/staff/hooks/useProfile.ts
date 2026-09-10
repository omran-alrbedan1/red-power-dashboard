import { useMutation } from "@tanstack/react-query"
import { profileService } from "../services/profile.service"
export const useChangePassword = () => useMutation({ mutationFn: profileService.changePassword })
