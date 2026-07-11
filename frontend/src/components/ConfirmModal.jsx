import { useEffect } from 'react'

function ConfirmModal({ open, title, message, confirmLabel = 'Eliminar', cancelLabel = 'Cancelar', loading, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-900/50 dark:bg-black/60 backdrop-blur-sm"
        onClick={() => !loading && onCancel()}
      ></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-ink-900 rounded-2xl shadow-2xl ring-1 ring-surface-900/5 dark:ring-white/5 p-6">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
          <i className="fas fa-triangle-exclamation text-red-500 text-lg"></i>
        </div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1.5">{title}</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{message}</p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-surface-300 font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm border border-surface-200 dark:border-white/10 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm shadow-sm shadow-red-600/30"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Eliminando...</>
            ) : (
              <><i className="fas fa-trash"></i> {confirmLabel}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
