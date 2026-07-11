import { useState, useEffect } from 'react'

const CATEGORIAS = [
  { valor: 'Deporte', label: 'Deporte', icono: 'fa-futbol', color: 'text-blue-400' },
  { valor: 'Musica', label: 'Música', icono: 'fa-music', color: 'text-purple-400' },
  { valor: 'Educacion', label: 'Educación', icono: 'fa-graduation-cap', color: 'text-yellow-400' },
  { valor: 'Tecnologia', label: 'Tecnología', icono: 'fa-microchip', color: 'text-cyan-400' },
  { valor: 'Gastronomia', label: 'Gastronomía', icono: 'fa-utensils', color: 'text-orange-400' },
  { valor: 'Social', label: 'Social', icono: 'fa-people-group', color: 'text-pink-400' },
  { valor: 'Otro', label: 'Otro', icono: 'fa-ellipsis', color: 'text-surface-400' }
]

const getCategoria = (cat) => CATEGORIAS.find(c => c.valor === cat) || CATEGORIAS[6]

function PublicEvents() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch('/api/eventos/publicos')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setEventos(data)
      } catch (err) {
        setError(err.message || 'Error al cargar eventos')
      } finally {
        setCargando(false)
      }
    }
    fetchEventos()
  }, [])

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <i className="fas fa-globe text-agro-400"></i>
          Eventos Públicos
        </h2>
        <span className="bg-agro-900/40 text-agro-300 text-sm font-semibold px-3 py-1 rounded-full border border-agro-700/50">
          {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {cargando && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-agro-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-surface-400 text-sm">Cargando eventos...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-900/30 border-2 border-red-800/50 rounded-xl flex items-center gap-3">
          <i className="fas fa-circle-exclamation text-red-400 text-lg"></i>
          <p className="text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {!cargando && !error && eventos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-surface-800 rounded-2xl flex items-center justify-center mb-4 border border-surface-700">
            <i className="fas fa-calendar-xmark text-4xl text-surface-500"></i>
          </div>
          <p className="text-surface-400 text-lg font-medium">No hay eventos públicos aún</p>
          <p className="text-surface-500 text-sm mt-1">Los eventos que se compartan aparecerán aquí</p>
        </div>
      )}

      {!cargando && !error && eventos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventos.map((evento) => {
            const cat = getCategoria(evento.category)
            return (
            <div
              key={evento._id}
              className="bg-surface-800 rounded-2xl shadow-xl shadow-black/20 border border-surface-700 p-5 hover:border-agro-700/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-white leading-tight">{evento.title}</h3>
                <span className="shrink-0 bg-agro-900/40 text-agro-300 text-xs font-semibold px-2 py-1 rounded-lg border border-agro-700/50">
                  <i className="fas fa-globe mr-1"></i>Público
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-surface-700 text-surface-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-surface-600">
                  <i className={`fas ${cat.icono} ${cat.color}`}></i>
                  {cat.label}
                </span>
              </div>

              {evento.description && (
                <p className="text-surface-400 text-sm mb-3 line-clamp-2">{evento.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-surface-300">
                  <i className="fas fa-calendar-day text-agro-500 w-4 text-center"></i>
                  <span>{formatearFecha(evento.date)}</span>
                </div>
                {evento.location && (
                  <div className="flex items-center gap-2 text-sm text-surface-300">
                    <i className="fas fa-location-dot text-agro-500 w-4 text-center"></i>
                    <span>{evento.location}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-surface-700 flex items-center gap-2">
                <div className="w-7 h-7 bg-surface-700 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-surface-400 text-xs"></i>
                </div>
                <div>
                  <p className="text-xs font-semibold text-surface-300">
                    {evento.createdBy?.nombre || 'Anónimo'}
                  </p>
                  <p className="text-xs text-surface-500">@{evento.createdBy?.username || '---'}</p>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default PublicEvents
