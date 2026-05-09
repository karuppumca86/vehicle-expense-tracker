import type { Vehicle, Expense, ExpenseCategory } from '../types'
import { saveVehicle, saveExpense } from './db'
import { daysAgo } from './formatters'

function exp(
  vehicleId: string,
  category: ExpenseCategory,
  amount: number,
  date: string,
  extra: Partial<Expense> = {},
): Expense {
  return {
    id: crypto.randomUUID(),
    vehicleId,
    category,
    amount,
    date,
    notes: '',
    liters: null,
    odometer: null,
    fuelType: null,
    billImageBase64: null,
    billMimeType: null,
    createdAt: new Date().toISOString(),
    ...extra,
  }
}

export async function loadDemoData(): Promise<{ kia: Vehicle; re: Vehicle }> {
  const kia: Vehicle = {
    id: crypto.randomUUID(),
    name: 'Kia Seltos GTX',
    type: 'car',
    registrationNumber: 'TN 45 AB 1234',
    defaultFuelType: 'Petrol',
    purchaseDate: '2023-06-01',
    color: '#1D9E75',
    isDefault: true,
    createdAt: new Date().toISOString(),
  }

  const re: Vehicle = {
    id: crypto.randomUUID(),
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    registrationNumber: 'TN 45 CD 5678',
    defaultFuelType: 'Petrol',
    purchaseDate: '2022-03-15',
    color: '#185FA5',
    isDefault: false,
    createdAt: new Date(Date.now() + 1).toISOString(),
  }

  await saveVehicle(kia)
  await saveVehicle(re)

  const kiaExpenses: Expense[] = [
    exp(kia.id, 'Fuel', 2300, daysAgo(42), { liters: 17.0, odometer: 13200, fuelType: 'Petrol', notes: 'Indian Oil, Velachery' }),
    exp(kia.id, 'Fuel', 2200, daysAgo(28), { liters: 16.2, odometer: 13650, fuelType: 'Petrol', notes: 'Indian Oil, Velachery' }),
    exp(kia.id, 'Fuel', 2400, daysAgo(18), { liters: 17.8, odometer: 14080, fuelType: 'Petrol', notes: 'HP Bunk, Palani' }),
    exp(kia.id, 'Fuel', 2500, daysAgo(7),  { liters: 18.5, odometer: 14510, fuelType: 'Petrol', notes: 'HP Bunk, Velachery' }),
    exp(kia.id, 'Toll', 340, daysAgo(30), { notes: 'Chennai–Palani FASTag' }),
    exp(kia.id, 'Toll', 340, daysAgo(15), { notes: 'Chennai–Palani FASTag' }),
    exp(kia.id, 'Service', 8500, daysAgo(35), { odometer: 13500, notes: '1st free service – Kia dealer' }),
    exp(kia.id, 'Parking', 100, daysAgo(20), { notes: 'Office parking' }),
    exp(kia.id, 'Wash', 500, daysAgo(22), { notes: 'Premium car spa' }),
    exp(kia.id, 'Insurance', 18500, daysAgo(45), { notes: 'Annual renewal – HDFC Ergo' }),
    exp(kia.id, 'Tyres', 3200, daysAgo(40), { notes: 'Front tyre rotation' }),
  ]

  const reExpenses: Expense[] = [
    exp(re.id, 'Fuel', 1620, daysAgo(28), { liters: 12.0, odometer: 8200, fuelType: 'Petrol', notes: 'Indian Oil' }),
    exp(re.id, 'Fuel', 1593, daysAgo(18), { liters: 11.8, odometer: 8520, fuelType: 'Petrol', notes: 'HP Bunk' }),
    exp(re.id, 'Fuel', 1647, daysAgo(7),  { liters: 12.2, odometer: 8840, fuelType: 'Petrol', notes: 'HP Bunk' }),
    exp(re.id, 'Service', 2500, daysAgo(25), { notes: 'Regular service' }),
    exp(re.id, 'Chainlube', 150, daysAgo(14), { notes: 'Chain lubrication' }),
    exp(re.id, 'Tyres', 2800, daysAgo(20), { notes: 'Rear tyre replacement' }),
    exp(re.id, 'Accessories', 800, daysAgo(10), { notes: 'Saddlebag' }),
  ]

  for (const e of [...kiaExpenses, ...reExpenses]) {
    await saveExpense(e)
  }

  return { kia, re }
}
