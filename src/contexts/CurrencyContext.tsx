import { createContext, useContext, useMemo } from 'react'
import { useSettings } from '../hooks/useSettings'
import { getCurrency } from '../utils/currencies'
import type { Currency } from '../utils/currencies'

interface CurrencyContextValue {
  currency: Currency
  fmt: (n: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: getCurrency('INR'),
  fmt: (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { currencyCode } = useSettings()
  const currency = getCurrency(currencyCode)

  const fmt = useMemo(
    () => (n: number) =>
      currency.symbol + Number(n).toLocaleString(currency.locale, { maximumFractionDigits: 0 }),
    [currency]
  )

  return (
    <CurrencyContext.Provider value={{ currency, fmt }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
