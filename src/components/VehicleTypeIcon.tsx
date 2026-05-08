import type { VehicleType } from '../types'
import { VEHICLE_TYPES } from '../utils/categories'

interface Props {
  type: VehicleType
  size?: number
  className?: string
}

export function VehicleTypeIcon({ type, size = 20, className = '' }: Props) {
  const config = VEHICLE_TYPES[type]
  const Icon = config.icon
  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 ${className}`}
      style={{ background: config.bg, width: size * 2, height: size * 2 }}
    >
      <Icon size={size} color={config.color} />
    </div>
  )
}
