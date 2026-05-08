import { Car, TrendingUp, BarChart2 } from 'lucide-react'
import type { NavState } from '../types'

interface Props {
  navigate: (s: NavState) => void
}

export function Welcome({ navigate }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-12"
      style={{ background: 'linear-gradient(160deg, #1D9E75 0%, #0F6E56 100%)' }}
    >
      <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mb-6 shadow-xl">
        <Car size={48} color="white" />
      </div>

      <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
        Vehicle Expense Tracker
      </h1>
      <p className="text-white/75 text-center text-base mb-12">
        Track expenses for all your vehicles
      </p>

      <div className="w-full space-y-3 mb-12">
        {[
          { icon: <Car size={20} color="#1D9E75" />, text: 'Multiple vehicles in one app' },
          { icon: <TrendingUp size={20} color="#1D9E75" />, text: 'Mileage & efficiency tracking' },
          { icon: <BarChart2 size={20} color="#1D9E75" />, text: 'Reports & expense breakdown' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <span className="text-white font-medium text-sm">{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate({ screen: 'addVehicle' })}
        className="w-full bg-white text-primary font-bold text-base py-4 rounded-2xl
          active:scale-95 transition-transform shadow-xl"
      >
        Add Your First Vehicle
      </button>
    </div>
  )
}
