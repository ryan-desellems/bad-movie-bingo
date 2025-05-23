import './App.css'
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Bingo from './pages/Bingo'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/bingo/:seed?" element={<Bingo/>} />
    </Routes>
  )
}

export default App
