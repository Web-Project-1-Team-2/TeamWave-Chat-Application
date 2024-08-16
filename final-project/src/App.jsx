import './App.css'
import Btn from './components/Button/Button'
import { AppContext } from './context/authContext'

function App() {

  
  return (
    <AppContext.Provider>
            <h1>Website</h1>
            <Btn />
    </AppContext.Provider>
  )
}

export default App
