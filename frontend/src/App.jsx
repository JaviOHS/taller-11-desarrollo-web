import { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const getInitialToken = () => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      window.history.replaceState({}, document.title, window.location.pathname)
      return tokenFromUrl
    }
    return localStorage.getItem('token')
  }

  const [token, setToken] = useState(() => getInitialToken())

  const handleLogin = (nuevoToken) => {
    localStorage.setItem('token', nuevoToken)
    setToken(nuevoToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return <Dashboard token={token} onLogout={handleLogout} />
}

export default App
