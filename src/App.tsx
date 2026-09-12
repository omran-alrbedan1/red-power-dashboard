import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

import MainLayout from "./components/layout/MainLayout"
import Dashboard from "./features/dashboard/pages/Dashboard"
import Login from "./features/auth/pages/Login"
import MaintenanceListPage from "./features/maintenance/pages/MaintenanceListPage"
import ReceiptCreatePage from "./features/maintenance/pages/ReceiptCreatePage"
import ReceiptDetailsPage from "./features/maintenance/pages/ReceiptDetailsPage"
import ProfilePage from "./features/staff/pages/ProfilePage"
import SettingsPage from "./features/settings/pages/SettingsPage"
import { useAuth } from "./features/auth/context/AuthContext"
import type { ReactNode } from "react"
import CustomersListPage from "./features/customers/pages/CustomersPage"
import CustomerDetailsPage from "./features/customers/pages/CustomerDetailsPage"
import CustomerCreatePage from "./features/customers/pages/CustomerCreatePage"

interface PrivateRouteProps {
  children: ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, status } = useAuth()

  if (status === "initializing") return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />

          {/* Customers */}
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="customers/new" element={<CustomerCreatePage />} />
          <Route path="customers/:customerId" element={<CustomerDetailsPage />} />

          {/* Maintenance */}
          <Route path="maintenance" element={<MaintenanceListPage />} />
          <Route path="maintenance/new" element={<ReceiptCreatePage />} />
          <Route path="maintenance/:cardId" element={<ReceiptDetailsPage />} />

          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors dir="rtl" />
    </BrowserRouter>
  )
}

export default App
