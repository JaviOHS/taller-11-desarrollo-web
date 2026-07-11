import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import PublicEvents from './components/PublicEvents'
import MyEvents from './components/MyEvents'

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
  const [vistaApp, setVistaApp] = useState('perfil')

  const handleLogin = (nuevoToken) => {
    localStorage.setItem('token', nuevoToken)
    setToken(nuevoToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setVistaApp('perfil')
  }

  if (!token) {
    if (vista === 'register') {
      return <Register onLogin={handleLogin} onIrALogin={() => setVista('login')} />
    }
    return <Login onLogin={handleLogin} onIrARegistro={() => setVista('register')} />
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <nav className="bg-surface-800 shadow-lg shadow-black/20 border-b border-surface-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-agro-500 to-agro-700 rounded-xl flex items-center justify-center shadow-md shadow-agro-500/20">
              <i className="fas fa-calendar-check text-white text-lg"></i>
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">EventMila</h2>
              <p className="text-xs text-surface-400 leading-tight">Gestión de Eventos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVistaApp('perfil')}
              className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm ${
                vistaApp === 'perfil'
                  ? 'bg-agro-600 text-white shadow-md shadow-agro-600/20'
                  : 'bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600'
              }`}
            >
              <i className="fas fa-user"></i>
              <span className="hidden sm:inline">Mi Perfil</span>
            </button>
            <button
              onClick={() => setVistaApp('mis-eventos')}
              className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm ${
                vistaApp === 'mis-eventos'
                  ? 'bg-agro-600 text-white shadow-md shadow-agro-600/20'
                  : 'bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600'
              }`}
            >
              <i className="fas fa-calendar-days"></i>
              <span className="hidden sm:inline">Mis Eventos</span>
            </button>
            <button
              onClick={() => setVistaApp('publicos')}
              className={`flex items-center gap-2 font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm ${
                vistaApp === 'publicos'
                  ? 'bg-agro-600 text-white shadow-md shadow-agro-600/20'
                  : 'bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600'
              }`}
            >
              <i className="fas fa-globe"></i>
              <span className="hidden sm:inline">Eventos Públicos</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 border-2 border-red-800/50 hover:border-red-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm"
            >
              <i className="fas fa-right-from-bracket"></i>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {vistaApp === 'perfil' && <Dashboard token={token} />}
        {vistaApp === 'mis-eventos' && <MyEvents token={token} />}
        {vistaApp === 'publicos' && <PublicEvents />}
      </main>
    </div>
  )
}

export default App
