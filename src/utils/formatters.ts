export const fmt = (n: number): string =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const fmtDate = (dateStr: string): string =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const fmtShortDate = (dateStr: string): string =>
  new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })

export const today = (): string => new Date().toISOString().slice(0, 10)

export const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const filterByPeriod = <T extends { date: string }>(
  items: T[],
  period: 'week' | 'month' | 'year' | 'all',
): T[] => {
  const now = new Date()
  return items.filter((item) => {
    const d = new Date(item.date + 'T00:00:00')
    if (period === 'week') {
      const start = new Date(now)
      start.setDate(start.getDate() - 6)
      return d >= start
    }
    if (period === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }
    if (period === 'year') return d.getFullYear() === now.getFullYear()
    return true
  })
}
