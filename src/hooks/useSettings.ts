import { useState, useEffect, useCallback } from 'react'
import { getSetting, setSetting } from '../utils/db'

export function useSettings() {
  const [geminiApiKey, setGeminiApiKeyState] = useState('')
  const [currencyCode, setCurrencyCodeState] = useState('INR')

  useEffect(() => {
    getSetting('geminiApiKey').then((k) => setGeminiApiKeyState(k ?? ''))
    getSetting('currency').then((c) => setCurrencyCodeState(c ?? 'INR'))
  }, [])

  const setGeminiApiKey = useCallback(async (key: string) => {
    await setSetting('geminiApiKey', key)
    setGeminiApiKeyState(key)
  }, [])

  const setCurrencyCode = useCallback(async (code: string) => {
    await setSetting('currency', code)
    setCurrencyCodeState(code)
  }, [])

  return { geminiApiKey, setGeminiApiKey, currencyCode, setCurrencyCode }
}
