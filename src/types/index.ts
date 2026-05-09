export type VehicleType = 'car' | 'bike' | 'truck' | 'van' | 'scooter' | 'other'

export type ExpenseCategory =
  | 'Fuel'
  | 'Service'
  | 'Insurance'
  | 'Parking'
  | 'Toll'
  | 'Tyres'
  | 'Repair'
  | 'Wash'
  | 'Accessories'
  | 'Chainlube'
  | 'Helmet'
  | 'Other'

export interface Vehicle {
  id: string
  name: string
  type: VehicleType
  registrationNumber: string
  defaultFuelType: string
  purchaseDate: string | null
  color: string | null
  isDefault: boolean
  createdAt: string
}

export interface Expense {
  id: string
  vehicleId: string
  category: ExpenseCategory
  amount: number
  date: string
  notes: string
  liters: number | null
  odometer: number | null
  fuelType: string | null
  billImageBase64: string | null
  billMimeType: string | null
  createdAt: string
}

export interface MileageData {
  averageKmL: number | null
  bestKmL: number | null
  measurements: { date: string; kmL: number; km: number }[]
  totalLiters: number
  totalFuelCost: number
}

export type TabType = 'home' | 'reports' | 'add' | 'mileage' | 'garage'

export type Screen =
  | 'welcome'
  | 'home'
  | 'reports'
  | 'add'
  | 'mileage'
  | 'garage'
  | 'addVehicle'
  | 'editVehicle'
  | 'editExpense'
  | 'settings'

export interface NavState {
  screen: Screen
  editVehicleId?: string
  editExpenseId?: string
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
