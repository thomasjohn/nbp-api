import { useState } from "react"
import { useQuery } from 'react-query'
import axios from 'axios'
import RateModal from './RateModal'
import { RatesType, DataType } from './Table.d'
import { NBP_URL_TABLES as NBP_URL } from "../lib/lib"

// helper
const fetchData = async () => {
  const { data } = await axios.get(NBP_URL)
  console.log(data)
  return data
}


// main component
const Table = () => {
  const [selectedCurrencyCode, updateSelectedCurrencyCode] = useState<string>()
  const [rateModalShow, updateRateModalShow] = useState(false)

  const onRateClick = (code: string) => {
    updateSelectedCurrencyCode(code)
    updateRateModalShow(true)
  }

  const onRateModalClose = () => {
    updateRateModalShow(false)
  }


  // call API

  const { data, error, isLoading } = useQuery<DataType, Error>(['current-rates'], fetchData)
  console.log(data, error, isLoading)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  const rates: RatesType = data![0]?.rates
  const effectiveDate: string = data![0]?.effectiveDate


  // test

  console.log(rates)

  // render
  return (
    <div>

      <table>
        <thead>
          <tr>
            <th className="padding-left">Currency</th>
            <th>Code</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate, idx) => {
            return (
              <tr className="clickable" key={`rate-${idx}`} onClick={() => onRateClick(rate.code)}>
                <td className="padding-left">{rate.currency}</td>
                <td>{rate.code}</td>
                <td>{rate.mid}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <RateModal show={rateModalShow} onClose={onRateModalClose} rate={rates.find(rate => rate.code === selectedCurrencyCode)}
        effectiveDate={effectiveDate} />

    </div>
  )
}

export default Table