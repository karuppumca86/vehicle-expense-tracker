import { Receipt, Settings } from 'lucide-react'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { useExpenses } from '../hooks/useExpenses'
import { VehicleSelector } from '../components/VehicleSelector'
import { StatCard } from '../components/StatCard'
import { ExpenseItem } from '../components/ExpenseItem'
import { ProgressBar } from '../components/ProgressBar'
import { EmptyState } from '../components/EmptyState'
import { CATEGORIES } from '../utils/categories'
import { fmt, filterByPeriod } from '../utils/formatters'
import { calculateMileage } from '../utils/mileage'
import type { NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function Dashboard({ navigate }: Props) {
  const { activeVehicle } = useActiveVehicle()
  const { expenses, removeExpense } = useExpenses(activeVehicle?.id ?? null)

  const mth = filterByPeriod(expenses, 'month')
  const mthTotal = mth.reduce((s, e) => s + e.amount, 0)
  const mthFuel = mth.filter((e) => e.category === 'Fuel').reduce((s, e) => s + e.amount, 0)
  const allTotal = expenses.reduce((s, e) => s + e.amount, 0)
  const { averageKmL } = calculateMileage(expenses)

  const catTotals = new Map<string, number>()
  mth.forEach((e) => catTotals.set(e.category, (catTotals.get(e.category) ?? 0) + e.amount))
  const catEntries = [...catTotals.entries()].sort((a, b) => b[1] - a[1])
  const maxCat = Math.max(...catTotals.values(), 1)

  const recent = expenses.slice(0, 5)

  const now = new Date()
  const monthLabel = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0 mr-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight truncate">
              {activeVehicle?.name ?? 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <VehicleSelector navigate={navigate} />
            <button
              onClick={() => navigate({ screen: 'settings' })}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400
                hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 scroll-view pb-nav px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          <StatCard label="This month" value={fmt(mthTotal)} sub={`${mth.length} expense${mth.length !== 1 ? 's' : ''}`} accent />
          <StatCard label="Fuel cost" value={fmt(mthFuel)} sub={`${mth.filter((e) => e.category === 'Fuel').length} fill-ups`} />
          <StatCard
            label="Avg mileage"
            value={averageKmL ? `${averageKmL.toFixed(1)} km/L` : '—'}
            sub="from fuel logs"
          />
          <StatCard label="All-time total" value={fmt(allTotal)} sub={`${expenses.length} records`} />
        </div>

        {/* Category breakdown */}
        {catEntries.length > 0 && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 overflow-hidden">
            <div className="px-4 pt-4 pb-1">
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">This month by category</h2>
            </div>
            <div className="px-4 pb-3 mt-2">
              {catEntries.map(([cat, amount]) => {
                const cfg = CATEGORIES[cat as keyof typeof CATEGORIES]
                if (!cfg) return null
                const Icon = cfg.icon
                return (
                  <ProgressBar
                    key={cat}
                    label={cat}
                    amount={fmt(amount)}
                    percent={(amount / maxCat) * 100}
                    color={cfg.color}
                    icon={<Icon size={13} color={cfg.color} />}
                    share={mthTotal > 0 ? `${((amount / mthTotal) * 100).toFixed(0)}%` : undefined}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Recent expenses */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Recent expenses</h2>
            {expenses.length > 5 && (
              <button
                className="text-xs font-semibold text-primary"
                onClick={() => navigate({ screen: 'reports' })}
              >
                View all
              </button>
            )}
          </div>
          <div className="px-4 pb-2">
            {recent.length > 0 ? (
              recent.map((e) => <ExpenseItem key={e.id} expense={e} onDelete={removeExpense} onEdit={(id) => navigate({ screen: 'editExpense', editExpenseId: id })} />)
            ) : (
              <EmptyState
                icon={Receipt}
                title="No expenses yet"
                subtitle="Tap + to add your first expense"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
