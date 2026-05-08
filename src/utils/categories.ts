import {
  Fuel, Settings, Shield, MapPin, Circle, Wrench, Droplets,
  Package, Link, HardHat, MoreHorizontal, Car, Bike, Truck, Bus, Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ExpenseCategory, VehicleType } from '../types'

export interface CategoryConfig {
  icon: LucideIcon
  color: string
  bg: string
  label: string
}

export interface VehicleTypeConfig {
  icon: LucideIcon
  color: string
  bg: string
  label: string
}

export const CATEGORIES: Record<ExpenseCategory, CategoryConfig> = {
  Fuel:        { icon: Fuel,            color: '#1D9E75', bg: '#E1F5EE', label: 'Fuel' },
  Service:     { icon: Settings,        color: '#185FA5', bg: '#E6F1FB', label: 'Service' },
  Insurance:   { icon: Shield,          color: '#854F0B', bg: '#FAEEDA', label: 'Insurance' },
  Parking:     { icon: MapPin,          color: '#3C3489', bg: '#EEEDFE', label: 'Parking' },
  Toll:        { icon: MapPin,          color: '#633806', bg: '#FAF3DD', label: 'Toll' },
  Tyres:       { icon: Circle,          color: '#3B6D11', bg: '#EAF3DE', label: 'Tyres' },
  Repair:      { icon: Wrench,          color: '#A32D2D', bg: '#FCEBEB', label: 'Repair' },
  Wash:        { icon: Droplets,        color: '#0C447C', bg: '#DCEEFF', label: 'Wash' },
  Accessories: { icon: Package,         color: '#5F5E5A', bg: '#F1EFE8', label: 'Accessories' },
  Chainlube:   { icon: Link,            color: '#854F0B', bg: '#FAEEDA', label: 'Chainlube' },
  Helmet:      { icon: HardHat,         color: '#633806', bg: '#FAF3DD', label: 'Helmet' },
  Other:       { icon: MoreHorizontal,  color: '#888780', bg: '#F1EFE8', label: 'Other' },
}

export const VEHICLE_TYPES: Record<VehicleType, VehicleTypeConfig> = {
  car:     { icon: Car,    color: '#1D9E75', bg: '#E1F5EE', label: 'Car' },
  bike:    { icon: Bike,   color: '#185FA5', bg: '#E6F1FB', label: 'Bike' },
  truck:   { icon: Truck,  color: '#854F0B', bg: '#FAEEDA', label: 'Truck' },
  van:     { icon: Bus,    color: '#3C3489', bg: '#EEEDFE', label: 'Van' },
  scooter: { icon: Zap,    color: '#A32D2D', bg: '#FCEBEB', label: 'Scooter' },
  other:   { icon: Circle, color: '#888780', bg: '#F1EFE8', label: 'Other' },
}

export const BASE_CATEGORIES: ExpenseCategory[] = [
  'Fuel', 'Service', 'Insurance', 'Parking', 'Toll',
  'Tyres', 'Repair', 'Wash', 'Accessories', 'Other',
]

export const BIKE_EXTRA_CATEGORIES: ExpenseCategory[] = ['Chainlube', 'Helmet']

export const FUEL_TYPES = ['Petrol', 'Premium Petrol', 'Diesel', 'CNG', 'Electric'] as const

export const PRESET_COLORS = [
  '#1D9E75', '#185FA5', '#854F0B', '#3C3489',
  '#A32D2D', '#3B6D11', '#0C447C', '#5F5E5A',
]
