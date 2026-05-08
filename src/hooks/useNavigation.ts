import { useState, useCallback } from 'react'
import type { NavState } from '../types'

export function useNavigation(initial: NavState = { screen: 'home' }) {
  const [navState, setNavState] = useState<NavState>(initial)

  const navigate = useCallback((state: NavState) => {
    setNavState(state)
  }, [])

  return { navState, navigate }
}
