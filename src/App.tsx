import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"
import Dashboard from "./features/dashboard/pages/Dashboard"
import Login from "./features/auth/pages/Login"
import CustomersListPage from "./features/customers/pages/customers-list.page"
import CustomerCreatePage from "./features/customers/pages/customer-create.page"
import CustomerDetailsPage from "./features/customers/pages/customer-details.page"
import CustomerEditPage from "./features/customers/pages/customer-edit.page"
import VehiclesListPage from "./features/vehicles/pages/vehicles-list.page"
import VehicleCreatePage from "./features/vehicles/pages/vehicle-create.page"
import VehicleDetailsPage from "./features/vehicles/pages/vehicle-details.page"
import VehicleEditPage from "./features/vehicles/pages/vehicle-edit.page"
import MaintenanceListPage from "./features/maintenance/pages/maintenance-list.page"
import ReceiptCreatePage from "./features/maintenance/pages/receipt-create.page"
import ReceiptDetailsPage from "./features/maintenance/pages/receipt-details.page"
import ProfilePage from "./features/staff/pages/profile-live.page"
import SettingsPage from "./features/settings/pages/settings-live.page"
import UsersPage from "./features/admin/pages/users.page"
import UserDetailsPage from "./features/admin/pages/user-details.page"
import MaintenanceOptionsPage from "./features/admin/pages/maintenance-options.page"
import { RoleRoute } from "./components/auth/RoleRoute"
import { useAuth } from "./features/auth/context/AuthContext"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

interface PrivateRouteProps {
  children: ReactNode
}

function AuthLoading() {
  const { t } = useTranslation()
  return (
    <div className="grid min-h-screen place-items-center text-text-secondary">
      {t("auth.initializing")}
    </div>
  )
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <AuthLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicOnlyRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <AuthLoading />
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />

          {/* Customers */}
          <Route path="customers" element={<CustomersListPage />} />
          <Route path="customers/new" element={<CustomerCreatePage />} />
          <Route path="customers/:customerId" element={<CustomerDetailsPage />} />
          <Route path="customers/:customerId/edit" element={<CustomerEditPage />} />

          <Route path="vehicles" element={<VehiclesListPage />} />
          <Route path="vehicles/new" element={<VehicleCreatePage />} />
          <Route path="vehicles/:vehicleId" element={<VehicleDetailsPage />} />
          <Route path="vehicles/:vehicleId/edit" element={<VehicleEditPage />} />

          {/* Maintenance */}
          <Route path="maintenance" element={<MaintenanceListPage />} />
          <Route path="maintenance/new" element={<ReceiptCreatePage />} />
          <Route path="maintenance/:cardId" element={<ReceiptDetailsPage />} />

          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/users" element={<RoleRoute roles={["SUPER_ADMIN"]}><UsersPage /></RoleRoute>} />
          <Route path="settings/users/:id" element={<RoleRoute roles={["SUPER_ADMIN"]}><UserDetailsPage /></RoleRoute>} />
          <Route path="settings/maintenance-options" element={<RoleRoute roles={["SUPER_ADMIN"]}><MaintenanceOptionsPage /></RoleRoute>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
