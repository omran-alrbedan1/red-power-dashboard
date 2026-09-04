import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Wrench, ClipboardList, CalendarCheck, CircleCheck } from 'lucide-react'
import PageHeader from '@/components/shared/headers/PageHeader'
import StatCard from '@/components/shared/cards/StatCard'
import { useDashboardStats } from '../hooks/useDashboardStats'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: stats, isLoading } = useDashboardStats()
  const value = (count: number | undefined) => isLoading ? '—' : count ?? 0

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('dashboard.welcome')}
        description={t('dashboard.subtitle')}
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label={t('dashboard.statCards.openCards')}
          value={value(stats?.open)}
          sub={t('dashboard.statCards.inProgress')}
          icon={<ClipboardList size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.inProgress')}
          value={value(stats?.in_progress)}
          sub={t('dashboard.statCards.waitingParts')}
          icon={<CalendarCheck size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.waitingParts')}
          value={value(stats?.waiting_parts)}
          sub={t('dashboard.statCards.readyForDelivery')}
          icon={<Wrench size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.readyForDelivery')}
          value={value(stats?.ready_for_delivery)}
          sub={t('dashboard.statCards.closedCards')}
          icon={<CircleCheck size={16} />}
        />
      </div>
      <button
        type="button"
        onClick={() => navigate('/maintenance')}
        className="self-start text-sm font-medium text-primary transition-opacity hover:opacity-80"
      >
        {t('dashboard.viewMaintenance')}
      </button>
    </div>
  )
}

export default Dashboard
