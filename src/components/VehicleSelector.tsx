import { useState } from 'react'
import { ChevronDown, Check, PlusCircle } from 'lucide-react'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { VehicleTypeIcon } from './VehicleTypeIcon'
import type { NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function VehicleSelector({ navigate }: Props) {
  const { vehicles, activeVehicle, setActiveVehicle } = useActiveVehicle()
  const [open, setOpen] = useState(false)

  if (!activeVehicle) return null

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-black/[0.08] dark:border-white/10
          rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-800 dark:text-gray-200
          active:scale-95 transition-all shadow-sm"
      >
        <VehicleTypeIcon type={activeVehicle.type} size={12} />
        <span className="max-w-[120px] truncate">{activeVehicle.name}</span>
        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl pb-safe-bottom overflow-hidden max-w-mobile w-full mx-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">Switch Vehicle</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-semibold text-primary"
              >
                Done
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
              {vehicles.map((v) => (
                <button
                  key={v.id}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                  onClick={() => { setActiveVehicle(v); setOpen(false) }}
                >
                  <VehicleTypeIcon type={v.type} size={18} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{v.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{v.registrationNumber}</p>
                  </div>
                  {activeVehicle.id === v.id && <Check size={18} className="text-primary flex-shrink-0" />}
                </button>
              ))}

              <button
                className="w-full flex items-center gap-3 px-5 py-4 border-t border-black/[0.06] dark:border-white/[0.06] text-primary font-semibold text-sm"
                onClick={() => { setOpen(false); navigate({ screen: 'addVehicle' }) }}
              >
                <PlusCircle size={18} />
                Add new vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
