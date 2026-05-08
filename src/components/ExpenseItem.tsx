import { Pencil, Trash2 } from 'lucide-react'
import type { Expense } from '../types'
import { CATEGORIES } from '../utils/categories'
import { fmt, fmtDate } from '../utils/formatters'

interface Props {
  expense: Expense
  onDelete: (id: string) => void
  onEdit?: (id: string) => void
}

export function ExpenseItem({ expense, onDelete, onEdit }: Props) {
  const cat = CATEGORIES[expense.category]
  const Icon = cat.icon

  const handleDelete = () => {
    if (confirm('Delete this expense?')) onDelete(expense.id)
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-black/[0.06] dark:border-white/[0.06] last:border-0">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: cat.bg }}
      >
        <Icon size={18} color={cat.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {expense.category}
          {expense.notes ? ` — ${expense.notes}` : ''}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {fmtDate(expense.date)}
          {expense.liters ? ` · ${expense.liters}L` : ''}
          {expense.odometer ? ` · ${expense.odometer.toLocaleString('en-IN')} km` : ''}
        </p>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">{fmt(expense.amount)}</p>
      {onEdit && (
        <button
          onClick={() => onEdit(expense.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
            hover:text-primary hover:bg-primary/10 transition-colors flex-shrink-0"
          aria-label="Edit expense"
        >
          <Pencil size={15} />
        </button>
      )}
      <button
        onClick={handleDelete}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400
          hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
        aria-label="Delete expense"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
