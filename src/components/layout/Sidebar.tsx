import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  UserCircle,
  Settings,
  X,
} from "lucide-react"
import { RedPowerLogo } from "@/components/brand/RedPowerLogo"

interface MenuItem {
  titleKey: string
  path?: string
  icon: any
  notifs?: number
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { titleKey: "sidebar.menu.home", path: "/", icon: LayoutDashboard },
  { titleKey: "sidebar.menu.customers", path: "/customers", icon: Users },
  { titleKey: "sidebar.menu.vehicles", path: "/vehicles", icon: Car },
  { titleKey: "sidebar.menu.maintenance", path: "/maintenance", icon: Wrench, notifs: 3 },
]

const accountItems: MenuItem[] = [
  { titleKey: "sidebar.menu.profile", path: "/profile", icon: UserCircle },
  { titleKey: "sidebar.menu.settings", path: "/settings", icon: Settings },
]

interface SidebarProps {
  isOpen?: boolean
  isMobile?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, isMobile = false, onClose }) => {
  const isVisible = isMobile ? isOpen : true

  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)

    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isOpen, onClose])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-sidebar-content') && !target.closest('.menu-toggle-button')) {
        onClose?.()
      }
    }

    // Delay to avoid immediate close when opening
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobile, isOpen, onClose])

  // Listen for custom close event from navigation
  useEffect(() => {
    const handleCloseEvent = () => {
      onClose?.()
    }

    window.addEventListener('closeMobileMenu', handleCloseEvent)

    return () => {
      window.removeEventListener('closeMobileMenu', handleCloseEvent)
    }
  }, [onClose])

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar (Drawer) */}
      {isMobile && (
        <div
          className={`mobile-sidebar-content fixed inset-y-0 start-0 z-50 transform transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          }`}
        >
          <SidebarContent open={true} isMobile={true} onClose={onClose} />
        </div>
      )}

      {/* Desktop Sidebar (Always visible) */}
      {!isMobile && <SidebarContent open={true} isMobile={false} onClose={onClose} />}
    </>
  )
}

interface SidebarContentProps {
  open: boolean
  isMobile: boolean
  onClose?: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({ open, isMobile, onClose }) => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <nav
      className={`relative flex h-screen w-64 shrink-0 flex-col overflow-hidden bg-background-sidebar shadow-2xl transition-colors duration-300 ${
        isMobile ? "shadow-xl" : "border-e border-border/80"
      }`}
    >
      {/* Close button for mobile */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute end-3 top-3 z-10 rounded-lg p-2 text-text-secondary hover:bg-background-secondary transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <TitleSection isMobile={isMobile} onClose={onClose} />

      <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 pb-20">
        <div className="space-y-1 mb-6">
          <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            {t("sidebar.sections.main")}
          </div>
          {menuItems.map((item) => (
            <Option
              key={item.path}
              Icon={item.icon}
              titleKey={item.titleKey}
              path={item.path!}
              currentPath={location.pathname}
              notifs={item.notifs}
              isMobile={isMobile}
              onClose={onClose}
            />
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-text-muted uppercase tracking-wide">
            {t("sidebar.sections.account")}
          </div>
          {accountItems.map((item) => (
            <Option
              key={item.path}
              Icon={item.icon}
              titleKey={item.titleKey}
              path={item.path!}
              currentPath={location.pathname}
              isMobile={isMobile}
              onClose={onClose}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

interface OptionProps {
  Icon: any
  titleKey: string
  path: string
  currentPath: string
  notifs?: number
  isMobile?: boolean
  onClose?: () => void
}

const Option: React.FC<OptionProps> = ({ Icon, titleKey, path, currentPath, notifs, isMobile, onClose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isSelected =
    path === "/"
      ? currentPath === "/"
      : currentPath === path || currentPath.startsWith(`${path}/`)

  const handleClick = () => {
    navigate(path)
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      className={`relative flex h-11 w-full cursor-pointer items-center overflow-hidden rounded-md border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isSelected
          ? "border-primary-light/25 bg-[linear-gradient(90deg,rgba(225,6,19,0.98),rgba(180,0,12,0.92))] text-white shadow-[0_8px_24px_rgba(225,6,19,0.2)]"
          : "border-transparent text-text-secondary hover:border-border/70 hover:bg-background-secondary/70 hover:text-text-primary"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
      </div>

      <span className="text-sm font-medium flex-1">
        {t(titleKey)}
      </span>

      {notifs !== undefined && notifs > 0 && (
        <span className={`absolute end-3 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
          isSelected ? 'bg-white text-primary' : 'bg-primary text-white'
        }`}>
          {notifs}
        </span>
      )}
    </div>
  )
}

interface TitleSectionProps {
  isMobile?: boolean
  onClose?: () => void
}

const TitleSection: React.FC<TitleSectionProps> = ({ isMobile, onClose }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/")
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <div className="relative mb-6 border-b border-border/80 px-2 pb-4 pt-2">
      <div className="rp-metal-line absolute inset-x-8 bottom-0 h-px opacity-40" />
      <div
        onClick={handleClick}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 transition-colors hover:bg-background-secondary"
      >
        <RedPowerLogo className="h-24 w-52" />
      </div>
    </div>
  )
}

export default Sidebar
