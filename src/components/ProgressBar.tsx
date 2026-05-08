interface Props {
  label: string
  amount: string
  percent: number
  color: string
  icon: React.ReactNode
  share?: string
}

export function ProgressBar({ label, amount, percent, color, icon, share }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
          {icon}
          {label}
        </span>
        <span className="font-bold text-gray-900 dark:text-gray-100">
          {amount}
          {share && <span className="ml-1 text-xs font-normal text-gray-400">({share})</span>}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, percent)}%`, background: color }}
        />
      </div>
    </div>
  )
}
