import './App.css'
import { Route, Routes } from 'react-router-dom'
import Btn from './components/Button/Button'
// import Btn from './components/Button/Button'
import { AppContext } from './context/authContext'
import DrawerNav from './components/Drawer/Drawer'
import Register from './pages/Register/Register/Register'
import SignIn from './pages/Register/LandingPage/LandingPage'

function App() {


  return (
    <AppContext.Provider>
      <h1>Final Project</h1>
      <h2>Team 2</h2>
      <DrawerNav />
      <Routes>
        <Route path="/" element={<SignIn />} />
        {/* <Route path='/' element={} /> */}

        {/* <Route path='/userboard' element={} /> */}
        {/* <Route path='/register' element={} /> */}
      </Routes>
      {/* <Btn /> */}
      <Register />
    </AppContext.Provider>
  )
}

export default App
