export interface DashboardMaintenanceStats {
  openCards: number
  closedCards: number
  todayReceived: number
  totalCards: number
}

export interface DashboardEntityStats {
  active: number
  total: number
}

export interface DashboardStats {
  maintenance: DashboardMaintenanceStats
  customers: DashboardEntityStats
  vehicles: DashboardEntityStats
}