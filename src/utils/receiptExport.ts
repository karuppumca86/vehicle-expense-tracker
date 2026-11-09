import { zipSync, type Zippable } from 'fflate'
import type { Expense, Vehicle } from '../types'
import { today } from './formatters'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function extFromMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/heic':
      return 'heic'
    case 'application/pdf':
      return 'pdf'
    default:
      return 'bin'
  }
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function hasReceipts(expenses: Expense[]): boolean {
  return expenses.some((e) => !!e.billImageBase64)
}

/**
 * Downloads a ZIP of all receipts in `expenses`, grouped into month folders
 * (e.g. `2026-11_November/fuel_09-11-2026.jpg`). Returns the number of receipts.
 */
export function exportVehicleReceiptsZip(vehicle: Vehicle, expenses: Expense[]): number {
  const withBills = expenses
    .filter((e) => !!e.billImageBase64)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))

  const tree: Record<string, Record<string, Uint8Array>> = {}

  for (const e of withBills) {
    const [yyyy, mm, dd] = e.date.split('-')
    const folder = `${yyyy}-${mm}_${MONTH_NAMES[Number(mm) - 1]}`
    const ext = extFromMime(e.billMimeType ?? 'image/jpeg')
    const base = `${e.category.toLowerCase()}_${dd}-${mm}-${yyyy}`

    const files = (tree[folder] ??= {})
    let name = `${base}.${ext}`
    for (let n = 2; files[name]; n++) name = `${base}_${n}.${ext}`
    files[name] = base64ToBytes(e.billImageBase64!)
  }

  if (withBills.length === 0) return 0

  const zipped = zipSync(tree as Zippable, { level: 0 })
  const blob = new Blob([zipped], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const slug = vehicle.name.toLowerCase().replace(/\s+/g, '-')
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug}-receipts-${today()}.zip`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return withBills.length
}
