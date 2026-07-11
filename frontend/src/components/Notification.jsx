import { useState, useEffect } from 'react'

const ESTILOS = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    icon: 'fa-circle-check text-emerald-500'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400',
    icon: 'fa-circle-exclamation text-red-500'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400',
    icon: 'fa-circle-info text-blue-500'
  }
}

function Notification({ notificacion, onCerrar }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!notificacion) {
      setVisible(false)
      return
    }
    const tick = requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onCerrar, 300)
    }, notificacion.duracion || 3000)
    return () => {
      cancelAnimationFrame(tick)
      clearTimeout(timer)
    }
  }, [notificacion])

  if (!notificacion) return null

  const estilo = ESTILOS[notificacion.tipo] || ESTILOS.success

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
      visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
    }`}>
      <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-lg backdrop-blur-xl ${estilo.bg}`}>
        <i className={`fas ${estilo.icon}`}></i>
        <p className="text-sm font-semibold">{notificacion.mensaje}</p>
        <button
          onClick={() => { setVisible(false); setTimeout(onCerrar, 300) }}
          className="ml-2 opacity-60 hover:opacity-100 transition"
        >
          <i className="fas fa-xmark"></i>
        </button>
      </div>
    </div>
  )
}

export default Notification
