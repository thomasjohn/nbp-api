export type RateType = {
  currency: string
  code: string
  mid: number
}

export type RatesType = RateType[]

export type DataType = {
  table: string
  no: string
  effectiveDate: string
  rates: RatesType
}[]