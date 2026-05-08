import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Vehicle, Expense } from '../types'

interface VehicleTrackerDB extends DBSchema {
  vehicles: {
    key: string
    value: Vehicle
  }
  expenses: {
    key: string
    value: Expense
    indexes: { 'by-vehicle': string }
  }
  settings: {
    key: string
    value: { key: string; value: string }
  }
}

let dbPromise: Promise<IDBPDatabase<VehicleTrackerDB>> | null = null

function getDB(): Promise<IDBPDatabase<VehicleTrackerDB>> {
  if (!dbPromise) {
    dbPromise = openDB<VehicleTrackerDB>('vehicle_tracker_db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('vehicles')) {
          db.createObjectStore('vehicles', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('expenses')) {
          const store = db.createObjectStore('expenses', { keyPath: 'id' })
          store.createIndex('by-vehicle', 'vehicleId')
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
      },
    })
  }
  return dbPromise
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const db = await getDB()
  return db.getAll('vehicles')
}

export async function saveVehicle(vehicle: Vehicle): Promise<void> {
  const db = await getDB()
  await db.put('vehicles', vehicle)
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['vehicles', 'expenses'], 'readwrite')
  await tx.objectStore('vehicles').delete(id)
  const expStore = tx.objectStore('expenses')
  const idx = expStore.index('by-vehicle')
  let cursor = await idx.openCursor(id)
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }
  await tx.done
}

export async function getExpensesByVehicle(vehicleId: string): Promise<Expense[]> {
  const db = await getDB()
  return db.getAllFromIndex('expenses', 'by-vehicle', vehicleId)
}

export async function getAllExpenses(): Promise<Expense[]> {
  const db = await getDB()
  return db.getAll('expenses')
}

export async function saveExpense(expense: Expense): Promise<void> {
  const db = await getDB()
  await db.put('expenses', expense)
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('expenses', id)
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDB()
  const record = await db.get('settings', key)
  return record?.value ?? null
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDB()
  await db.put('settings', { key, value })
}
