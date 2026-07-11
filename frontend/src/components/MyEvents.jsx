import { useState, useEffect } from 'react'

const estadoInicial = { title: '', description: '', date: '', location: '', category: 'Otro', status: 'private' }

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

function MyEvents({ token }) {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('public')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState(estadoInicial)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(null)

  const cargarEventos = async () => {
    try {
      const res = await fetch('/api/eventos/mis-eventos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEventos(data)
    } catch (err) {
      setError(err.message || 'Error al cargar tus eventos')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarEventos() }, [token])

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const formatearFechaInput = (fecha) => {
    const d = new Date(fecha)
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60000)
    return local.toISOString().slice(0, 16)
  }

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const abrirCrear = () => {
    setFormulario(estadoInicial)
    setEditando(null)
    setMostrarForm(true)
    setError('')
  }

  const abrirEditar = (evento) => {
    setFormulario({
      title: evento.title,
      description: evento.description || '',
      date: formatearFechaInput(evento.date),
      location: evento.location || '',
      category: evento.category || 'Otro',
      status: evento.status
    })
    setEditando(evento._id)
    setMostrarForm(true)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const url = editando ? `/api/eventos/${editando}` : '/api/eventos/'
      const method = editando ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMostrarForm(false)
      setEditando(null)
      setFormulario(estadoInicial)
      await cargarEventos()
    } catch (err) {
      setError(err.message || 'Error al guardar el evento')
    } finally {
      setGuardando(false)
    }
  }

  const handleEliminar = async (id) => {
    setEliminando(id)
    try {
      const res = await fetch(`/api/eventos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await cargarEventos()
    } catch (err) {
      setError(err.message || 'Error al eliminar el evento')
    } finally {
      setEliminando(null)
    }
  }

  const publicos = eventos.filter(e => e.status === 'public')
  const privados = eventos.filter(e => e.status === 'private')
  const eventosFiltrados = filtro === 'public' ? publicos : privados

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <i className="fas fa-calendar-days text-agro-400"></i>
          Mis Eventos
        </h2>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-agro-600 hover:bg-agro-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-agro-600/20"
        >
          <i className="fas fa-plus"></i>
          <span className="hidden sm:inline">Crear Evento</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border-2 border-red-800/50 rounded-xl flex items-center gap-3">
          <i className="fas fa-circle-exclamation text-red-400 text-lg"></i>
          <p className="text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      {mostrarForm && (
        <div className="mb-6 bg-surface-800 rounded-2xl shadow-xl shadow-black/20 border border-surface-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className={`fas ${editando ? 'fa-pen-to-square' : 'fa-plus-circle'} text-agro-400`}></i>
              {editando ? 'Editar Evento' : 'Nuevo Evento'}
            </h3>
            <button
              onClick={() => { setMostrarForm(false); setEditando(null); setError('') }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-400 transition-all duration-200"
            >
              <i className="fas fa-xmark"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-300 mb-1">Título *</label>
              <input
                type="text" name="title" value={formulario.title} onChange={handleChange} required
                className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200"
                placeholder="Nombre del evento"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-300 mb-1">Descripción</label>
              <textarea
                name="description" value={formulario.description} onChange={handleChange} rows="3"
                className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200 resize-none"
                placeholder="Describe tu evento..."
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-300 mb-1">Fecha y Hora *</label>
                <input
                  type="datetime-local" name="date" value={formulario.date} onChange={handleChange} required
                  className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-300 mb-1">Ubicación</label>
                <input
                  type="text" name="location" value={formulario.location} onChange={handleChange}
                  className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200"
                  placeholder="Lugar del evento"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-300 mb-1">Categoría</label>
                <select
                  name="category" value={formulario.category} onChange={handleChange}
                  className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200"
                >
                  {CATEGORIAS.map(c => (
                    <option key={c.valor} value={c.valor}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-300 mb-1">Estado</label>
                <select
                  name="status" value={formulario.status} onChange={handleChange}
                  className="w-full bg-surface-700 border border-surface-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-500 transition-all duration-200"
                >
                  <option value="private">Privado</option>
                  <option value="public">Público</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setMostrarForm(false); setEditando(null); setError('') }}
                className="bg-surface-700 hover:bg-surface-600 text-surface-300 font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm border border-surface-600"
              >
                Cancelar
              </button>
              <button
                type="submit" disabled={guardando}
                className="flex items-center gap-2 bg-agro-600 hover:bg-agro-500 disabled:bg-agro-800 text-white font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm shadow-md shadow-agro-600/20"
              >
                {guardando ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Guardando...</>
                ) : (
                  <><i className="fas fa-check"></i> {editando ? 'Actualizar' : 'Crear'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {!cargando && !error && eventos.length > 0 && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFiltro('public')}
            className={`flex items-center gap-2 font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm ${
              filtro === 'public'
                ? 'bg-agro-600 text-white shadow-md shadow-agro-600/20'
                : 'bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600'
            }`}
          >
            <i className="fas fa-globe"></i>
            Públicos
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              filtro === 'public' ? 'bg-agro-700 text-agro-100' : 'bg-surface-600 text-surface-400'
            }`}>
              {publicos.length}
            </span>
          </button>
          <button
            onClick={() => setFiltro('private')}
            className={`flex items-center gap-2 font-semibold py-2 px-5 rounded-xl transition-all duration-200 text-sm ${
              filtro === 'private'
                ? 'bg-yellow-600 text-white shadow-md shadow-yellow-600/20'
                : 'bg-surface-700 hover:bg-surface-600 text-surface-300 border border-surface-600'
            }`}
          >
            <i className="fas fa-lock"></i>
            Privados
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${
              filtro === 'private' ? 'bg-yellow-700 text-yellow-100' : 'bg-surface-600 text-surface-400'
            }`}>
              {privados.length}
            </span>
          </button>
        </div>
      )}

      {cargando && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-agro-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-surface-400 text-sm">Cargando eventos...</p>
        </div>
      )}

      {!cargando && eventos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-surface-800 rounded-2xl flex items-center justify-center mb-4 border border-surface-700">
            <i className="fas fa-calendar-xmark text-4xl text-surface-500"></i>
          </div>
          <p className="text-surface-400 text-lg font-medium">No tienes eventos creados</p>
          <p className="text-surface-500 text-sm mt-1">Crea tu primer evento para verlo aquí</p>
        </div>
      )}

      {!cargando && eventos.length > 0 && eventosFiltrados.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center mb-4 border border-surface-700">
            <i className={`fas ${filtro === 'public' ? 'fa-globe' : 'fa-lock'} text-3xl text-surface-500`}></i>
          </div>
          <p className="text-surface-400 text-lg font-medium">
            No tienes eventos {filtro === 'public' ? 'públicos' : 'privados'}
          </p>
        </div>
      )}

      {!cargando && eventosFiltrados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventosFiltrados.map((evento) => {
            const esPublico = evento.status === 'public'
            const cat = getCategoria(evento.category)
            return (
              <div
                key={evento._id}
                className={`bg-surface-800 rounded-2xl shadow-xl shadow-black/20 border border-surface-700 p-5 transition-all duration-200 ${
                  esPublico ? 'hover:border-agro-700/50' : 'hover:border-yellow-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-white leading-tight">{evento.title}</h4>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-lg border ${
                    esPublico
                      ? 'bg-agro-900/40 text-agro-300 border-agro-700/50'
                      : 'bg-yellow-900/30 text-yellow-300 border-yellow-700/50'
                  }`}>
                    <i className={`fas ${esPublico ? 'fa-globe' : 'fa-lock'} mr-1`}></i>
                    {esPublico ? 'Público' : 'Privado'}
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
                    <i className={`fas fa-calendar-day w-4 text-center ${esPublico ? 'text-agro-500' : 'text-yellow-500'}`}></i>
                    <span>{formatearFecha(evento.date)}</span>
                  </div>
                  {evento.location && (
                    <div className="flex items-center gap-2 text-sm text-surface-300">
                      <i className={`fas fa-location-dot w-4 text-center ${esPublico ? 'text-agro-500' : 'text-yellow-500'}`}></i>
                      <span>{evento.location}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-surface-700">
                  <button
                    onClick={() => abrirEditar(evento)}
                    className="flex items-center gap-1.5 bg-surface-700 hover:bg-surface-600 text-surface-300 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs border border-surface-600"
                  >
                    <i className="fas fa-pen"></i> Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(evento._id)}
                    disabled={eliminando === evento._id}
                    className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-300 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs border border-red-800/50"
                  >
                    {eliminando === evento._id ? (
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <i className="fas fa-trash"></i>
                    )}
                    Eliminar
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyEvents
