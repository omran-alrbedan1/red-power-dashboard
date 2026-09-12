import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ClipboardList, CircleCheck, CalendarCheck, Wrench } from 'lucide-react'
import PageHeader from '@/components/shared/headers/PageHeader'
import StatCard from '@/components/shared/cards/StatCard'
import { useDashboardStats } from '../hooks/useDashboardStats'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: stats, isLoading } = useDashboardStats()
  const value = (count: number | undefined) => (isLoading ? '—' : count ?? 0)

  const maintenance = stats?.maintenance

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('dashboard.welcome')}
        description={t('dashboard.subtitle')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <StatCard
          label={t('dashboard.statCards.openCards')}
          value={value(maintenance?.openCards)}
          sub={t('dashboard.statCards.totalCards')}
          icon={<ClipboardList size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.closedCards')}
          value={value(maintenance?.closedCards)}
          sub={t('dashboard.statCards.todayReceived')}
          icon={<CircleCheck size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.todayReceived')}
          value={value(maintenance?.todayReceived)}
          sub={t('dashboard.viewMaintenance')}
          icon={<CalendarCheck size={16} />}
        />
        <StatCard
          label={t('dashboard.statCards.totalCards')}
          value={value(maintenance?.totalCards)}
          sub={t('dashboard.statCards.closedCards')}
          icon={<Wrench size={16} />}
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