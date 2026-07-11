import { useState, useEffect } from 'react'
import Avatar from './Avatar'
import { decodeJwtPayload } from '../utils/jwt'

function StatTile({ icono, valor, label, color }) {
  return (
    <div className="bg-white/70 dark:bg-white/[0.03] backdrop-blur border border-agro-900/10 dark:border-white/5 rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <i className={`fas ${icono} text-sm`}></i>
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-surface-900 dark:text-white leading-none">{valor}</p>
        <p className="text-[11px] text-surface-500 dark:text-surface-400 font-medium mt-1">{label}</p>
      </div>
    </div>
  )
}

function InfoTile({ icono, label, valor }) {
  return (
    <div className="bg-surface-50 dark:bg-white/[0.03] rounded-xl p-4 border border-surface-200 dark:border-white/5">
      <p className="text-xs font-semibold text-agro-600 dark:text-agro-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
        <i className={`fas ${icono}`}></i>{label}
      </p>
      <p className="text-lg font-bold text-surface-900 dark:text-white truncate">{valor}</p>
    </div>
  )
}

function Dashboard({ token }) {
  const [perfil, setPerfil] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resPerfil, resEventos] = await Promise.all([
          fetch('/api/perfil', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/eventos/mis-eventos', { headers: { Authorization: `Bearer ${token}` } })
        ])
        const dataPerfil = await resPerfil.json()
        if (!resPerfil.ok) throw new Error(dataPerfil.error)
        setPerfil(dataPerfil.usuario)

        if (resEventos.ok) {
          const eventos = await resEventos.json()
          setStats({
            total: eventos.length,
            publicos: eventos.filter((e) => e.status === 'public').length,
            privados: eventos.filter((e) => e.status === 'private').length
          })
        }
      } catch (err) {
        setError(err.message || 'Error al obtener perfil')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [token])

  const copiarToken = () => {
    navigator.clipboard.writeText(token)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-agro-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-surface-500 dark:text-surface-400 text-sm">Cargando perfil...</p>
      </div>
    )
  }

  const payload = decodeJwtPayload(token)
  const expiraEn = payload?.exp ? Math.max(0, Math.round((payload.exp * 1000 - Date.now()) / 60000)) : null
  const miembroDesde = perfil?.createdAt
    ? new Date(perfil.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
          <i className="fas fa-circle-exclamation text-red-500 text-lg"></i>
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {perfil && (
        <>
          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-sm ring-1 ring-surface-900/5 dark:ring-white/5 overflow-hidden mb-6">
            <div
              className="h-28 relative bg-gradient-to-br from-agro-500 via-agro-600 to-teal-700"
              style={{ backgroundImage: 'radial-gradient(circle at 85% 20%, rgba(255,255,255,.18) 0, transparent 45%), radial-gradient(circle at 15% 85%, rgba(255,255,255,.12) 0, transparent 40%), linear-gradient(135deg, #059669, #047857 55%, #0f766e)' }}
            >
              <div className="absolute -bottom-9 left-6">
                <Avatar src={perfil.profileImage} nombre={perfil.nombre} size="xl" />
              </div>
              <span className="absolute top-3 right-4 inline-flex items-center gap-1.5 bg-black/20 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Sesión activa
              </span>
            </div>

            <div className="pt-12 pb-6 px-6">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white">{perfil.nombre}</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm flex items-center gap-1.5 mt-0.5">
                    <i className="fas fa-envelope"></i>
                    {perfil.email}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-agro-700 dark:text-agro-400 bg-agro-50 dark:bg-agro-500/10 border border-agro-200 dark:border-agro-500/20 px-3 py-1.5 rounded-full">
                  <i className="fas fa-calendar-check"></i>
                  Miembro desde {miembroDesde}
                </span>
              </div>

              {stats && (
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <StatTile
                    icono="fa-calendar-days"
                    valor={stats.total}
                    label="Eventos creados"
                    color="bg-agro-50 dark:bg-agro-500/10 text-agro-600 dark:text-agro-400"
                  />
                  <StatTile
                    icono="fa-globe"
                    valor={stats.publicos}
                    label="Públicos"
                    color="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  />
                  <StatTile
                    icono="fa-lock"
                    valor={stats.privados}
                    label="Privados"
                    color="bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <InfoTile icono="fa-tag" label="ID" valor={perfil.id} />
                <InfoTile icono="fa-user" label="Usuario" valor={perfil.username} />
                <InfoTile icono="fa-envelope" label="Email" valor={perfil.email} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-sm ring-1 ring-surface-900/5 dark:ring-white/5 p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h4 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                <i className="fas fa-shield-halved text-agro-600 dark:text-agro-400"></i>
                JSON Web Token
              </h4>
              <div className="flex items-center gap-2">
                {expiraEn !== null && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-white/5 px-2.5 py-1.5 rounded-lg">
                    <i className="fas fa-hourglass-half"></i>
                    Expira en {expiraEn} min
                  </span>
                )}
                <button
                  onClick={copiarToken}
                  className="flex items-center gap-2 text-sm bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-white/5 rounded-lg py-2 px-3 transition-all duration-200"
                >
                  {copiado ? (
                    <>
                      <i className="fas fa-check text-agro-600 dark:text-agro-400"></i>
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
            </div>
            <div className="bg-ink-950 rounded-xl p-4 overflow-x-auto border border-white/5">
              <pre className="text-agro-400 text-xs sm:text-sm font-mono whitespace-pre-wrap break-all leading-relaxed">
                {token}
              </pre>
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-3 flex items-center gap-1">
              <i className="fas fa-clock"></i>
              Token válido por 2 horas desde su generación
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
