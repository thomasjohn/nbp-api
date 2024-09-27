import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import moment from 'moment'
import {ChartDataType} from './Chart.d'


// types
type PropsType = {
  data: ChartDataType
}


// helper

const defaultDdata = [
  { date: '2023-09-01', value: 1 },
  { date: '2023-09-13', value: 1 }
]

const formatXAxis = (tickItem: Date) => {
  return moment(tickItem).format('DD.MM.YYYY')
}

const getValuesRange = (data: ChartDataType) => {
  const values = data.map(item => item.value)
  const minValue = Math.min(...values)
  const maxValue = Math.max(...values)
  return [minValue, maxValue]
}


// main component
const ChartComponent = ({ data = defaultDdata }: PropsType) => {
  // render
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={formatXAxis}
          type="category"
        />
        <YAxis domain={getValuesRange(data)} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="black" strokeWidth="3" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ChartComponent