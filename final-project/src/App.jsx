/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { AppContext } from './context/authContext'
import SignIn from './pages/SingIn/SignIn'
import { useEffect, useState } from 'react'
import { getUserData } from './services/user.service'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/firebase-config'
import NavBar from './components/Navigation/NavBar/NavBar';
import UserBoard from './pages/UserBoard/UserBoard';
import Register from './pages/Register/Register';
import ContentContainer from './components/Base/contentContainer/ContentContainer';
import Profile from './pages/Profile/Profile'
import CreateTeam from './pages/CreateTeam/CreateTeam'
import TeamPage from './pages/TeamPage/TeamPage'
import ChannelChatPage from './pages/ChannelChatPage/ChannelChatPage'
import UserProfile from './pages/UserProfile/UserProfile'
import DirectMessageChatPage from './pages/DirectMessageChatPage/DirectMessageChatPage'


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

  //   const userStatusDatabaseRef = ref(db, `users/${state.userData?.username}/status`);
  //   const connectedRef = ref(db, ".info/connected");

  //   onValue(connectedRef, (snapshot) => {
  //     if (!state.userData) return;
  //     if (snapshot.val() === true) {
  //         set(userStatusDatabaseRef, "online")
  //     }
  //     onDisconnect(userStatusDatabaseRef).set("offline")
  // })

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
              <Route path='/dm/:directMessagesId' element={<DirectMessageChatPage />} />
              <Route path='/teams/:teamId' element={<TeamPage />} />
              <Route path='/user/:username' element={<UserProfile />} />
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
