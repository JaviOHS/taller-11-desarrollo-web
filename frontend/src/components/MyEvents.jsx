import { useState, useEffect, useRef } from 'react'
import { fileToCompressedBase64 } from '../utils/image'
import { CATEGORIAS } from '../utils/categorias'
import EventCard from './EventCard'
import SearchToolbar from './SearchToolbar'
import ConfirmModal from './ConfirmModal'

const estadoInicial = { title: '', description: '', date: '', location: '', category: 'OTRO', status: 'private', image: '' }

function ImageDropzone({ value, onChange }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [arrastrando, setArrastrando] = useState(false)

  const procesar = async (file) => {
    if (!file) return
    setError('')
    try {
      const base64 = await fileToCompressedBase64(file, { maxDim: 1000, quality: 0.82 })
      onChange(base64)
    } catch (err) {
      setError(err.message || 'No se pudo procesar la imagen')
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Imagen del evento</label>
      <div
        onClick={() => !value && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault()
          setArrastrando(false)
          procesar(e.dataTransfer.files?.[0])
        }}
        className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 ${
          value ? 'border-transparent' : arrastrando ? 'border-agro-500 bg-agro-50 dark:bg-agro-950/20' : 'border-surface-200 dark:border-white/10 hover:border-agro-400 cursor-pointer bg-surface-50 dark:bg-ink-800'
        }`}
      >
        {value ? (
          <div className="relative h-40">
            <img src={value} alt="Vista previa" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-surface-900/70 hover:bg-surface-900/90 text-white flex items-center justify-center transition"
            >
              <i className="fas fa-xmark text-xs"></i>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center px-4">
            <i className="fas fa-image text-2xl text-surface-400 mb-2"></i>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Arrastra una imagen o <span className="text-agro-600 dark:text-agro-400 font-semibold">haz clic para subir</span>
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { procesar(e.target.files?.[0]); e.target.value = '' }}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function MyEvents({ token, onNotificar }) {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('public')
  const [busqueda, setBusqueda] = useState('')
  const [vista, setVista] = useState('grid')
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState(estadoInicial)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(null)
  const [eventoAEliminar, setEventoAEliminar] = useState(null)

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
    setError('')
  }

  const abrirEditar = (evento) => {
    setFormulario({
      title: evento.title,
      description: evento.description || '',
      date: formatearFechaInput(evento.date),
      location: evento.location || '',
      category: evento.category || 'OTRO',
      status: evento.status,
      image: evento.image || ''
    })
    setEditando(evento._id)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const url = editando ? `/api/eventos/${editando}` : '/api/eventos/'
      const method = editando ? 'PUT' : 'POST'
      const body = {
        ...formulario,
        title: formulario.title.toUpperCase(),
        location: formulario.location.toUpperCase(),
        category: formulario.category.toUpperCase(),
        description: formulario.description
      }
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditando(null)
      setFormulario(estadoInicial)
      await cargarEventos()
      onNotificar?.(`Evento ${editando ? 'editado' : 'creado'} exitosamente`)
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
      onNotificar?.('Evento eliminado exitosamente')
    } catch (err) {
      setError(err.message || 'Error al eliminar el evento')
    } finally {
      setEliminando(null)
    }
  }

  const pedirConfirmacionEliminar = (evento) => {
    setError('')
    setEventoAEliminar(evento)
  }

  const cancelarEliminar = () => setEventoAEliminar(null)

  const confirmarEliminar = async () => {
    if (!eventoAEliminar) return
    await handleEliminar(eventoAEliminar._id)
    setEventoAEliminar(null)
  }

  const publicos = eventos.filter(e => e.status === 'public')
  const privados = eventos.filter(e => e.status === 'private')
  const eventosEstado = filtro === 'public' ? publicos : privados
  const q = busqueda.trim().toLowerCase()
  const eventosFiltrados = q
    ? eventosEstado.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.description || '').toLowerCase().includes(q)
      )
    : eventosEstado

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      <div className="w-full lg:w-[380px] lg:shrink-0 lg:sticky lg:top-24">
          <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-sm ring-1 ring-surface-900/5 dark:ring-white/5 overflow-hidden">
            <div className="flex items-center gap-1.5 px-5 pt-4 pb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
            </div>
            <div className="px-5 pt-2 pb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white flex items-center gap-2">
                  <i className={`fas ${editando ? 'fa-pen-to-square' : 'fa-plus-circle'} text-agro-600 dark:text-agro-400`}></i>
                  {editando ? 'Editar Evento' : 'Nuevo Evento'}
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">Completa los datos del evento</p>
              </div>
              {editando && (
                <button
                  onClick={abrirCrear}
                  title="Cancelar edición"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-500 dark:text-surface-400 transition-all duration-200"
                >
                  <i className="fas fa-xmark"></i>
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-4">
              <ImageDropzone value={formulario.image} onChange={(image) => setFormulario({ ...formulario, image })} />

              <div>
                <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Título *</label>
                <input
                  type="text" name="title" value={formulario.title} onChange={handleChange} required
                  className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nombre del evento"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Descripción</label>
                <textarea
                  name="description" value={formulario.description} onChange={handleChange} rows="3"
                  className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe tu evento..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Fecha y Hora *</label>
                <input
                  type="datetime-local" name="date" value={formulario.date} onChange={handleChange} required
                  className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Ubicación</label>
                <input
                  type="text" name="location" value={formulario.location} onChange={handleChange}
                  className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200"
                  placeholder="Lugar del evento"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Categoría</label>
                  <select
                    name="category" value={formulario.category} onChange={handleChange}
                    className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200"
                  >
                    {CATEGORIAS.map(c => (
                      <option key={c.valor} value={c.valor}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-600 dark:text-surface-300 mb-1">Estado</label>
                  <select
                    name="status" value={formulario.status} onChange={handleChange}
                    className="w-full bg-white dark:bg-ink-800 border border-surface-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-surface-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="private">Privado</option>
                    <option value="public">Público</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                  <i className="fas fa-circle-exclamation flex-shrink-0 mt-0.5"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={abrirCrear}
                  className="flex-1 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm border border-surface-200 dark:border-white/10"
                >
                  {editando ? 'Cancelar' : 'Limpiar'}
                </button>
                <button
                  type="submit" disabled={guardando}
                  className="flex-1 flex items-center justify-center gap-2 bg-agro-600 hover:bg-agro-700 disabled:bg-agro-300 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm shadow-agro-600/30"
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
        </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
            <i className="fas fa-calendar-days text-agro-600 dark:text-agro-400"></i>
            Mis Eventos
          </h2>
        </div>

        {!cargando && !error && eventos.length > 0 && (
          <SearchToolbar
            value={busqueda}
            onChange={setBusqueda}
            vista={vista}
            onVistaChange={setVista}
            placeholder="Buscar por título, ubicación o descripción..."
          >
            <div className="flex gap-1 bg-surface-100 dark:bg-white/5 rounded-xl p-1 mr-1">
              <button
                onClick={() => setFiltro('public')}
                className={`flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs whitespace-nowrap ${
                  filtro === 'public'
                    ? 'bg-agro-600 text-white shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                }`}
              >
                <i className="fas fa-globe"></i>
                Públicos <span className="opacity-80">{publicos.length}</span>
              </button>
              <button
                onClick={() => setFiltro('private')}
                className={`flex items-center gap-1.5 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs whitespace-nowrap ${
                  filtro === 'private'
                    ? 'bg-yellow-600 text-white shadow-sm'
                    : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
                }`}
              >
                <i className="fas fa-lock"></i>
                Privados <span className="opacity-80">{privados.length}</span>
              </button>
            </div>
          </SearchToolbar>
        )}

        {cargando && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-agro-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-surface-500 dark:text-surface-400 text-sm">Cargando eventos...</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-3">
            <i className="fas fa-circle-exclamation text-red-500 text-lg"></i>
            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {!cargando && eventos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-surface-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-surface-200 dark:border-white/5">
              <i className="fas fa-calendar-xmark text-4xl text-surface-400"></i>
            </div>
            <p className="text-surface-600 dark:text-surface-300 text-lg font-medium">No tienes eventos creados</p>
            <p className="text-surface-400 text-sm mt-1">Crea tu primer evento para verlo aquí</p>
          </div>
        )}

        {!cargando && eventos.length > 0 && eventosFiltrados.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-surface-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-surface-200 dark:border-white/5">
              <i className={`fas ${q ? 'fa-magnifying-glass' : filtro === 'public' ? 'fa-globe' : 'fa-lock'} text-3xl text-surface-400`}></i>
            </div>
            <p className="text-surface-600 dark:text-surface-300 text-lg font-medium">
              {q ? 'Sin resultados para tu búsqueda' : `No tienes eventos ${filtro === 'public' ? 'públicos' : 'privados'}`}
            </p>
          </div>
        )}

        {!cargando && eventosFiltrados.length > 0 && (
          <div className={vista === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 sm:grid-cols-2 gap-5'}>
            {eventosFiltrados.map((evento) => (
              <EventCard
                key={evento._id}
                evento={evento}
                vista={vista}
                onEditar={abrirEditar}
                onEliminar={pedirConfirmacionEliminar}
                eliminando={eliminando}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!eventoAEliminar}
        title="Eliminar evento"
        message={eventoAEliminar ? `¿Seguro que quieres eliminar "${eventoAEliminar.title}"? Esta acción no se puede deshacer.` : ''}
        loading={eliminando === eventoAEliminar?._id}
        onConfirm={confirmarEliminar}
        onCancel={cancelarEliminar}
      />
    </div>
  )
}

export default MyEvents
