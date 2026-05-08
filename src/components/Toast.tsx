import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto
            bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 backdrop-blur-sm
            animate-in slide-in-from-top-2 duration-200"
        >
          {t.type === 'success' && <CheckCircle size={18} className="text-green-400 dark:text-green-600 flex-shrink-0" />}
          {t.type === 'error'   && <XCircle     size={18} className="text-red-400 dark:text-red-600 flex-shrink-0" />}
          {t.type === 'info'    && <Info         size={18} className="text-blue-400 dark:text-blue-600 flex-shrink-0" />}
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
