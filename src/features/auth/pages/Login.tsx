import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { LogIn, Mail, Lock, Wrench } from "lucide-react"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { loginFormSchema, LoginFormValues } from "@/features/auth/validation/auth.validation"
import { useAuth } from "@/features/auth/context/AuthContext"
import { ApiError } from "@/lib/api/client"
import { toast } from "sonner"
import LanguageSwitcher from "@/components/shared/buttons/LanguageSwitcher"
import { images } from '@/constants/images'

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { login } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      await login(data)
      navigate("/", { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : t("auth.loginError")
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col bg-background px-5 py-6 sm:px-8 md:w-1/2 md:py-8">
        {/* Mobile brand bar */}
        <div className="flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-[0_0_20px_rgba(225,6,19,0.3)]">
              <Wrench className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold leading-tight text-text-primary">
                Red Power
              </p>

              <p className="mt-0.5 text-[10px] text-text-muted">
                Red Power Garage
              </p>
            </div>
          </div>

          <LanguageSwitcher />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-8 md:py-0">
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-6">

              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                  Red Power Garage
                </p>

                <h2 className="text-xl font-semibold text-text-primary sm:text-2xl">
                  {t("auth.welcomeBack")}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {t("auth.loginSubtitle")}
                </p>
              </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <CustomFormField
                    fieldType={FormFieldType.EMAIL}
                    control={form.control}
                    name="email"
                    label={t("auth.email")}
                    placeholder={t("auth.emailPlaceholder")}
                    disabled={isLoading}
                    leftIcon={Mail}
                    iconPosition="left"
                    dir="ltr"
                  />
                </div>

                <div>
                  <CustomFormField
                    fieldType={FormFieldType.PASSWORD}
                    control={form.control}
                    name="password"
                    label={t("auth.password")}
                    placeholder={t("auth.passwordPlaceholder")}
                    disabled={isLoading}
                    leftIcon={Lock}
                    iconPosition="left"
                    dir="ltr"
                  />
                </div>

                <SubmitButton
                  isLoading={isLoading}
                  text={t("auth.login")}
                  loadingText={t("auth.loggingIn")}
                  icon={<LogIn className="h-4 w-4" />}
                />
              </form>
            </Form>
          </div>
          </div>
        </div>
      </div>

      {/* Desktop brand image panel */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={images.loginBackground}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
    </div>
  )
}

export default Login
