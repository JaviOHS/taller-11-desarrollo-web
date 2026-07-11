import { useState, useRef, useEffect } from 'react'
import AuthCard from './components/AuthCard'
import Dashboard from './components/Dashboard'
import PublicEvents from './components/PublicEvents'
import MyEvents from './components/MyEvents'
import Notification from './components/Notification'
import { useDarkMode } from './hooks/useDarkMode'
import { useParticles } from './hooks/useParticles'

function App() {
  const [notificacion, setNotificacion] = useState(null)
  const tokenVieneDeUrl = useRef(false)

  const notificar = (mensaje, tipo = 'success', duracion = 3000) => {
    setNotificacion({ mensaje, tipo, duracion })
  }

  const getInitialToken = () => {
    const params = new URLSearchParams(window.location.search)
    const tokenFromUrl = params.get('token')
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl)
      window.history.replaceState({}, document.title, window.location.pathname)
      tokenVieneDeUrl.current = true
      return tokenFromUrl
    }
    return localStorage.getItem('token')
  }

  const [token, setToken] = useState(() => getInitialToken())
  const [vistaApp, setVistaApp] = useState('perfil')
  const [dark, setDark] = useDarkMode()
  useParticles('particles-js', dark, !!token)

  useEffect(() => {
    if (tokenVieneDeUrl.current) {
      notificar('Inicio de sesión exitoso')
    }
  }, [])

  const handleLogin = (nuevoToken) => {
    localStorage.setItem('token', nuevoToken)
    setToken(nuevoToken)
    notificar('Inicio de sesión exitoso')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setVistaApp('perfil')
    notificar('Sesión cerrada')
  }

  if (!token) {
    return (
      <>
        <Notification notificacion={notificacion} onCerrar={() => setNotificacion(null)} />
        <AuthCard onLogin={handleLogin} onNotificar={notificar} />
      </>
    )
  }

  const tabs = [
    { id: 'perfil', label: 'Mi Perfil', icon: 'fa-user' },
    { id: 'mis-eventos', label: 'Mis Eventos', icon: 'fa-calendar-days' },
    { id: 'publicos', label: 'Eventos Públicos', icon: 'fa-globe' }
  ]

  return (
    <div className="min-h-screen relative z-0 overflow-x-hidden transition-colors duration-200">
      <div id="particles-js" className="fixed inset-0 -z-10 pointer-events-none"></div>
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-agro-200/40 dark:bg-agro-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-teal-200/40 dark:bg-agro-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-agro-100/50 dark:bg-agro-900/5 rounded-full blur-3xl"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-6 py-3">
        <nav className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap px-4 sm:px-5 py-2.5 rounded-full bg-white/75 dark:bg-ink-900/90 backdrop-blur-xl backdrop-saturate-150 border border-agro-900/10 dark:border-white/5 shadow-[0_1px_3px_rgba(0,0,0,.04),0_8px_32px_rgba(0,0,0,.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,.45),0_8px_32px_rgba(0,0,0,.35)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-agro-500 to-agro-700 rounded-xl flex items-center justify-center shadow-md shadow-agro-500/20 shrink-0">
              <i className="fas fa-calendar-check text-white text-sm"></i>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-bold text-sm text-surface-900 dark:text-white tracking-tight">EventMila</span>
              <span className="text-[9px] font-medium tracking-widest uppercase text-surface-500 dark:text-surface-500">Gestión de Eventos</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-100/80 dark:bg-white/[0.03] rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVistaApp(tab.id)}
                className={`flex items-center gap-2 font-semibold py-2 px-3 sm:px-4 rounded-full transition-all duration-200 text-sm ${
                  vistaApp === tab.id
                    ? 'bg-white dark:bg-ink-800 text-agro-700 dark:text-agro-400 shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                }`}
              >
                <i className={`fas ${tab.icon}`}></i>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              title="Cambiar modo"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-agro-900/5 dark:bg-white/5 border border-agro-900/10 dark:border-white/5 text-surface-500 dark:text-yellow-400 hover:bg-agro-900/10 dark:hover:bg-white/10 transition-all duration-200"
            >
              <i className={`fas ${dark ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 font-semibold py-2 px-3 sm:px-4 rounded-full transition-all duration-200 text-sm"
            >
              <i className="fas fa-right-from-bracket"></i>
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </nav>
      </header>

      <div className="h-[76px]"></div>

      <Notification notificacion={notificacion} onCerrar={() => setNotificacion(null)} />

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-[4]">
        {vistaApp === 'perfil' && <Dashboard token={token} />}
        {vistaApp === 'mis-eventos' && <MyEvents token={token} onNotificar={notificar} />}
        {vistaApp === 'publicos' && <PublicEvents />}
      </main>
    </div>
  )
}

export default App
