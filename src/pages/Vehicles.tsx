import { Plus, Car } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { VehicleCard } from '../components/VehicleCard'
import { EmptyState } from '../components/EmptyState'
import { getExpensesByVehicle } from '../utils/db'
import type { NavState, Vehicle } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function Vehicles({ navigate }: Props) {
  const { vehicles, activeVehicle, setActiveVehicle, removeVehicle } = useActiveVehicle()
  const [vehicleTotals, setVehicleTotals] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (vehicles.length === 0) return
    Promise.all(
      vehicles.map(async (v) => {
        const exps = await getExpensesByVehicle(v.id)
        return [v.id, exps.reduce((s, e) => s + e.amount, 0)] as [string, number]
      }),
    ).then((entries) => setVehicleTotals(new Map(entries)))
  }, [vehicles])

  const handleSelect = async (v: Vehicle) => {
    await setActiveVehicle(v)
  }

  const handleDelete = async (v: Vehicle) => {
    await removeVehicle(v.id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-4 pt-4 pb-3 bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">My Garage</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 scroll-view pb-nav px-4 pt-3">
        {vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles yet"
            subtitle="Add your first vehicle to start tracking"
            action={
              <button
                onClick={() => navigate({ screen: 'addVehicle' })}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold text-sm rounded-2xl"
              >
                <Plus size={16} /> Add Vehicle
              </button>
            }
          />
        ) : (
          <div className="space-y-3 pb-4">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                totalExpenses={vehicleTotals.get(v.id) ?? 0}
                isActive={activeVehicle?.id === v.id}
                onSelect={() => handleSelect(v)}
                onEdit={() => navigate({ screen: 'editVehicle', editVehicleId: v.id })}
                onDelete={() => handleDelete(v)}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate({ screen: 'addVehicle' })}
        className="fixed bottom-20 right-4 w-14 h-14 bg-primary rounded-full
          flex items-center justify-center shadow-xl shadow-primary/40 z-20
          active:scale-95 transition-transform"
        aria-label="Add vehicle"
      >
        <Plus size={24} color="white" />
      </button>
    </div>
  )
}
