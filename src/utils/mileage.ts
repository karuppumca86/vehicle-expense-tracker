import type { Expense, MileageData } from '../types'

export function calculateMileage(expenses: Expense[]): MileageData {
  const fuelEntries = expenses
    .filter((e) => e.category === 'Fuel' && e.odometer != null && e.liters != null)
    .sort((a, b) => (a.odometer ?? 0) - (b.odometer ?? 0) || a.date.localeCompare(b.date))

  const measurements: { date: string; kmL: number; km: number }[] = []

  for (let i = 1; i < fuelEntries.length; i++) {
    const curr = fuelEntries[i]
    const prev = fuelEntries[i - 1]
    if (curr.odometer != null && prev.odometer != null && curr.liters != null && curr.liters > 0) {
      const km = curr.odometer - prev.odometer
      if (km > 0) {
        measurements.push({ date: curr.date, kmL: km / curr.liters, km })
      }
    }
  }

  const totalLiters = fuelEntries.reduce((s, e) => s + (e.liters ?? 0), 0)
  const totalFuelCost = fuelEntries.reduce((s, e) => s + e.amount, 0)
  const averageKmL =
    measurements.length > 0
      ? measurements.reduce((s, m) => s + m.kmL, 0) / measurements.length
      : null
  const bestKmL = measurements.length > 0 ? Math.max(...measurements.map((m) => m.kmL)) : null

  return { averageKmL, bestKmL, measurements, totalLiters, totalFuelCost }
}
