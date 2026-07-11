import { useState } from 'react'

function Login({ onLogin, onIrARegistro }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onLogin(data.token)
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="bg-surface-800 rounded-2xl shadow-2xl shadow-black/40 border border-surface-700 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-agro-500 to-agro-700 rounded-2xl mb-4 shadow-lg shadow-agro-500/20">
            <i className="fas fa-calendar-alt text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-white">EventMila</h1>
          <p className="text-surface-400 mt-1 text-sm">Gestiona tus eventos fácilmente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-surface-300 mb-1.5">
              <i className="fas fa-envelope mr-2 text-agro-400"></i>
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-500">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                className="w-full pl-10 pr-4 py-3 bg-surface-700 border-2 border-surface-600 rounded-xl focus:border-agro-500 focus:ring-2 focus:ring-agro-500/20 outline-none transition-all text-white placeholder-surface-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-surface-300 mb-1.5">
              <i className="fas fa-lock mr-2 text-agro-400"></i>
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-500">
                <i className="fas fa-key"></i>
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full pl-10 pr-4 py-3 bg-surface-700 border-2 border-surface-600 rounded-xl focus:border-agro-500 focus:ring-2 focus:ring-agro-500/20 outline-none transition-all text-white placeholder-surface-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-agro-600 to-agro-700 hover:from-agro-500 hover:to-agro-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-agro-600/20 hover:shadow-xl hover:shadow-agro-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Ingresando...
              </>
            ) : (
              <>
                <i className="fas fa-right-to-bracket"></i>
                Iniciar Sesión
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-600"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-800 px-3 text-surface-400 font-semibold">O CONTINÚA CON</span>
            </div>
          </div>

          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Ingresar con Google
          </a>
        </form>

        {error && (
          <div className="mt-5 p-4 bg-red-900/30 border-2 border-red-800/50 rounded-xl flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-red-400 text-lg"></i>
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        <p className="text-center text-sm text-surface-400 mt-6">
          ¿No tienes cuenta?{' '}
          <button onClick={onIrARegistro} className="text-agro-400 hover:text-agro-300 font-semibold underline transition-colors">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
