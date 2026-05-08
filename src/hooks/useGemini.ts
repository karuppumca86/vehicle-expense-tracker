import { useState, useCallback } from 'react'
import type { ExpenseCategory } from '../types'

interface GeminiResult {
  amount?: number
  category?: ExpenseCategory
  date?: string | null
  liters?: number | null
  notes?: string
  fuelType?: string | null
}

async function compressImage(base64: string, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const MAX_WIDTH = 800
      const scale = Math.min(1, MAX_WIDTH / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas context unavailable')); return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1])
    }
    img.onerror = reject
    img.src = `data:${mimeType};base64,${base64}`
  })
}

export function useGemini() {
  const [scanning, setScanning] = useState(false)

  const scanBill = useCallback(async (
    base64: string,
    mimeType: string,
    apiKey: string,
  ): Promise<GeminiResult> => {
    setScanning(true)
    try {
      const compressed = await compressImage(base64, mimeType)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: compressed } },
                { text: 'This is a vehicle expense receipt. Extract and return ONLY raw JSON (no markdown, no code blocks): {"amount": <number>, "category": "<Fuel|Service|Insurance|Parking|Toll|Tyres|Repair|Wash|Accessories|Other>", "date": "<YYYY-MM-DD or null>", "liters": <number or null>, "notes": "<brief description>", "fuelType": "<Petrol|Premium Petrol|Diesel|CNG or null>"}' },
              ],
            }],
          }),
        },
      )
      const data = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] }
      const text = data.candidates[0].content.parts[0].text
      return JSON.parse(text) as GeminiResult
    } finally {
      setScanning(false)
    }
  }, [])

  return { scanning, scanBill }
}
