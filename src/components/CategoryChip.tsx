import type { ExpenseCategory } from '../types'
import { CATEGORIES } from '../utils/categories'

interface Props {
  category: ExpenseCategory
  selected: boolean
  onSelect: (c: ExpenseCategory) => void
}

export function CategoryChip({ category, selected, onSelect }: Props) {
  const cfg = CATEGORIES[category]
  const Icon = cfg.icon

  return (
    <button
      onClick={() => onSelect(category)}
      className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-[1.5px] text-[10px] font-semibold
        transition-all active:scale-95 ${
          selected
            ? 'border-primary text-primary dark:text-primary'
            : 'border-black/[0.08] dark:border-white/10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800'
        }`}
      style={selected ? { background: cfg.bg } : {}}
    >
      <Icon size={20} color={selected ? cfg.color : undefined} />
      {cfg.label}
    </button>
  )
}
