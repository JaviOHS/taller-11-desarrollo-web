const SIZES = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-2xl'
}

function initialsOf(nombre) {
  if (!nombre) return '?'
  const partes = nombre.trim().split(/\s+/)
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase() || '?'
}

function Avatar({ src, nombre, size = 'md', className = '' }) {
  const sizeClasses = SIZES[size] || SIZES.md

  if (src) {
    return (
      <img
        src={src}
        alt={nombre || 'Perfil'}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-ink-900 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-agro-400 to-agro-600 ring-2 ring-white dark:ring-ink-900 ${className}`}
    >
      {initialsOf(nombre)}
    </div>
  )
}

export default Avatar
