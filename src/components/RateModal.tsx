import { useMemo, useState } from "react"
import { useQuery } from 'react-query'
import axios from 'axios'
import DatePicker from "react-datepicker"
import Chart from './Chart'
import { convertDate } from "../lib/lib"
import { RateType } from './Table.d'
import { CurrencyRatesType, CurrencyDataType } from './RateModal.d'
import { NBP_URL_RATES as NBP_URL } from "../lib/lib"


// types
type PropsType = {
  show: boolean
  onClose: () => void
  rate?: RateType
  effectiveDate: string
}


// helper
const fetchData = async (rate: RateType, from: string, to: string) => {
  const url = NBP_URL + `${rate.code}/${from}/${to}`
  const { data } = await axios.get(url)
  return data
}


// main component
const RateModal = ({ show, onClose, rate, effectiveDate }: PropsType) => {
  const [fromDate, updateFromDate] = useState<Date>(new Date())
  const [toDate, updateToDate] = useState<Date>(new Date())
  const [amountInPLN, updateAmountInPLN] = useState<number | string>(0)
  const [amountInCurrency, updateAmountInCurrency] = useState<number | string>(0)


  // helper

  const getCurrentDate = () => {
    const currentDate = new Date()
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0) 
    return currentDate
  }

  const setInitialValues = () => {
    // set dates

    const currentDate = getCurrentDate()

    const pastDate = new Date(currentDate.getTime())
    pastDate.setDate(currentDate.getDate() - 30)

    updateFromDate(pastDate)
    updateToDate(currentDate)

    // set amount
    updateAmountInCurrency(0)
    updateAmountInPLN(0)
  }


  // handlers

  const onModalCloseClick = () => {
    onClose?.()
  }

  const onFromDateChange = (date: Date | null) => {
    if (date && date.getTime() < toDate.getTime()) {
      updateFromDate(date)
    }
  }

  const onToDateChange = (date: Date | null) => {
    const currentDate = getCurrentDate()
    const maxDate = new Date(currentDate.getTime())
    maxDate.setDate(currentDate.getDate() +1)

    if (date && date.getTime() >= fromDate.getTime() && date.getTime()<maxDate.getTime())
      updateToDate(date)
  }

  const onAmountInPLNChange = (e: React.FormEvent<HTMLInputElement>) => {
    const amount = e.currentTarget.value

    if (isNaN(parseFloat(amount)))
      updateAmountInCurrency('')
    else
      updateAmountInCurrency(rate ? (parseFloat(amount) * rate.mid).toFixed(4) : 0)
    updateAmountInPLN(amount)
  }

  const onAmountInCurrencyChange = (e: React.FormEvent<HTMLInputElement>) => {
    const amount = e.currentTarget.value

    if (isNaN(parseFloat(amount)))
      updateAmountInPLN('')
    else
      updateAmountInPLN(rate ? (parseFloat(amount) / rate.mid).toFixed(4) : 0)
    updateAmountInCurrency(amount)
  }

  
  // use

  // show state changed
  useMemo(() => {
    if (show) {
      // modal is now visible
      setInitialValues()
    }
  }, [show])


  // call API

  const { data, error, isLoading } = useQuery<CurrencyDataType, Error>(['range-rates', rate, convertDate(fromDate), convertDate(toDate)], async () => await fetchData(rate!, convertDate(fromDate), convertDate(toDate)), {
    enabled: !!rate,
  })

  if (isLoading || data === null) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  if (!data)
    return null

  const rates: CurrencyRatesType = data?.rates


  // render
  return (
    <div className={`modal ${show ? 'show' : 'hide'}`}>
      <div className="modal-window" >
        <div className="modal-top-bar clickable" onClick={onModalCloseClick}>
          <strong>&times;</strong>
        </div>
        <div className="modal-content">
          <div className="modal-content-column">
            <table>
              <tbody>
                <tr>
                  <td>Currency</td>
                  <td><strong>{rate?.code}</strong> - {rate?.currency}</td>
                </tr>
                <tr>
                  <td><strong>From</strong> date</td>
                  <td>
                    <DatePicker selected={fromDate} onChange={(date) => onFromDateChange(date)} dateFormat="yyyy-MM-dd" />
                  </td>
                </tr>
                <tr>
                  <td><strong>To</strong> date</td>
                  <td>
                    <DatePicker selected={toDate} onChange={(date) => onToDateChange(date)} dateFormat="yyyy-MM-dd" />
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}><div className="v-space"></div></td>
                </tr>

                <tr>
                  <td><strong>Rate</strong> in PLN</td>
                  <td>
                    <strong>{rate?.mid}</strong> ({effectiveDate})
                  </td>
                </tr>
                <tr>
                  <td>Amount in <strong>PLN</strong></td>
                  <td>
                    <input type="text" placeholder="amount" onChange={onAmountInPLNChange} value={amountInPLN} /></td>
                </tr>
                <tr>
                  <td>Amount in <strong>{rate?.code}</strong></td>
                  <td>
                    <input type="text" placeholder="amount" onChange={onAmountInCurrencyChange} value={amountInCurrency} />
                  </td>
                </tr>

                <tr>
                  <td colSpan={2}><div className="v-space"></div></td>
                </tr>
              </tbody>
            </table>

          </div>
          <div className="modal-content-column grow">
            <Chart data={rates.map(rate => {
              return {
                date: rate.effectiveDate,
                value: rate.mid
              }
            })} />
          </div>

        </div>
        <div className="tj-sign"></div>
      </div >
    </div>
  )
}

export default RateModal