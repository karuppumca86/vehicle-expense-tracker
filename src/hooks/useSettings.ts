import { useState, useEffect, useCallback } from 'react'
import { getSetting, setSetting } from '../utils/db'

export function useSettings() {
  const [geminiApiKey, setGeminiApiKeyState] = useState('')

  useEffect(() => {
    getSetting('geminiApiKey').then((k) => setGeminiApiKeyState(k ?? ''))
  }, [])

  const setGeminiApiKey = useCallback(async (key: string) => {
    await setSetting('geminiApiKey', key)
    setGeminiApiKeyState(key)
  }, [])

  return { geminiApiKey, setGeminiApiKey }
}
