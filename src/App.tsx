import { Suspense } from 'react'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/routes'
import './App.css'
import AppLayout from './@crema/core/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
