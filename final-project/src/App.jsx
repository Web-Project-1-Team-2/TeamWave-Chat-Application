import './App.css'
import { Route, Routes } from 'react-router-dom'
import { AppContext } from './context/authContext'
import SignIn from './pages/LandingPage/LandingPage'
import { Container } from '@mui/material';
import { useEffect, useState } from 'react'
import { getUserData } from './services/user.service'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import NavBar from './components/NavBar/NavBar';
import UserBoard from './pages/UserBoard/UserBoard';
import Register from './pages/Register/Register';

function App() {

  const [state, setAppState] = useState({
    user: null,
    userData: null,
  })

  const [user] = useAuthState(auth);

  if (state.user !== user) {
    setAppState({ ...state, user: user })
  }

  useEffect(() => {
    if (!user) return;

    setTimeout(() => {
      getUserData(state.user.uid)
        .then(data => {
          const userData = data[Object.keys(data)[0]];
          setAppState({ ...state, userData: userData });
        })
    }, 50)
  }, [user])

  const width = user ? 'xl' : 'false';

  return (
    <AppContext.Provider value={{ ...state, setAppState: setAppState }}>
      {user && <NavBar />}
      <Container component='main' maxWidth={width}>
        <Routes>
          {user ? <Route path='/' element={<UserBoard />}/> : <Route path='/' element={<SignIn />}/>}
          <Route path='/register' element={<Register />} />
        </Routes>
      </Container>
    </AppContext.Provider>
  )
}

export default App
