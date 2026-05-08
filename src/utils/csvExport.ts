import type { Expense, Vehicle } from '../types'
import { getAllExpenses, getAllVehicles } from './db'

function buildCSV(rows: string[][]): string {
  return rows
    .map((row) => row.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(','))
    .join('\n')
}

function downloadCSV(content: string, filename: string): void {
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
  a.download = filename
  a.click()
}

export function exportVehicleCSV(vehicle: Vehicle, expenses: Expense[]): void {
  const header = ['Date', 'Category', 'Amount', 'Liters', 'Odometer (km)', 'Fuel Type', 'Notes']
  const rows = [...expenses]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [
      e.date,
      e.category,
      String(e.amount),
      String(e.liters ?? ''),
      String(e.odometer ?? ''),
      e.fuelType ?? '',
      e.notes,
    ])
  const slug = vehicle.name.toLowerCase().replace(/\s+/g, '-')
  downloadCSV(buildCSV([header, ...rows]), `${slug}-expenses-${new Date().toISOString().slice(0, 10)}.csv`)
}

export async function exportAllVehiclesCSV(): Promise<void> {
  const [vehicles, expenses] = await Promise.all([getAllVehicles(), getAllExpenses()])
  const vehicleMap = new Map(vehicles.map((v) => [v.id, v.name]))
  const header = ['Vehicle', 'Date', 'Category', 'Amount', 'Liters', 'Odometer (km)', 'Fuel Type', 'Notes']
  const rows = [...expenses]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => [
      vehicleMap.get(e.vehicleId) ?? '',
      e.date,
      e.category,
      String(e.amount),
      String(e.liters ?? ''),
      String(e.odometer ?? ''),
      e.fuelType ?? '',
      e.notes,
    ])
  downloadCSV(buildCSV([header, ...rows]), `all-vehicles-expenses-${new Date().toISOString().slice(0, 10)}.csv`)
}
