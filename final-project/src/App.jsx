import './App.css'
// import Btn from './components/Button/Button'
import { AppContext } from './context/authContext'
import Register from './pages/Register/Register'

function App() {

  
  return (
    <AppContext.Provider>
            <h1>Website</h1>
            {/* <Btn /> */}
            <Register />
    </AppContext.Provider>
  )
}

export default App
