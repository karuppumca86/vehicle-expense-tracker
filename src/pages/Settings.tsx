import { useState } from 'react'
import { KeyRound, Download, Trash2, PlayCircle, Info, ArrowLeft, Coins } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { useToast } from '../contexts/ToastContext'
import { useActiveVehicle } from '../contexts/ActiveVehicleContext'
import { exportAllVehiclesCSV } from '../utils/csvExport'
import { loadDemoData } from '../utils/demoData'
import { CURRENCIES } from '../utils/currencies'
import type { NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function Settings({ navigate }: Props) {
  const { geminiApiKey, setGeminiApiKey, currencyCode, setCurrencyCode } = useSettings()
  const { showToast } = useToast()
  const { setActiveVehicle, reload } = useActiveVehicle()
  const [keyInput, setKeyInput] = useState(geminiApiKey)
  const [loading, setLoading] = useState(false)

  const handleCurrencyChange = async (code: string) => {
    await setCurrencyCode(code)
    showToast('Currency updated ✓')
  }

  const handleSaveKey = async () => {
    await setGeminiApiKey(keyInput.trim())
    showToast('API key saved ✓')
  }

  const handleLoadDemo = async () => {
    if (!confirm('This will add 2 demo vehicles with sample expenses. Continue?')) return
    setLoading(true)
    try {
      const { kia } = await loadDemoData()
      await reload()
      await setActiveVehicle(kia)
      showToast('Demo data loaded ✓')
    } catch {
      showToast('Failed to load demo data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExportAll = async () => {
    try {
      await exportAllVehiclesCSV()
      showToast('CSV exported ✓')
    } catch {
      showToast('Export failed', 'error')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-4 pb-3 bg-white dark:bg-gray-900
        border-b border-black/[0.07] dark:border-white/[0.07]">
        <button
          onClick={() => navigate({ screen: 'home' })}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Settings</h1>
      </div>

      <div className="flex-1 scroll-view pb-nav px-4 pt-3 space-y-4">
        {/* Gemini API Key */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Bill Scanning</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
            Enter your Gemini API key to enable automatic bill scanning.{' '}
            <span className="font-semibold text-primary">Get a free key at aistudio.google.com</span> — no card needed.
          </p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIza..."
            className="w-full px-4 py-3 rounded-xl border border-black/[0.08] dark:border-white/10
              bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm
              focus:outline-none focus:border-primary transition-colors mb-3"
          />
          <button
            onClick={handleSaveKey}
            className="w-full py-3 bg-primary text-white font-bold text-sm rounded-xl active:scale-95 transition-transform"
          >
            Save API Key
          </button>
        </div>

        {/* Currency */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Coins size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Currency</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => handleCurrencyChange(c.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  currencyCode === c.code
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-black/[0.08] dark:border-white/10 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-base font-bold w-6 text-center flex-shrink-0">{c.symbol}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{c.code}</p>
                  <p className="text-[10px] text-gray-400 truncate">{c.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Data */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">Data</h2>
          </div>

          <button
            onClick={handleExportAll}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-black/[0.06] dark:border-white/[0.06]"
          >
            <Download size={18} className="text-primary flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Export all vehicles</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Download CSV with all expenses</p>
            </div>
          </button>

          <button
            onClick={handleLoadDemo}
            disabled={loading}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-black/[0.06] dark:border-white/[0.06]"
          >
            <PlayCircle size={18} className="text-blue-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {loading ? 'Loading demo...' : 'Load demo data'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add 2 sample vehicles with expenses</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('This will clear all app data. This cannot be undone.')) {
                indexedDB.deleteDatabase('vehicle_tracker_db')
                window.location.reload()
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t border-black/[0.06] dark:border-white/[0.06]"
          >
            <Trash2 size={18} className="text-red-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold text-red-600">Clear all data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Permanently delete all records</p>
            </div>
          </button>
        </div>

        {/* App info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-black/[0.07] dark:border-white/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-gray-400" />
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200">About</h2>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">Vehicle Expense Tracker</p>
          <p className="text-xs text-gray-400 mt-0.5">Version 1.0.0 · Your data stays on your device</p>
        </div>
      </div>
    </div>
  )
}
