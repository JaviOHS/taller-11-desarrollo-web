function SearchToolbar({ value, onChange, vista, onVistaChange, placeholder, children }) {
  return (
    <div className="bg-white/75 dark:bg-ink-900/90 backdrop-blur-xl border border-agro-900/10 dark:border-white/5 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <i className="fas fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none"></i>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-200 dark:border-white/5 bg-white dark:bg-ink-800 text-sm text-surface-800 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-agro-500 focus:border-transparent transition"
        />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {value && (
          <button
            onClick={() => onChange('')}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
          >
            Limpiar
          </button>
        )}
        <div className="flex rounded-xl overflow-hidden bg-surface-100 dark:bg-white/5 p-1 gap-1">
          <button
            onClick={() => onVistaChange('grid')}
            title="Vista de cuadrícula"
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${vista === 'grid' ? 'bg-agro-600 text-white' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-200'}`}
          >
            <i className="fas fa-table-cells text-sm"></i>
          </button>
          <button
            onClick={() => onVistaChange('list')}
            title="Vista de lista"
            className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${vista === 'list' ? 'bg-agro-600 text-white' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-200'}`}
          >
            <i className="fas fa-list text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchToolbar
