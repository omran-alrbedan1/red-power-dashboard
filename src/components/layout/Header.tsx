import React from "react"
import { Bell, User, LogOut, Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModeToggle } from "../ModeToggle"
import LanguageSwitcher from "../shared/buttons/LanguageSwitcher"
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
    <header className="sticky top-0 z-10 border-b border-border bg-background-card px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            className="menu-toggle-button lg:hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-background-secondary"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button
            className="relative rounded-full p-2 text-text-secondary transition-colors hover:bg-background-secondary"
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
                {user?.role === "super_admin" ? "Super Admin" : "Admin"}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
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
            className="hidden sm:flex rounded-xl border border-border bg-background-card px-4 py-2 text-sm font-medium text-text-primary transition hover:bg-background-secondary"
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
