import React from "react"
import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModeToggle } from "../mode-toggle"
import LanguageSwitcher from "../shared/buttons/language-switcher"
import { useAuth } from "@/features/auth/context/AuthContext"

interface HeaderProps {
  onLogout: () => void
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

const Header: React.FC<HeaderProps> = ({ onLogout, onMenuToggle, isMobileMenuOpen }) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background-card/80 px-4 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="menu-toggle-button rounded-lg border border-transparent p-2 text-text-secondary transition-all hover:border-border hover:bg-background-secondary hover:text-primary lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button
            className="relative rounded-full border border-transparent p-2 text-text-secondary transition-all hover:border-border hover:bg-background-secondary hover:text-primary"
            aria-label={t("header.notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute end-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </button>

          {/* User Menu - hide on small mobile */}
          <div className="hidden sm:flex items-center gap-3 border-s border-border ps-3">
            <div className="text-end">
              <p className="text-sm font-medium text-text-primary">
                {user?.name || t("header.adminUser")}
              </p>
              <p className="text-xs text-text-secondary">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-light/30 bg-gradient-primary shadow-[0_0_22px_rgba(225,6,19,0.2)]">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <ModeToggle />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Logout Button - hide on small mobile */}
          <button
            onClick={onLogout}
            className="hidden rounded-lg border border-border bg-background-secondary/60 px-4 py-2 text-sm font-medium text-text-primary transition-all hover:border-primary/40 hover:bg-background-secondary hover:text-primary sm:flex"
          >
            <LogOut className="h-4 w-4 inline ms-2" />
            {t("auth.logout")}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
