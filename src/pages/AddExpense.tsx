import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, RefreshCw } from 'lucide-react'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { useExpenses } from '../hooks/useExpenses'
import { useSettings } from '../hooks/useSettings'
import { useGemini } from '../hooks/useGemini'
import { useToast } from '../contexts/ToastContext'
import { CategoryChip } from '../components/CategoryChip'
import { VehicleTypeIcon } from '../components/VehicleTypeIcon'
import { BASE_CATEGORIES, BIKE_EXTRA_CATEGORIES, FUEL_TYPES } from '../utils/categories'
import { today } from '../utils/formatters'
import type { Expense, ExpenseCategory, NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
  editExpense?: Expense
}

export function AddExpense({ navigate, editExpense }: Props) {
  const { activeVehicle } = useActiveVehicle()
  const { addExpense, updateExpense } = useExpenses(activeVehicle?.id ?? null)
  const { geminiApiKey } = useSettings()
  const { scanning, scanBill } = useGemini()
  const { showToast } = useToast()

  const isEditing = !!editExpense

  const [category, setCategory] = useState<ExpenseCategory>(editExpense?.category ?? 'Fuel')
  const [amount, setAmount] = useState(editExpense ? String(editExpense.amount) : '')
  const [date, setDate] = useState(editExpense?.date ?? today())
  const [notes, setNotes] = useState(editExpense?.notes ?? '')
  const [liters, setLiters] = useState(editExpense?.liters != null ? String(editExpense.liters) : '')
  const [odometer, setOdometer] = useState(editExpense?.odometer != null ? String(editExpense.odometer) : '')
  const [fuelType, setFuelType] = useState(editExpense?.fuelType ?? activeVehicle?.defaultFuelType ?? 'Petrol')
  const [preview, setPreview] = useState<string | null>(
    editExpense?.billImageBase64 ? `data:image/jpeg;base64,${editExpense.billImageBase64}` : null
  )
  const [imageData, setImageData] = useState<{ base64: string; mime: string } | null>(
    editExpense?.billImageBase64 ? { base64: editExpense.billImageBase64, mime: 'image/jpeg' } : null
  )
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editExpense) setFuelType(activeVehicle?.defaultFuelType ?? 'Petrol')
  }, [activeVehicle, editExpense])

  const categories = activeVehicle?.type === 'bike'
    ? [...BASE_CATEGORIES, ...BIKE_EXTRA_CATEGORIES]
    : BASE_CATEGORIES

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const result = ev.target?.result as string
      const base64 = result.split(',')[1]
      setPreview(result)
      setImageData({ base64, mime: file.type || 'image/jpeg' })

      if (!geminiApiKey) {
        showToast('Set your Gemini API key in Settings to enable AI scanning', 'info')
        return
      }
      try {
        const extracted = await scanBill(base64, file.type || 'image/jpeg', geminiApiKey)
        if (extracted.amount) setAmount(String(extracted.amount))
        if (extracted.date) setDate(extracted.date)
        if (extracted.notes) setNotes(extracted.notes)
        if (extracted.liters) setLiters(String(extracted.liters))
        if (extracted.fuelType) setFuelType(extracted.fuelType)
        if (extracted.category && categories.includes(extracted.category)) setCategory(extracted.category)
        showToast('Bill scanned! Review and save ✓')
      } catch {
        showToast('Could not read bill — fill in manually', 'error')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSave = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { showToast('Enter a valid amount', 'error'); return }
    if (!date) { showToast('Select a date', 'error'); return }
    if (!activeVehicle) { showToast('No active vehicle', 'error'); return }

    if (isEditing && editExpense) {
      await updateExpense({
        ...editExpense,
        category,
        amount: amt,
        date,
        notes,
        liters: category === 'Fuel' && liters ? parseFloat(liters) : null,
        odometer: category === 'Fuel' && odometer ? parseInt(odometer) : null,
        fuelType: category === 'Fuel' ? fuelType : null,
        billImageBase64: imageData?.base64 ?? null,
      })
      showToast('Expense updated ✓')
      navigate({ screen: 'home' })
      return
    }

    await addExpense({
      vehicleId: activeVehicle.id,
      category,
      amount: amt,
      date,
      notes,
      liters: category === 'Fuel' && liters ? parseFloat(liters) : null,
      odometer: category === 'Fuel' && odometer ? parseInt(odometer) : null,
      fuelType: category === 'Fuel' ? fuelType : null,
      billImageBase64: imageData?.base64 ?? null,
    })

    showToast('Expense saved ✓')
    setAmount(''); setNotes(''); setLiters(''); setOdometer('')
    setPreview(null); setImageData(null); setCategory('Fuel')
    setDate(today())
    navigate({ screen: 'home' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-4 pt-4 pb-2 bg-gray-50 dark:bg-gray-950">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {isEditing ? 'Edit Expense' : 'Add Expense'}
        </h1>
        {activeVehicle && (
          <div className="flex items-center gap-2 mt-1">
            <VehicleTypeIcon type={activeVehicle.type} size={11} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Adding for: <span className="font-semibold text-gray-700 dark:text-gray-300">{activeVehicle.name}</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 scroll-view pb-nav px-4 pt-3 space-y-4">
        {/* Bill scan */}
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-4
            flex flex-col items-center gap-2 bg-white dark:bg-gray-800 active:border-primary transition-colors"
        >
          {preview ? (
            <>
              <img src={preview} className="w-full max-h-40 object-cover rounded-xl" />
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <RefreshCw size={12} /> Tap to retake
              </span>
            </>
          ) : (
            <>
              {scanning ? <Loader2 size={32} className="text-primary animate-spin" /> : <Camera size={32} className="text-gray-300" />}
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {scanning ? 'Reading bill with AI...' : 'Scan bill with AI'}
              </span>
              <span className="text-xs text-gray-400">Tap to photograph your receipt</span>
            </>
          )}
        </button>

        {/* Category */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Category</p>
          <div className="grid grid-cols-5 gap-1.5">
            {categories.map((c) => (
              <CategoryChip key={c} category={c} selected={category === c} onSelect={setCategory} />
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-9 pr-4 py-3.5 text-2xl font-bold rounded-2xl border border-black/[0.08] dark:border-white/10
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center
                focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Date & Notes */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-3 rounded-2xl border border-black/[0.08] dark:border-white/10
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm
                focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-3 rounded-2xl border border-black/[0.08] dark:border-white/10
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm
                focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Fuel extras */}
        {category === 'Fuel' && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Fuel details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold block mb-1">Liters filled</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  placeholder="0.0"
                  className="w-full px-3 py-3 rounded-2xl border border-black/[0.08] dark:border-white/10
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm
                    focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold block mb-1">Odometer (km)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="e.g. 14940"
                  className="w-full px-3 py-3 rounded-2xl border border-black/[0.08] dark:border-white/10
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm
                    focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 font-semibold block mb-1">Fuel type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl border border-black/[0.08] dark:border-white/10
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm
                  focus:outline-none focus:border-primary transition-colors"
              >
                {FUEL_TYPES.map((ft) => <option key={ft}>{ft}</option>)}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-4 bg-primary text-white font-bold text-base rounded-2xl
            active:scale-95 transition-transform shadow-lg shadow-primary/30 mt-2"
        >
          {isEditing ? 'Update Expense' : 'Save Expense'}
        </button>
      </div>
    </div>
  )
}
