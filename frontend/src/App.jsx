import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
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
  const [vista, setVista] = useState('login')

  const handleLogin = (nuevoToken) => {
    localStorage.setItem('token', nuevoToken)
    setToken(nuevoToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  if (!token) {
    if (vista === 'register') {
      return <Register onLogin={handleLogin} onIrALogin={() => setVista('login')} />
    }
    return <Login onLogin={handleLogin} onIrARegistro={() => setVista('register')} />
  }

  return <Dashboard token={token} onLogout={handleLogout} />
}

export default App
