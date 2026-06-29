import { useState, useEffect } from 'react'

function Dashboard({ token, onLogout }) {
  const [perfil, setPerfil] = useState(null)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    console.log('=== JWT GENERADO ===')
    console.log(token)
  }, [token])

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        const res = await fetch('/api/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setPerfil(data.usuario)
      } catch (err) {
        setError(err.message || 'Error al obtener perfil')
      }
    }
    obtenerPerfil()
  }, [token])

  const copiarToken = () => {
    navigator.clipboard.writeText(token)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <nav className="bg-surface-800 shadow-lg shadow-black/20 border-b border-surface-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-agro-500 to-agro-700 rounded-xl flex items-center justify-center shadow-md shadow-agro-500/20">
              <i className="fas fa-seedling text-white text-lg"></i>
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">AgriRegistro</h2>
              <p className="text-xs text-surface-400 leading-tight">Panel de Control</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 border-2 border-red-800/50 hover:border-red-700 font-semibold py-2 px-4 rounded-xl transition-all duration-200"
          >
            <i className="fas fa-right-from-bracket"></i>
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border-2 border-red-800/50 rounded-xl flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-red-400 text-lg"></i>
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {perfil && (
          <>
            <div className="bg-surface-800 rounded-2xl shadow-xl shadow-black/20 border border-surface-700 p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-agro-400 to-agro-600 rounded-2xl flex items-center justify-center shadow-lg shadow-agro-500/20">
                  <i className="fas fa-user-circle text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{perfil.nombre}</h3>
                  <p className="text-surface-400 text-sm flex items-center gap-1">
                    <i className="fas fa-envelope"></i>
                    {perfil.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface-700/50 rounded-xl p-4 border border-surface-600">
                  <p className="text-xs font-semibold text-agro-400 uppercase tracking-wide mb-1">
                    <i className="fas fa-tag mr-1"></i>ID
                  </p>
                  <p className="text-lg font-bold text-white">{perfil.id}</p>
                </div>
                <div className="bg-surface-700/50 rounded-xl p-4 border border-surface-600">
                  <p className="text-xs font-semibold text-agro-400 uppercase tracking-wide mb-1">
                    <i className="fas fa-user mr-1"></i>Usuario
                  </p>
                  <p className="text-lg font-bold text-white">{perfil.username}</p>
                </div>
                <div className="bg-surface-700/50 rounded-xl p-4 border border-surface-600">
                  <p className="text-xs font-semibold text-agro-400 uppercase tracking-wide mb-1">
                    <i className="fas fa-address-card mr-1"></i>Email
                  </p>
                  <p className="text-lg font-bold text-white truncate">{perfil.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-800 rounded-2xl shadow-xl shadow-black/20 border border-surface-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <i className="fas fa-shield-halved text-agro-400"></i>
                  JSON Web Token
                </h4>
                <button
                  onClick={copiarToken}
                  className="flex items-center gap-2 text-sm bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600 rounded-lg py-2 px-3 transition-all duration-200"
                >
                  {copiado ? (
                    <>
                      <i className="fas fa-check text-agro-400"></i>
                      Copiado
                    </>
                  ) : (
                    <>
                      <i className="fas fa-copy"></i>
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <div className="bg-surface-950 rounded-xl p-4 overflow-x-auto border border-surface-700">
                <pre className="text-agro-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all leading-relaxed">
                  {token}
                </pre>
              </div>
              <p className="text-xs text-surface-500 mt-3 flex items-center gap-1">
                <i className="fas fa-clock"></i>
                Token válido por 2 horas desde su generación
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
