import { useState, useEffect, useCallback } from 'react'
import type { Expense } from '../types'
import { getExpensesByVehicle, saveExpense, deleteExpense } from '../utils/db'

export function useExpenses(vehicleId: string | null) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!vehicleId) {
      setExpenses([])
      setLoading(false)
      return
    }
    const data = await getExpensesByVehicle(vehicleId)
    data.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    setExpenses(data)
    setLoading(false)
  }, [vehicleId])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  const addExpense = useCallback(async (data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> => {
    const expense: Expense = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    await saveExpense(expense)
    await load()
    return expense
  }, [load])

  const removeExpense = useCallback(async (id: string) => {
    await deleteExpense(id)
    await load()
  }, [load])

  const updateExpense = useCallback(async (expense: Expense) => {
    await saveExpense(expense)
    await load()
  }, [load])

  return { expenses, loading, addExpense, updateExpense, removeExpense, reload: load }
}
