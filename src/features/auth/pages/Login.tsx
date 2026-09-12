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
import LanguageSwitcher from "@/components/shared/buttons/language-switcher"

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
      form.setError("root", { message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background md:flex-row">
      {/* Left Panel: Form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="mx-auto mb-4 flex flex-col items-center gap-3">
              <img
                src="/images/red-power/brand/red-power-logo.png"
                alt="Red Power Garage"
                className="h-auto w-48 object-contain"
              />
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

      {/* Left-side desktop brand image panel */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/red-power/brand/og-share-background-og.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/65 to-background/95" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-12 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary shadow-[0_0_42px_rgba(225,6,19,0.35)]">
            <Wrench className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white">Red Power Garage</h2>
          <p className="max-w-sm text-lg text-zinc-200">
            لوحة تحكم إدارة ورشة Red Power
          </p>
          <div className="mt-4 border-t border-white/20 pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
