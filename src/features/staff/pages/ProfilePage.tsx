import { useTranslation } from "react-i18next"
import { UserCircle, Mail, Shield, Briefcase } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/features/auth/context/AuthContext"

interface DetailRowProps {
  icon: React.ElementType
  label: string
  value: string
}

const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-background-secondary p-3">
    <div className="grid h-10 w-10 place-content-center rounded-lg bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  </div>
)

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  const roleLabel =
    user?.role === "super_admin"
      ? "Super Admin"
      : user?.role === "admin"
      ? "Admin"
      : "-"

  const name = user?.name || "-"

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("profile.title")}
        description={t("profile.subtitle")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <Card className="border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-text-primary">
              {name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="grid h-24 w-24 place-content-center rounded-full bg-gradient-primary shadow-[0_0_42px_rgba(225,6,19,0.25)]">
              <UserCircle className="h-14 w-14 text-white" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{name}</p>
              <p className="text-sm text-text-secondary">
                {roleLabel}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="border-border bg-background-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-text-primary">بيانات الحساب</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DetailRow
              icon={Mail}
              label={t("common.email")}
              value={user?.email || "-"}
            />
            <DetailRow
              icon={Shield}
              label="الدور"
              value={roleLabel}
            />
            <DetailRow
              icon={Briefcase}
              label="الوظيفة"
              value="-"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage
