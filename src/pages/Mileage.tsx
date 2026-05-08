import { AlertCircle, Gauge } from 'lucide-react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Dot,
} from 'recharts'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { useExpenses } from '../hooks/useExpenses'
import { VehicleSelector } from '../components/VehicleSelector'
import { StatCard } from '../components/StatCard'
import { EmptyState } from '../components/EmptyState'
import { calculateMileage } from '../utils/mileage'
import { fmtDate, fmtShortDate } from '../utils/formatters'
import { useCurrency } from '../contexts/CurrencyContext'
import type { NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function Mileage({ navigate }: Props) {
  const { fmt } = useCurrency()
  const { activeVehicle } = useActiveVehicle()
  const { expenses } = useExpenses(activeVehicle?.id ?? null)

  const { averageKmL, bestKmL, measurements, totalLiters, totalFuelCost } = calculateMileage(expenses)

  const fuelEntries = [...expenses]
    .filter((e) => e.category === 'Fuel')
    .sort((a, b) => b.date.localeCompare(a.date))

  const chartData = measurements.map((m) => ({ ...m, label: fmtShortDate(m.date) }))

  // Chain lube banner: show for bikes if last chainlube was >500 km ago
  const showChainBanner = activeVehicle?.type === 'bike' && (() => {
    const lastChain = expenses.find((e) => e.category === 'Chainlube' && e.odometer)
    const lastFuel = fuelEntries.find((e) => e.odometer)
    if (!lastChain?.odometer || !lastFuel?.odometer) return false
    return lastFuel.odometer - lastChain.odometer >= 500
  })()

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Mileage</h1>
          <VehicleSelector navigate={navigate} />
        </div>
      </div>

      <div className="flex-1 scroll-view pb-nav px-4 pt-3">
        {/* Chain lube banner */}
        {showChainBanner && (
          <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40
            rounded-2xl px-4 py-3 mb-4">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              Chain lube due — last done over 500 km ago
            </p>
          </div>
        )}

        {/* Hero */}
        <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: '#1D9E75' }}>
          <p className="text-6xl font-black text-white leading-none tracking-tight">
            {averageKmL ? averageKmL.toFixed(1) : '—'}
          </p>
          <p className="text-white/80 text-base mt-1">km per litre</p>
          <p className="text-white/60 text-xs mt-2">
            {measurements.length >= 1
              ? `Based on ${measurements.length} fill-up measurement${measurements.length > 1 ? 's' : ''}`
              : 'Add 2+ fuel entries with odometer to track'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <StatCard label="Best fill-up" value={bestKmL ? `${bestKmL.toFixed(1)} km/L` : '—'} sub="highest efficiency" />
          <StatCard label="Total fuel cost" value={fmt(totalFuelCost)} sub={`${totalLiters.toFixed(0)} L total`} />
        </div>

        {/* Efficiency trend chart */}
        {chartData.length >= 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4 mb-4">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Efficiency trend</h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v.toFixed(0)}`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} km/L`, 'Efficiency']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="kmL"
                  stroke="#1D9E75"
                  strokeWidth={2.5}
                  dot={<Dot r={4} fill="#1D9E75" stroke="white" strokeWidth={2} />}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Fill-up log */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Fill-up log</h2>
          </div>
          <div className="px-4 pb-2">
            {fuelEntries.length > 0 ? fuelEntries.map((e, i) => {
              const prev = fuelEntries[i + 1]
              let eff: string | null = null
              if (e.odometer && prev?.odometer && e.liters && e.liters > 0) {
                const km = e.odometer - prev.odometer
                if (km > 0) eff = (km / e.liters).toFixed(1)
              }
              return (
                <div key={e.id} className="flex items-center justify-between py-3 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {fmtDate(e.date)}{e.fuelType ? ` · ${e.fuelType}` : ''}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {e.liters ? `${e.liters} L` : '—'}
                      {e.odometer ? ` · ${e.odometer.toLocaleString('en-IN')} km` : ''}
                      {e.notes ? ` · ${e.notes}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{fmt(e.amount)}</p>
                    <p className="text-xs text-gray-400">
                      {e.liters ? `₹${(e.amount / e.liters).toFixed(1)}/L` : ''}
                      {eff ? ` · ${eff} km/L` : ''}
                    </p>
                  </div>
                </div>
              )
            }) : (
              <EmptyState icon={Gauge} title="No fuel records" subtitle="Add fuel expenses with odometer readings" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
