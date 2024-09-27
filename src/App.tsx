import { QueryClient, QueryClientProvider } from 'react-query';
import Table from './components/Table'

import "react-datepicker/dist/react-datepicker.css"
import './App.css'

// main component
function App() {
  const queryClient = new QueryClient();

  // render
  return (
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  )
}

export default App
