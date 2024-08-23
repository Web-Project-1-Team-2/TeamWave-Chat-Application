import './App.css'
import { Route, Routes } from 'react-router-dom'
import { AppContext } from './context/authContext'
import SignIn from './pages/SingIn/SignIn'
import { useEffect, useState } from 'react'
import { getUserData } from './services/user.service'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import NavBar from './components/NavBar/NavBar';
import UserBoard from './pages/UserBoard/UserBoard';
import Register from './pages/Register/Register';
import ContentContainer from './components/contentContainer/ContentContainer';
import Profile from './pages/Profile/Profile'
import CreateTeam from './pages/CreateTeam/CreateTeam'
import TeamPage from './pages/TeamPage/TeamPage'
import ChannelChatPage from './pages/ChannelChatPage/ChannelChatPage'


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
    }, 100)
  }, [user])

  return (
    <AppContext.Provider value={{ ...state, setAppState: setAppState }}>
      {user ?
        (<NavBar>
          <ContentContainer>
            <Routes>
              <Route path='/' element={<UserBoard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/createTeam' element={<CreateTeam />} />
              <Route path="/team/:teamId" element={<TeamPage />} />
              <Route path='/channel/:channelId' element={<ChannelChatPage />} />
            </Routes>
          </ContentContainer>
        </NavBar>) : (
          <Routes>
            <Route path='/' element={<SignIn />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        )}
    </AppContext.Provider>
  )
}

export default App
