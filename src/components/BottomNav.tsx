import { Home, BarChart2, Plus, Gauge, Car } from 'lucide-react'
import type { TabType, NavState } from '../types'

interface Props {
  activeTab: TabType
  navigate: (s: NavState) => void
}

const TABS: { id: TabType; Icon: typeof Home; label: string }[] = [
  { id: 'home',    Icon: Home,     label: 'Home' },
  { id: 'reports', Icon: BarChart2, label: 'Reports' },
  { id: 'add',     Icon: Plus,     label: 'Add' },
  { id: 'mileage', Icon: Gauge,    label: 'Mileage' },
  { id: 'garage',  Icon: Car,      label: 'Garage' },
]

export function BottomNav({ activeTab, navigate }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile bg-white dark:bg-gray-900
      border-t border-black/[0.07] dark:border-white/[0.07] safe-bottom z-30 flex">
      {TABS.map(({ id, Icon, label }) => {
        const isAdd = id === 'add'
        const isActive = activeTab === id

        if (isAdd) {
          return (
            <button
              key={id}
              onClick={() => navigate({ screen: 'add' })}
              className="flex-1 flex flex-col items-center justify-center pt-2 pb-1"
              aria-label="Add expense"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center -mt-5 shadow-lg shadow-primary/40">
                <Icon size={22} color="white" />
              </div>
              <span className="text-[10px] font-bold text-primary mt-1">{label}</span>
            </button>
          )
        }

        return (
          <button
            key={id}
            onClick={() => navigate({ screen: id })}
            className={`flex-1 flex flex-col items-center justify-center pt-3 pb-2 gap-1 transition-colors
              ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : ''}`}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
