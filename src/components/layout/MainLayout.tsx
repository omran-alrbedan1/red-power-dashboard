import React, { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import { useAuth } from "@/features/auth/context/AuthContext"

const MainLayout: React.FC = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      navigate("/login", { replace: true })
    }
  }

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="rp-grid-surface flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar isMobile={false} />
      </div>

      {/* Mobile Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        isMobile={true}
        onClose={handleCloseMobileMenu}
      />

      {/* Main Content Area */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onLogout={handleLogout}
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* Page Content */}
        <main className="relative flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
