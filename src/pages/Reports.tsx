import { CalendarDays, Download } from 'lucide-react'
import { useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { useExpenses } from '../hooks/useExpenses'
import { VehicleSelector } from '../components/VehicleSelector'
import { StatCard } from '../components/StatCard'
import { ExpenseItem } from '../components/ExpenseItem'
import { ProgressBar } from '../components/ProgressBar'
import { EmptyState } from '../components/EmptyState'
import { CATEGORIES } from '../utils/categories'
import { fmtShortDate, filterByPeriod } from '../utils/formatters'
import { useCurrency } from '../contexts/CurrencyContext'
import { exportVehicleCSV } from '../utils/csvExport'
import type { NavState } from '../types'

type Period = 'week' | 'month' | 'year' | 'all' | 'pick'

const currentYearMonth = () => new Date().toISOString().slice(0, 7)

interface Props {
  navigate: (s: NavState) => void
}

export function Reports({ navigate }: Props) {
  const { fmt } = useCurrency()
  const { activeVehicle } = useActiveVehicle()
  const { expenses, removeExpense } = useExpenses(activeVehicle?.id ?? null)
  const [period, setPeriod] = useState<Period>('month')
  const [pickedMonth, setPickedMonth] = useState(currentYearMonth())

  const filtered = period === 'pick'
    ? expenses.filter((e) => e.date.startsWith(pickedMonth))
    : filterByPeriod(expenses, period)
  const total = filtered.reduce((s, e) => s + e.amount, 0)
  const fuelExpenses = filtered.filter((e) => e.category === 'Fuel')
  const fuelAmt = fuelExpenses.reduce((s, e) => s + e.amount, 0)
  const totalLitres = fuelExpenses.reduce((s, e) => s + (e.liters ?? 0), 0)

  const catMap = new Map<string, number>()
  filtered.forEach((e) => catMap.set(e.category, (catMap.get(e.category) ?? 0) + e.amount))
  const catEntries = [...catMap.entries()].sort((a, b) => b[1] - a[1])
  const maxCat = Math.max(...catMap.values(), 1)

  const dateMap = new Map<string, number>()
  filtered.forEach((e) => dateMap.set(e.date, (dateMap.get(e.date) ?? 0) + e.amount))
  const chartData = [...dateMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, amount]) => ({ label: fmtShortDate(date), amount }))

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  const PERIODS: { id: Period; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' },
    { id: 'all', label: 'All' },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Reports</h1>
          <VehicleSelector navigate={navigate} />
        </div>
      </div>

      <div className="flex-1 scroll-view pb-nav px-4 pt-3">
        {/* Period tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 gap-1 mb-2">
          {PERIODS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPeriod(id)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                period === id
                  ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setPeriod('pick')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center justify-center ${
              period === 'pick'
                ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                : 'text-gray-500 dark:text-gray-400'
            }`}
            aria-label="Pick month"
          >
            <CalendarDays size={15} />
          </button>
        </div>

        {/* Month picker — shown only when "pick" is active */}
        {period === 'pick' && (
          <div className="mb-4">
            <input
              type="month"
              value={pickedMonth}
              max={currentYearMonth()}
              onChange={(e) => setPickedMonth(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-black/[0.08] dark:border-white/10
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-semibold
                focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        )}
        {period !== 'pick' && <div className="mb-2" />}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <StatCard label="Total spent" value={fmt(total)} sub={`${filtered.length} expenses`} accent />
          <StatCard label="Fuel share" value={total > 0 ? `${((fuelAmt / total) * 100).toFixed(0)}%` : '—'} sub={fmt(fuelAmt)} />
          <StatCard label="Total fuel cost" value={fmt(fuelAmt)} sub={`${fuelExpenses.length} fill-ups`} />
          <StatCard label="Total litres" value={totalLitres > 0 ? `${totalLitres.toFixed(1)} L` : '—'} sub={totalLitres > 0 && fuelAmt > 0 ? `${fmt(Math.round(fuelAmt / totalLitres))}/L` : 'No fuel data'} />
        </div>

        {/* Bar chart */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Expenses over time</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => '₹' + (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)} />
                <Tooltip
                  formatter={(value: number) => [fmt(value), 'Amount']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 12 }}
                />
                <Bar dataKey="amount" fill="#1D9E75" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category breakdown */}
        {catEntries.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">By category</h2>
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
                  share={total > 0 ? `${((amount / total) * 100).toFixed(0)}%` : undefined}
                />
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 overflow-hidden mb-4">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">All expenses</h2>
            {sorted.length > 0 && activeVehicle && (
              <button
                onClick={() => exportVehicleCSV(activeVehicle, filtered)}
                className="flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <Download size={13} /> Export CSV
              </button>
            )}
          </div>
          <div className="px-4 pb-2">
            {sorted.length > 0 ? (
              sorted.map((e) => <ExpenseItem key={e.id} expense={e} onDelete={removeExpense} onEdit={(id) => navigate({ screen: 'editExpense', editExpenseId: id })} />)
            ) : (
              <EmptyState icon={Download} title="No data" subtitle="Try a different time period" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
