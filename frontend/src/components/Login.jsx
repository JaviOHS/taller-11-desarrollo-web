import { useState } from 'react'

function Login({ onLogin }) {
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
            <i className="fas fa-seedling text-4xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-white">AgriRegistro</h1>
          <p className="text-surface-400 mt-1 text-sm">Sistema de Gestión Agrícola</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-surface-300 mb-1.5">
              <i className="fas fa-envelope mr-2 text-agro-400"></i>
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-500">
                <i className="fas fa-user"></i>
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@campo.com"
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
        </form>

        {error && (
          <div className="mt-5 p-4 bg-red-900/30 border-2 border-red-800/50 rounded-xl flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-red-400 text-lg"></i>
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        <p className="text-center text-xs text-surface-500 mt-6">
          <i className="fas fa-leaf mr-1"></i>
          AgriRegistro v1.0 &copy; 2024
        </p>
      </div>
    </div>
  )
}

export default Login
