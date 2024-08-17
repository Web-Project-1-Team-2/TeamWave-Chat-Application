import './App.css'
import { Route, Routes } from 'react-router-dom'
import Btn from './components/Button/Button'
import { AppContext } from './context/authContext'
import DrawerNav from './components/Drawer/Drawer'
import Register from './pages/Register/Register'
import SignIn from './pages/Register/LandingPage/LandingPage'
import { Container } from '@mui/material';

function App() {


  return (
    <AppContext.Provider>
      {/* <DrawerNav /> */}
      <Container maxWidth="xl">
      <h1>Final Project</h1>
      <h2>Team 2</h2>
      <Routes>
        {/* <Route path='/' element={} />
        <Route path='/userboard' element={} /> */}
        <Route path='/register' element={<Register />} />
        <Route path="/" element={<SignIn />} />
        {/* <Route path='/' element={} /> */}

        {/* <Route path='/userboard' element={} /> */}
        {/* <Route path='/register' element={} /> */}
      </Routes>
            {/* <Btn /> */}
      </Container>

      {/* <Btn /> */}
      <Register />
    </AppContext.Provider>
  )
}

export default App
