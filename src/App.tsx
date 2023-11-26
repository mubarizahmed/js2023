import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar.tsx'
import Rollcall from './pages/Rollcall.tsx'

function App() {
  const [count, setCount] = useState(0)

  // set dark theme on page load
  document.body.classList.add('dark')

  return (
    <>
      <Navbar />
      <Rollcall />
    </>
  )
}

export default App
