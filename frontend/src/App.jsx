import { useState } from 'react'
import './App.css'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='signup' element={<Signup/>}/>
          <Route path='signin' element={<Signin/>}/>
          <Route path='signup' element={<Dashboard/>}/>
          <Route path='signup' element={<SendMoney/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
