interface Props {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function StatCard({ label, value, sub, accent }: Props) {
  if (accent) {
    return (
      <div className="rounded-2xl p-4" style={{ background: '#1D9E75' }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/75">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 leading-tight">{value}</p>
        {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
      </div>
    )
  }
  return (
    <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-black/[0.07] dark:border-white/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 leading-tight">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}
