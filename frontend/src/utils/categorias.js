export const CATEGORIAS = [
  { valor: 'Deporte', label: 'Deporte', icono: 'fa-futbol', color: 'text-blue-600 dark:text-blue-400' },
  { valor: 'Musica', label: 'Música', icono: 'fa-music', color: 'text-purple-600 dark:text-purple-400' },
  { valor: 'Educacion', label: 'Educación', icono: 'fa-graduation-cap', color: 'text-yellow-600 dark:text-yellow-400' },
  { valor: 'Tecnologia', label: 'Tecnología', icono: 'fa-microchip', color: 'text-cyan-600 dark:text-cyan-400' },
  { valor: 'Gastronomia', label: 'Gastronomía', icono: 'fa-utensils', color: 'text-orange-600 dark:text-orange-400' },
  { valor: 'Social', label: 'Social', icono: 'fa-people-group', color: 'text-pink-600 dark:text-pink-400' },
  { valor: 'Otro', label: 'Otro', icono: 'fa-ellipsis', color: 'text-surface-500 dark:text-surface-400' }
]

export const getCategoria = (cat) => CATEGORIAS.find((c) => c.valor === cat) || CATEGORIAS[6]
