export type CurrencyRateType = {
  no: string
  mid: number
  effectiveDate: string
}

export type CurrencyRatesType = CurrencyRateType[]

export type CurrencyDataType = {
  code: string
  currency: string
  table: string
  rates: CurrencyRatesType
}