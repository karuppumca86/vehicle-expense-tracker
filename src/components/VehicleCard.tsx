import { MoreVertical, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import type { Vehicle } from '../types'
import { VehicleTypeIcon } from './VehicleTypeIcon'
import { useCurrency } from '../contexts/CurrencyContext'

interface Props {
  vehicle: Vehicle
  totalExpenses: number
  isActive: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function VehicleCard({ vehicle, totalExpenses, isActive, onSelect, onEdit, onDelete }: Props) {
  const { fmt } = useCurrency()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleDelete = () => {
    setMenuOpen(false)
    if (confirm(`Delete ${vehicle.name} and all its expenses? This cannot be undone.`)) {
      onDelete()
    }
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl p-4 border transition-all
        ${isActive
          ? 'border-primary shadow-sm shadow-primary/20'
          : 'border-black/[0.07] dark:border-white/10'}`}
    >
      <button className="w-full text-left" onClick={onSelect}>
        <div className="flex items-center gap-3">
          <VehicleTypeIcon type={vehicle.type} size={22} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{vehicle.name}</p>
              {isActive && (
                <span className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">
                  <CheckCircle size={10} />
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
              {vehicle.registrationNumber}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{fmt(totalExpenses)}</p>
            <p className="text-[10px] text-gray-400">All time</p>
          </div>
        </div>
        {vehicle.color && (
          <div className="mt-3 h-1 rounded-full opacity-60" style={{ background: vehicle.color }} />
        )}
      </button>

      <button
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg
          text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
        aria-label="Vehicle options"
      >
        <MoreVertical size={16} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-3 top-11 z-20 bg-white dark:bg-gray-700 rounded-xl shadow-xl border border-black/[0.07] dark:border-white/10 overflow-hidden min-w-[120px]">
            <button
              className="w-full px-4 py-3 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              onClick={() => { setMenuOpen(false); onEdit() }}
            >
              Edit
            </button>
            <button
              className="w-full px-4 py-3 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}
