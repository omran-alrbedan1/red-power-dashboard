import { Link } from "react-router-dom"
import { KeyRound, ListChecks, UserCircle, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/features/auth/context/AuthContext"
import { isSuperAdmin } from "@/features/auth/utils/role.helpers"
export default function SettingsLivePage(){const{t}=useTranslation("admin");const{user}=useAuth();const items=[{to:"/profile",icon:UserCircle,key:"profile"},{to:"/profile",icon:KeyRound,key:"security"},...(isSuperAdmin(user)?[{to:"/settings/users",icon:Users,key:"users"},{to:"/settings/maintenance-options",icon:ListChecks,key:"options"}]:[])];return <div className="space-y-4"><PageHeader title={t("settings.title")} description={t("settings.subtitle")}/><div className="grid gap-4 sm:grid-cols-2">{items.map(({to,icon:Icon,key})=><Link key={key} to={to}><Card className="h-full transition-colors hover:border-primary/50"><CardContent className="flex gap-3 pt-6"><Icon className="text-primary"/><div><h2 className="font-semibold">{t(`settings.${key}`)}</h2><p className="text-sm text-muted-foreground">{t(`settings.${key}Description`)}</p></div></CardContent></Card></Link>)}</div></div>}
