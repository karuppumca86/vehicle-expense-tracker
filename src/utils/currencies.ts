export interface Currency {
  code: string
  symbol: string
  locale: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹',   locale: 'en-IN', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$',   locale: 'en-US', name: 'US Dollar' },
  { code: 'EUR', symbol: '€',   locale: 'de-DE', name: 'Euro' },
  { code: 'GBP', symbol: '£',   locale: 'en-GB', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$',  locale: 'en-SG', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$',  locale: 'en-AU', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$',  locale: 'en-CA', name: 'Canadian Dollar' },
  { code: 'MYR', symbol: 'RM',  locale: 'ms-MY', name: 'Malaysian Ringgit' },
  { code: 'JPY', symbol: '¥',   locale: 'ja-JP', name: 'Japanese Yen' },
]

export const DEFAULT_CURRENCY = CURRENCIES[0]

export const getCurrency = (code: string): Currency =>
  CURRENCIES.find((c) => c.code === code) ?? DEFAULT_CURRENCY
