import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  Users,
  Wrench,
  UserCircle,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react"
import { images } from '@/constants/images'

interface MenuItem {
  titleKey: string
  path: string
  icon: LucideIcon
  notifs?: number
}

const menuItems: MenuItem[] = [
  {
    titleKey: "sidebar.menu.home",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    titleKey: "sidebar.menu.customers",
    path: "/customers",
    icon: Users,
  },
  {
    titleKey: "sidebar.menu.maintenance",
    path: "/maintenance",
    icon: Wrench,
    notifs: 3,
  },
]

const accountItems: MenuItem[] = [
  {
    titleKey: "sidebar.menu.profile",
    path: "/profile",
    icon: UserCircle,
  },
  {
    titleKey: "sidebar.menu.settings",
    path: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  isOpen?: boolean
  isMobile?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  isMobile = false,
  onClose,
}) => {
  useEffect(() => {
    if (!isMobile || !isOpen) return

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    document.addEventListener("keydown", handleEsc)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isMobile, isOpen, onClose])

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/75"
          />
        )}

        <aside
          className={[
            "fixed inset-y-0 start-0 z-50 w-[290px]",
            "transition-transform duration-200 ease-out",
            isOpen
              ? "translate-x-0"
              : "-translate-x-full rtl:translate-x-full",
          ].join(" ")}
        >
          <SidebarContent
            isMobile
            onClose={onClose}
          />
        </aside>
      </>
    )
  }

  return (
    <aside className="hidden lg:block">
      <SidebarContent />
    </aside>
  )
}

interface SidebarContentProps {
  isMobile?: boolean
  onClose?: () => void
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isMobile = false,
  onClose,
}) => {
  const location = useLocation()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBrandClick = () => {
    navigate("/")

    if (isMobile) {
      onClose?.()
    }
  }

  return (
    <nav
      className="
        relative flex h-screen w-[290px] shrink-0 flex-col
        overflow-hidden border-e border-white/10
        bg-[#090d11] text-white
      "
    >
      {/* Full sidebar background */}
      <img
        src={images.sidebarBackground}
        alt=""
        aria-hidden="true"
        className="
          pointer-events-none absolute -mt-12 inset-0
          h-full w-full object-cover object-center
          select-none
        "
      />

      {/* Dark overlay so menu stays readable */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_bottom,rgba(5,8,11,0.12)_0%,rgba(5,8,11,0.45)_22%,rgba(5,8,11,0.88)_34%,rgba(5,8,11,0.92)_47%,rgba(5,8,11,0.38)_100%)]
        "
      />

      {/* subtle side depth */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[linear-gradient(to_right,rgba(0,0,0,0.05),rgba(0,0,0,0.2))]
          rtl:bg-[linear-gradient(to_left,rgba(0,0,0,0.05),rgba(0,0,0,0.2))]
        "
      />

      {/* mobile close */}
      {isMobile && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="
            absolute end-4 top-4 z-40
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-white/10
            bg-black/40 text-white/75
            backdrop-blur-sm
            hover:bg-black/60 hover:text-white
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E10613]
          "
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Clickable brand area */}
      <button
        type="button"
        onClick={handleBrandClick}
        aria-label="Red Power Garage"
        className="
          relative z-20 h-[190px] w-full shrink-0
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[#E10613]
        "
      />

      {/* Navigation */}
      <div
        className="
          relative z-20 flex flex-1 flex-col -mt-8
          overflow-y-auto scrollbar-none px-4 pb-[235px]
        "
      >
        <SidebarSectionTitle>
          {t("sidebar.sections.main", "Main Menu")}
        </SidebarSectionTitle>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <SidebarOption
              key={item.path}
              item={item}
              currentPath={location.pathname}
              isMobile={isMobile}
              onClose={onClose}
            />
          ))}
        </div>

        <div className="my-6 h-px bg-white/10" />

        <SidebarSectionTitle>
          {t("sidebar.sections.account", "Account")}
        </SidebarSectionTitle>

        <div className="space-y-2">
          {accountItems.map((item) => (
            <SidebarOption
              key={item.path}
              item={item}
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

interface SidebarSectionTitleProps {
  children: React.ReactNode
}

const SidebarSectionTitle: React.FC<SidebarSectionTitleProps> = ({
  children,
}) => {
  return (
    <p
      className="
        mb-3 px-3
        text-[11px] font-semibold uppercase
        tracking-[0.14em] text-white/45
      "
    >
      {children}
    </p>
  )
}

interface SidebarOptionProps {
  item: MenuItem
  currentPath: string
  isMobile?: boolean
  onClose?: () => void
}

const SidebarOption: React.FC<SidebarOptionProps> = ({
  item,
  currentPath,
  isMobile = false,
  onClose,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const Icon = item.icon

  const isSelected =
    item.path === "/"
      ? currentPath === "/"
      : currentPath === item.path ||
        currentPath.startsWith(`${item.path}/`)

  const handleNavigate = () => {
    navigate(item.path)

    if (isMobile) {
      onClose?.()
    }
  }

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className={[
        "group relative flex h-[52px] w-full items-center rounded-xl px-4 text-start",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#E10613]",
        isSelected
          ? [
              "bg-gradient-to-r",
              "from-[#E10613]",
              "to-[#C50010]",
              "text-white",
              "shadow-[0_8px_28px_rgba(225,6,19,0.28)]",
            ].join(" ")
          : [
              "text-white/75",
              "hover:bg-white/[0.07]",
              "hover:text-white",
              "backdrop-blur-[2px]",
            ].join(" "),
      ].join(" ")}
    >
      <span
        className="
          flex h-8 w-8 shrink-0
          items-center justify-center
        "
      >
        <Icon
          strokeWidth={1.9}
          className={[
            "h-[19px] w-[19px]",
            isSelected
              ? "text-white"
              : "text-white/75 group-hover:text-white",
          ].join(" ")}
        />
      </span>

      <span className="ms-3 flex-1 text-[15px] font-medium">
        {t(item.titleKey)}
      </span>

      {item.notifs !== undefined && item.notifs > 0 && (
        <span
          className={[
            "flex min-w-6 items-center justify-center",
            "rounded-full px-1.5 py-0.5",
            "text-xs font-semibold",
            isSelected
              ? "bg-white text-[#E10613]"
              : "bg-[#E10613] text-white",
          ].join(" ")}
        >
          {item.notifs}
        </span>
      )}
    </button>
  )
}

export default Sidebar