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

/** Some upload portals reject files over 2 MB, so every exported receipt must stay below this. */
export const MAX_RECEIPT_BYTES = 2 * 1024 * 1024
const TARGET_BYTES = 1.9 * 1024 * 1024
const START_MAX_SIDE = 2500
const MIN_SIDE = 800
const QUALITIES = [0.85, 0.75, 0.65, 0.55]

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', quality),
  )
}

/** Re-encodes an image as JPEG (and downsizes if needed) until it fits under the 2 MB limit. */
async function shrinkImage(bytes: Uint8Array, mime: string): Promise<{ bytes: Uint8Array; ext: string }> {
  if (bytes.length <= MAX_RECEIPT_BYTES) return { bytes, ext: extFromMime(mime) }

  const bitmap = await createImageBitmap(new Blob([bytes as BlobPart], { type: mime }))
  try {
    let scale = Math.min(1, START_MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas context')

    while (Math.max(bitmap.width, bitmap.height) * scale >= MIN_SIDE) {
      canvas.width = Math.round(bitmap.width * scale)
      canvas.height = Math.round(bitmap.height * scale)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      for (const q of QUALITIES) {
        const blob = await canvasToJpeg(canvas, q)
        if (blob.size <= TARGET_BYTES) return { bytes: new Uint8Array(await blob.arrayBuffer()), ext: 'jpg' }
      }
      scale *= 0.8
    }
    throw new Error('could not reduce below 2 MB')
  } finally {
    bitmap.close()
  }
}

export function hasReceipts(expenses: Expense[]): boolean {
  return expenses.some((e) => !!e.billImageBase64)
}

export interface ReceiptExportResult {
  count: number
  skippedPdfs: number
  skippedImages: number
}

/**
 * Downloads a ZIP of all receipts in `expenses`, grouped into month folders
 * (e.g. `2026-11_November/fuel_09-11-2026.jpg`). Images over 2 MB are reduced
 * to fit; PDFs over 2 MB (and images that can't be reduced) are skipped.
 */
export async function exportVehicleReceiptsZip(vehicle: Vehicle, expenses: Expense[]): Promise<ReceiptExportResult> {
  const withBills = expenses
    .filter((e) => !!e.billImageBase64)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))

  const tree: Record<string, Record<string, Uint8Array>> = {}
  const result: ReceiptExportResult = { count: 0, skippedPdfs: 0, skippedImages: 0 }

  for (const e of withBills) {
    const mime = e.billMimeType ?? 'image/jpeg'
    let bytes = base64ToBytes(e.billImageBase64!)
    let ext = extFromMime(mime)

    if (mime === 'application/pdf') {
      if (bytes.length > MAX_RECEIPT_BYTES) { result.skippedPdfs++; continue }
    } else {
      try {
        ;({ bytes, ext } = await shrinkImage(bytes, mime))
      } catch {
        result.skippedImages++
        continue
      }
    }

    const [yyyy, mm, dd] = e.date.split('-')
    const folder = `${yyyy}-${mm}_${MONTH_NAMES[Number(mm) - 1]}`
    const base = `${e.category.toLowerCase()}_${dd}-${mm}-${yyyy}`

    const files = (tree[folder] ??= {})
    let name = `${base}.${ext}`
    for (let n = 2; files[name]; n++) name = `${base}_${n}.${ext}`
    files[name] = bytes
    result.count++
  }

  if (result.count === 0) return result

  const zipped = zipSync(tree as Zippable, { level: 0 })
  const blob = new Blob([zipped], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const slug = vehicle.name.toLowerCase().replace(/\s+/g, '-')
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug}-receipts-${today()}.zip`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return result
}
