import Avatar from './Avatar'
import { getCategoria } from '../utils/categorias'

const formatearFecha = (fecha, opts) =>
  new Date(fecha).toLocaleDateString('es-ES', opts || {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

function EstadoBadge({ esPublico, compact }) {
  return (
    <span className={`shrink-0 text-xs font-semibold rounded-lg border ${compact ? 'px-2 py-0.5' : 'px-2 py-1'} ${
      esPublico
        ? 'bg-agro-50 dark:bg-agro-500/15 text-agro-700 dark:text-agro-300 border-agro-200 dark:border-agro-500/30'
        : 'bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30'
    }`}>
      <i className={`fas ${esPublico ? 'fa-globe' : 'fa-lock'} mr-1`}></i>
      {esPublico ? 'Público' : 'Privado'}
    </span>
  )
}

function CategoriaChip({ cat }) {
  return (
    <span className="flex items-center gap-1.5 bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-surface-200 dark:border-white/5">
      <i className={`fas ${cat.icono} ${cat.color}`}></i>
      {cat.label}
    </span>
  )
}

function Thumb({ evento, cat, size, esPasado }) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 dark:from-ink-800 dark:to-ink-900 ${size}`}>
      {evento.image ? (
        <img
          src={evento.image}
          alt={evento.title}
          className={`w-full h-full object-cover transition-all duration-200 ${esPasado ? 'grayscale opacity-60' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <i className={`fas ${cat.icono} ${esPasado ? 'text-surface-400 dark:text-surface-600' : cat.color} opacity-50`} style={{ fontSize: '1.4rem' }}></i>
        </div>
      )}
    </div>
  )
}

function FinalizadoBadge({ compact }) {
  return (
    <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-lg border ${compact ? 'px-2 py-0.5' : 'px-2 py-1'} bg-surface-200/80 dark:bg-white/10 text-surface-600 dark:text-surface-300 border-surface-300 dark:border-white/10`}>
      <i className="fas fa-clock-rotate-left"></i>
      Finalizado
    </span>
  )
}

function Actions({ evento, onEditar, onEliminar, eliminando, compact }) {
  return (
    <div className={`flex items-center gap-1.5 ${compact ? '' : 'pt-3 border-t border-surface-100 dark:border-white/5'}`}>
      <button
        onClick={() => onEditar(evento)}
        className="flex items-center gap-1.5 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs border border-surface-200 dark:border-white/5"
      >
        <i className="fas fa-pen"></i> Editar
      </button>
      <button
        onClick={() => onEliminar(evento._id)}
        disabled={eliminando === evento._id}
        className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold py-1.5 px-3 rounded-lg transition-all duration-200 text-xs border border-red-200 dark:border-red-500/20"
      >
        {eliminando === evento._id ? (
          <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <i className="fas fa-trash"></i>
        )}
        Eliminar
      </button>
    </div>
  )
}

function EventCard({ evento, vista = 'grid', showCreator = false, onEditar, onEliminar, eliminando }) {
  const esPublico = evento.status === 'public'
  const esPasado = new Date(evento.date).getTime() < Date.now()
  const cat = getCategoria(evento.category)
  const puedeEditar = typeof onEditar === 'function'

  if (vista === 'list') {
    return (
      <div className={`flex items-center gap-4 bg-white dark:bg-ink-900 rounded-xl ring-1 ring-surface-900/5 dark:ring-white/5 p-3 hover:shadow-md dark:hover:ring-agro-500/20 transition-all duration-200 ${esPasado ? 'opacity-70' : ''}`}>
        <Thumb evento={evento} cat={cat} size="w-14 h-14 rounded-lg" esPasado={esPasado} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-surface-900 dark:text-white text-sm truncate">{evento.title}</h4>
            {esPasado ? <FinalizadoBadge compact /> : <EstadoBadge esPublico={esPublico} compact />}
          </div>
          <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1"><i className="fas fa-calendar-day"></i>{formatearFecha(evento.date, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            {evento.location && <span className="flex items-center gap-1 truncate"><i className="fas fa-location-dot"></i>{evento.location}</span>}
            <span className="flex items-center gap-1"><i className={`fas ${cat.icono} ${cat.color}`}></i>{cat.label}</span>
          </div>
        </div>
        {showCreator && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Avatar src={evento.createdBy?.profileImage} nombre={evento.createdBy?.nombre} size="sm" />
            <span className="text-xs text-surface-500 dark:text-surface-400">@{evento.createdBy?.username || '---'}</span>
          </div>
        )}
        {puedeEditar && (
          <div className="shrink-0">
            <Actions evento={evento} onEditar={onEditar} onEliminar={onEliminar} eliminando={eliminando} compact />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-ink-900 rounded-2xl shadow-sm ring-1 ring-surface-900/5 dark:ring-white/5 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        esPasado
          ? 'opacity-70 hover:ring-surface-300 dark:hover:ring-white/10'
          : esPublico ? 'hover:ring-agro-300 dark:hover:ring-agro-500/30' : 'hover:ring-yellow-300 dark:hover:ring-yellow-500/30'
      }`}
    >
      <div className="relative">
        <Thumb evento={evento} cat={cat} size="h-36 w-full" esPasado={esPasado} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"></div>
        {esPasado ? (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg border backdrop-blur bg-black/30 text-white border-white/20">
            <i className="fas fa-clock-rotate-left"></i>
            Finalizado
          </span>
        ) : (
          <span className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2 py-1 rounded-lg border backdrop-blur ${
            esPublico
              ? 'bg-agro-500/20 text-white border-agro-300/40'
              : 'bg-yellow-500/20 text-white border-yellow-300/40'
          }`}>
            <i className={`fas ${esPublico ? 'fa-globe' : 'fa-lock'} mr-1`}></i>
            {esPublico ? 'Público' : 'Privado'}
          </span>
        )}
        <h4 className="absolute bottom-2.5 left-3.5 right-3.5 text-white font-bold text-base leading-tight drop-shadow-sm">
          {evento.title}
        </h4>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CategoriaChip cat={cat} />
        </div>
        {evento.description && (
          <p className="text-surface-500 dark:text-surface-400 text-sm mb-3 line-clamp-2">{evento.description}</p>
        )}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
            <i className={`fas fa-calendar-day w-4 text-center ${esPasado ? 'text-surface-400' : esPublico ? 'text-agro-500' : 'text-yellow-500'}`}></i>
            <span>{formatearFecha(evento.date)}</span>
          </div>
          {evento.location && (
            <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
              <i className={`fas fa-location-dot w-4 text-center ${esPasado ? 'text-surface-400' : esPublico ? 'text-agro-500' : 'text-yellow-500'}`}></i>
              <span>{evento.location}</span>
            </div>
          )}
        </div>

        {showCreator && (
          <div className="pt-3 border-t border-surface-100 dark:border-white/5 flex items-center gap-2.5">
            <Avatar src={evento.createdBy?.profileImage} nombre={evento.createdBy?.nombre} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-surface-600 dark:text-surface-300 truncate">
                {evento.createdBy?.nombre || 'Anónimo'}
              </p>
              <p className="text-xs text-surface-400 truncate">@{evento.createdBy?.username || '---'}</p>
            </div>
          </div>
        )}

        {puedeEditar && (
          <Actions evento={evento} onEditar={onEditar} onEliminar={onEliminar} eliminando={eliminando} />
        )}
      </div>
    </div>
  )
}

export default EventCard
