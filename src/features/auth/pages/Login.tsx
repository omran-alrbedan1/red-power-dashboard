import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Form } from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "@/components/shared/inputs/CustomFormField"
import { LogIn, Mail, Lock } from "lucide-react"
import { SubmitButton } from "@/components/shared/buttons/SubmitButton"
import { loginFormSchema, LoginFormValues } from "@/features/auth/validation/auth.validation"
import { useAuth } from "@/features/auth/context/AuthContext"
import LanguageSwitcher from "@/components/shared/buttons/language-switcher"
import { RedPowerLogo } from "@/components/brand/RedPowerLogo"
import { normalizeApiError } from "@/lib/api/api-error"

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
    } catch (error) {
      form.setError("root", {
        message: normalizeApiError(error).message || t("auth.loginError"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rp-grid-surface relative flex min-h-screen w-full flex-col overflow-hidden bg-background md:flex-row">
      <div className="pointer-events-none absolute -start-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      {/* Left Panel: Form */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-6 sm:p-8 md:w-1/2">
        <div className="w-full max-w-md rounded-2xl border border-border/80 bg-background-card/75 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="mx-auto mb-4 flex flex-col items-center gap-3">
              <RedPowerLogo className="h-24 w-64" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                {t("auth.welcomeBack")}
              </h2>
              <p className="text-sm text-text-secondary">
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

                {form.formState.errors.root && (
                  <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-center text-sm text-red-200">
                    {form.formState.errors.root.message}
                  </div>
                )}

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

      {/* Right Panel: Brand image */}
      <div className="relative hidden w-1/2 md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={null}
            alt="Red Power Garage"
            className="h-screen w-full object-cover opacity-10"
            style={{ display: 'none' }}
          />
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 border-s border-border/70 bg-[radial-gradient(circle_at_center,rgba(225,6,19,0.12),transparent_48%)] p-12">
          <RedPowerLogo className="h-40 w-full max-w-md" />
          <h2 className="text-4xl font-bold text-text-primary">Red Power Garage</h2>
          <p className="max-w-sm text-center text-lg text-text-secondary">
            لوحة تحكم إدارة ورشة Red Power
          </p>
          <div className="mt-4 border-t border-border pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
