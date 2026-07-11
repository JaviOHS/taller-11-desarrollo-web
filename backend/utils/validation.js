const POPULATE_USER = 'nombre username email profileImage';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const validateImage = (image) => {
  if (!image) return null;
  if (typeof image !== 'string' || !/^data:image\/(png|jpe?g|webp|gif);base64,/.test(image)) {
    return 'La imagen debe ser un archivo PNG, JPG, WEBP o GIF';
  }
  const base64Length = image.length - image.indexOf(',') - 1;
  const approxBytes = base64Length * 0.75;
  if (approxBytes > MAX_IMAGE_BYTES) {
    return 'La imagen es demasiado grande (máximo 4MB)';
  }
  return null;
};

const CATEGORIES = ['Deporte', 'Musica', 'Educacion', 'Tecnologia', 'Gastronomia', 'Social', 'Otro'];

const CATEGORY_ICONS = {
  'Deporte': { icono: 'fa-futbol', color: 'blue' },
  'Musica': { icono: 'fa-music', color: 'purple' },
  'Educacion': { icono: 'fa-graduation-cap', color: 'yellow' },
  'Tecnologia': { icono: 'fa-microchip', color: 'cyan' },
  'Gastronomia': { icono: 'fa-utensils', color: 'orange' },
  'Social': { icono: 'fa-people-group', color: 'pink' },
  'Otro': { icono: 'fa-ellipsis', color: 'surface' }
};

const validateTitle = (title) => {
  if (!title || title.trim().length < 3) {
    return 'El título debe tener al menos 3 caracteres';
  }
  return null;
};

const validateDate = (date) => {
  if (!date) return 'La fecha es requerida';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return 'Fecha inválida';
  return null;
};

const validateStatus = (status) => {
  if (status && !['public', 'private'].includes(status)) {
    return 'Estado inválido. Use "public" o "private"';
  }
  return null;
};

const validateCategory = (category) => {
  if (category && !CATEGORIES.includes(category)) {
    return `Categoría inválida. Use: ${CATEGORIES.join(', ')}`;
  }
  return null;
};

module.exports = { validateTitle, validateDate, validateStatus, validateCategory, validateImage, POPULATE_USER, CATEGORIES };
