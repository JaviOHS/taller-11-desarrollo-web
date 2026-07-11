import { useState, useEffect } from 'react'
import EventCard from './EventCard'
import SearchToolbar from './SearchToolbar'

function PublicEvents() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState('grid')

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

  const q = busqueda.trim().toLowerCase()
  const eventosFiltrados = q
    ? eventos.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q) ||
        (e.createdBy?.nombre || '').toLowerCase().includes(q)
      )
    : eventos

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <i className="fas fa-globe text-agro-600 dark:text-agro-400"></i>
          Eventos Públicos
        </h2>
        <span className="bg-agro-50 dark:bg-agro-500/15 text-agro-700 dark:text-agro-300 text-sm font-semibold px-3 py-1 rounded-full border border-agro-200 dark:border-agro-500/30">
          {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {!cargando && !error && eventos.length > 0 && (
        <SearchToolbar
          value={busqueda}
          onChange={setBusqueda}
          vista={vista}
          onVistaChange={setVista}
          placeholder="Buscar por título, ubicación o autor..."
        />
      )}

      {cargando && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-agro-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-surface-500 dark:text-surface-400 text-sm">Cargando eventos...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
          <i className="fas fa-circle-exclamation text-red-500 text-lg"></i>
          <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {!cargando && !error && eventos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-surface-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-surface-200 dark:border-white/5">
            <i className="fas fa-calendar-xmark text-4xl text-surface-400"></i>
          </div>
          <p className="text-surface-600 dark:text-surface-300 text-lg font-medium">No hay eventos públicos aún</p>
          <p className="text-surface-400 text-sm mt-1">Los eventos que se compartan aparecerán aquí</p>
        </div>
      )}

      {!cargando && !error && eventos.length > 0 && eventosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-surface-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-surface-200 dark:border-white/5">
            <i className="fas fa-magnifying-glass text-3xl text-surface-400"></i>
          </div>
          <p className="text-surface-600 dark:text-surface-300 text-lg font-medium">Sin resultados para tu búsqueda</p>
        </div>
      )}

      {!cargando && !error && eventosFiltrados.length > 0 && (
        <div className={vista === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'}>
          {eventosFiltrados.map((evento) => (
            <EventCard key={evento._id} evento={evento} vista={vista} showCreator />
          ))}
        </div>
      )}
    </div>
  )
}

export default PublicEvents
