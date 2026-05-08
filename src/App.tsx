import { useEffect } from 'react'
import { ActiveVehicleProvider, useActiveVehicle } from './contexts/ActiveVehicleContext'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/Toast'
import { BottomNav } from './components/BottomNav'
import { Welcome } from './pages/Welcome'
import { Dashboard } from './pages/Dashboard'
import { AddExpense } from './pages/AddExpense'
import { Reports } from './pages/Reports'
import { Mileage } from './pages/Mileage'
import { Vehicles } from './pages/Vehicles'
import { AddVehicle } from './pages/AddVehicle'
import { Settings } from './pages/Settings'
import { useNavigation } from './hooks/useNavigation'
import type { TabType } from './types'

const TAB_SCREENS: TabType[] = ['home', 'reports', 'add', 'mileage', 'garage']

function AppShell() {
  const { vehicles, loading } = useActiveVehicle()
  const { navState, navigate } = useNavigation()

  useEffect(() => {
    if (!loading && vehicles.length === 0 && navState.screen !== 'addVehicle') {
      navigate({ screen: 'welcome' })
    }
  }, [loading, vehicles.length, navState.screen, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { screen, editVehicleId } = navState

  if (screen === 'welcome')    return <Welcome   navigate={navigate} />
  if (screen === 'addVehicle') return <AddVehicle navigate={navigate} />
  if (screen === 'editVehicle') return <AddVehicle navigate={navigate} editVehicleId={editVehicleId} />
  if (screen === 'settings')   return <Settings   navigate={navigate} />

  const activeTab = TAB_SCREENS.includes(screen as TabType) ? (screen as TabType) : 'home'

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 max-w-mobile mx-auto relative overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home'    && <Dashboard  navigate={navigate} />}
        {activeTab === 'reports' && <Reports    navigate={navigate} />}
        {activeTab === 'add'     && <AddExpense navigate={navigate} />}
        {activeTab === 'mileage' && <Mileage    navigate={navigate} />}
        {activeTab === 'garage'  && <Vehicles   navigate={navigate} />}
      </div>
      <BottomNav activeTab={activeTab} navigate={navigate} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <ActiveVehicleProvider>
        <div className="h-full bg-gray-200 dark:bg-gray-900">
          <AppShell />
          <ToastContainer />
        </div>
      </ActiveVehicleProvider>
    </ToastProvider>
  )
}
