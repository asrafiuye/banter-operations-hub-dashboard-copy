'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import en from './en.json'
import id from './id.json'

export type Locale = 'id' | 'en'
export const LOCALES: Locale[] = ['id', 'en']
export const LOCALE_COOKIE = 'banter-locale'

type Dict = { [key: string]: string | Dict }
const dictionaries: Record<Locale, Dict> = { id: id as Dict, en: en as Dict }
const intlTag: Record<Locale, string> = { id: 'id-ID', en: 'en-GB' }
const TZ = 'Asia/Jakarta'

function lookup(dict: Dict, key: string): string | undefined {
  let node: string | Dict | undefined = dict
  for (const part of key.split('.')) {
    if (!node || typeof node === 'string') return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

export type TFunction = (key: string, vars?: Record<string, string | number>) => string

function toDate(value: string) {
  return new Date(value.length === 10 ? `${value}T00:00:00+07:00` : value)
}

function createFormatters(locale: Locale) {
  const tag = intlTag[locale]
  const money = new Intl.NumberFormat(tag, {
    style: 'currency',
    currency: 'IDR',
    currencyDisplay: locale === 'id' ? 'symbol' : 'code',
    maximumFractionDigits: 0,
  })
  const compact = new Intl.NumberFormat(tag, { notation: 'compact', maximumFractionDigits: 1 })
  const number = new Intl.NumberFormat(tag, { maximumFractionDigits: 2 })
  const pct = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 })
  const date = new Intl.DateTimeFormat(tag, { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ })
  const dateNum = new Intl.DateTimeFormat(tag, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ })
  const dayMonth = new Intl.DateTimeFormat(tag, { day: '2-digit', month: 'short', timeZone: TZ })
  const weekday = new Intl.DateTimeFormat(tag, { weekday: 'short', timeZone: TZ })
  const weekdayLong = new Intl.DateTimeFormat(tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ })
  const time = new Intl.DateTimeFormat(tag, { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ })
  const monthYear = new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric', timeZone: TZ })
  const monthShort = new Intl.DateTimeFormat(tag, { month: 'short', timeZone: TZ })

  return {
    money: (n: number) => money.format(n),
    moneyCompact: (n: number) => `${locale === 'id' ? 'Rp' : 'IDR'} ${compact.format(n)}`,
    number: (n: number) => number.format(n),
    percent: (n: number) => `${pct.format(n)}%`,
    date: (v?: string) => (v ? date.format(toDate(v)) : '—'),
    dateNumeric: (v?: string) => (v ? dateNum.format(toDate(v)) : '—'),
    dayMonth: (v: string) => dayMonth.format(toDate(v)),
    weekday: (v: string) => weekday.format(toDate(v)),
    longDate: (v: string) => weekdayLong.format(toDate(v)),
    time: (v?: string) => (v ? time.format(toDate(v)) : '—'),
    dateTime: (v?: string) => (v ? `${date.format(toDate(v))}, ${time.format(toDate(v))}` : '—'),
    monthYear: (period: string) => monthYear.format(toDate(`${period.slice(0, 7)}-01`)),
    monthShort: (period: string) => monthShort.format(toDate(`${period.slice(0, 7)}-01`)),
  }
}

export type Formatters = ReturnType<typeof createFormatters>

interface I18nValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: TFunction
  fmt: Formatters
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = l
  }, [])

  const t = useCallback<TFunction>(
    (key, vars) => {
      const raw = lookup(dictionaries[locale], key) ?? lookup(dictionaries.id, key)
      if (raw === undefined) {
        if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] missing key: ${key}`)
        return key
      }
      if (!vars) return raw
      return raw.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`))
    },
    [locale],
  )

  const fmt = useMemo(() => createFormatters(locale), [locale])
  const value = useMemo(() => ({ locale, setLocale, t, fmt }), [locale, setLocale, t, fmt])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
