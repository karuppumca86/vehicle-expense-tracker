import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from 'react'
import type { Vehicle } from '../types'
import {
  getAllVehicles, saveVehicle,
  deleteVehicle as dbDeleteVehicle,
  getSetting, setSetting,
} from '../utils/db'

interface ActiveVehicleContextType {
  vehicles: Vehicle[]
  activeVehicle: Vehicle | null
  loading: boolean
  setActiveVehicle: (vehicle: Vehicle) => Promise<void>
  addVehicle: (v: Omit<Vehicle, 'id' | 'createdAt'>) => Promise<Vehicle>
  updateVehicle: (v: Vehicle) => Promise<void>
  removeVehicle: (id: string) => Promise<void>
  reload: () => Promise<void>
}

const ActiveVehicleContext = createContext<ActiveVehicleContextType | null>(null)

export function ActiveVehicleProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [activeVehicle, setActiveVehicleState] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await getAllVehicles()
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    setVehicles(all)

    const savedId = await getSetting('activeVehicleId')
    const found = savedId ? all.find((v) => v.id === savedId) : null
    const fallback = all.find((v) => v.isDefault) ?? all[0] ?? null
    setActiveVehicleState(found ?? fallback)
    setLoading(false)
  }, [])

  useEffect(() => { reload() }, [reload])

  const setActiveVehicle = useCallback(async (vehicle: Vehicle) => {
    setActiveVehicleState(vehicle)
    await setSetting('activeVehicleId', vehicle.id)
  }, [])

  const addVehicle = useCallback(async (v: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle> => {
    const newVehicle: Vehicle = { ...v, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    await saveVehicle(newVehicle)
    await reload()
    return newVehicle
  }, [reload])

  const updateVehicle = useCallback(async (v: Vehicle) => {
    await saveVehicle(v)
    await reload()
  }, [reload])

  const removeVehicle = useCallback(async (id: string) => {
    const savedId = await getSetting('activeVehicleId')
    if (savedId === id) await setSetting('activeVehicleId', '')
    await dbDeleteVehicle(id)
    await reload()
  }, [reload])

  return (
    <ActiveVehicleContext.Provider value={{
      vehicles, activeVehicle, loading,
      setActiveVehicle, addVehicle, updateVehicle, removeVehicle, reload,
    }}>
      {children}
    </ActiveVehicleContext.Provider>
  )
}

export function useActiveVehicle(): ActiveVehicleContextType {
  const ctx = useContext(ActiveVehicleContext)
  if (!ctx) throw new Error('useActiveVehicle must be used within ActiveVehicleProvider')
  return ctx
}
