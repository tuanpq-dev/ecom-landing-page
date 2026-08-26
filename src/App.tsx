import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/routes'
import './App.css'
import AppLayout from './@crema/core/AppLayout'
import { socketIO } from './socket/socket.io'

function App() {
  useEffect(() => {
    const socket = socketIO();

    const handleServer = (value: any) => {
      console.log("update_server event received:", value);
      const displayMsg = typeof value === "object" ? JSON.stringify(value, null, 2) : value;
      alert(displayMsg);
    }
    socket.on('update_server', handleServer);

    return () => {
      socket.off('update_server', handleServer);
    }
  }, [])
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
