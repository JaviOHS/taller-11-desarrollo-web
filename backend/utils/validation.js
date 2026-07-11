const POPULATE_USER = 'nombre username email';

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

module.exports = { validateTitle, validateDate, validateStatus, POPULATE_USER };
