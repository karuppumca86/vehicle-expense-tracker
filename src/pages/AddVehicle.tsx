import { useState, useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { useToast } from '../contexts/ToastContext'
import { VehicleTypeIcon } from '../components/VehicleTypeIcon'
import { VEHICLE_TYPES, FUEL_TYPES, PRESET_COLORS } from '../utils/categories'
import type { VehicleType, NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
  editVehicleId?: string
}

const VEHICLE_TYPE_KEYS = Object.keys(VEHICLE_TYPES) as VehicleType[]

export function AddVehicle({ navigate, editVehicleId }: Props) {
  const { vehicles, activeVehicle, addVehicle, updateVehicle, setActiveVehicle } = useActiveVehicle()
  const { showToast } = useToast()
  const isEdit = !!editVehicleId
  const existing = editVehicleId ? vehicles.find((v) => v.id === editVehicleId) : null

  const [type, setType] = useState<VehicleType>('car')
  const [name, setName] = useState('')
  const [regNumber, setRegNumber] = useState('')
  const [fuelType, setFuelType] = useState('Petrol')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [makeActive, setMakeActive] = useState(!isEdit && vehicles.length === 0)

  useEffect(() => {
    if (existing) {
      setType(existing.type)
      setName(existing.name)
      setRegNumber(existing.registrationNumber)
      setFuelType(existing.defaultFuelType)
      setPurchaseDate(existing.purchaseDate ?? '')
      setColor(existing.color ?? PRESET_COLORS[0])
      setMakeActive(existing.isDefault)
    }
  }, [existing])

  const handleSave = async () => {
    if (!name.trim()) { showToast('Enter a vehicle name', 'error'); return }
    if (!regNumber.trim()) { showToast('Enter a registration number', 'error'); return }

    const data = {
      type,
      name: name.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      defaultFuelType: fuelType,
      purchaseDate: purchaseDate || null,
      color,
      isDefault: makeActive,
    }

    if (isEdit && existing) {
      await updateVehicle({ ...existing, ...data })
      showToast('Vehicle updated ✓')
      navigate({ screen: 'garage' })
    } else {
      const newV = await addVehicle(data)
      if (makeActive) await setActiveVehicle(newV)
      showToast('Vehicle added ✓')
      navigate({ screen: activeVehicle ? 'garage' : 'home' })
    }
  }

  const backScreen: NavState = vehicles.length === 0
    ? { screen: 'welcome' }
    : { screen: 'garage' }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 bg-white dark:bg-gray-900
        border-b border-black/[0.07] dark:border-white/[0.07]">
        <button
          onClick={() => navigate(backScreen)}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">
          {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
        </h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl active:scale-95 transition-transform"
        >
          Save
        </button>
      </div>

      <div className="flex-1 scroll-view px-4 pt-4 pb-8 space-y-5">
        {/* Vehicle type */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
            Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {VEHICLE_TYPE_KEYS.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-2 py-3 rounded-2xl border-[1.5px] transition-all active:scale-95 ${
                  type === t
                    ? 'border-primary bg-primary-light'
                    : 'border-black/[0.08] dark:border-white/10 bg-white dark:bg-gray-800'
                }`}
              >
                <VehicleTypeIcon type={t} size={18} />
                <span className={`text-xs font-semibold ${type === t ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                  {VEHICLE_TYPES[t].label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
            Vehicle Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kia Seltos GTX"
            className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/10
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Registration */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
            Registration Number
          </label>
          <input
            type="text"
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
            placeholder="e.g. TN 45 AB 1234"
            className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/10
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 uppercase tracking-wider
              focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Fuel type */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
            Default Fuel Type
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/10
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary transition-colors"
          >
            {FUEL_TYPES.map((ft) => <option key={ft}>{ft}</option>)}
          </select>
        </div>

        {/* Purchase date */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
            Purchase Date <span className="font-normal normal-case">(optional)</span>
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/10
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
            Accent Color
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90
                  ${color === c ? 'ring-2 ring-offset-2' : ''}`}
                style={{ background: c, outlineColor: color === c ? c : 'transparent' }}
                aria-label={`Select color ${c}`}
              >
                {color === c && <Check size={16} color="white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>

        {/* Set as active */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl px-4 py-3.5
          border border-black/[0.07] dark:border-white/10">
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Set as active vehicle</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Switch tracking to this vehicle</p>
          </div>
          <button
            onClick={() => setMakeActive((v) => !v)}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${makeActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            role="switch"
            aria-checked={makeActive}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${makeActive ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-primary text-white font-bold text-base rounded-2xl
            active:scale-95 transition-transform shadow-lg shadow-primary/30"
        >
          {isEdit ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </div>
  )
}
