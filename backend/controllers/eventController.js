const Event = require('../models/Event');
const { validateTitle, validateDate, validateStatus, validateCategory, validateImage, POPULATE_USER } = require('../utils/validation');

const listarPublicos = async (req, res, next) => {
  try {
    const eventos = await Event.find({ status: 'public' })
      .populate('createdBy', POPULATE_USER)
      .sort({ date: 1 });
    res.json(eventos);
  } catch (err) {
    next(err);
  }
};

const crear = async (req, res, next) => {
  const { title, description, date, location, category, status, image } = req.body;

  const titleErr = validateTitle(title);
  if (titleErr) return res.status(400).json({ error: titleErr });

  const dateErr = validateDate(date);
  if (dateErr) return res.status(400).json({ error: dateErr });

  const statusErr = validateStatus(status);
  if (statusErr) return res.status(400).json({ error: statusErr });

  const categoryErr = validateCategory(category);
  if (categoryErr) return res.status(400).json({ error: categoryErr });

  const imageErr = validateImage(image);
  if (imageErr) return res.status(400).json({ error: imageErr });

  try {
    const evento = new Event({
      title: title.trim().toUpperCase(),
      description: description ? description.trim() : '',
      date: new Date(date),
      location: location ? location.trim().toUpperCase() : '',
      category: (category || 'OTRO').toUpperCase(),
      status: status || 'private',
      image: image || '',
      createdBy: req.usuario.id
    });

    await evento.save();
    await evento.populate('createdBy', POPULATE_USER);
    res.status(201).json(evento);
  } catch (err) {
    next(err);
  }
};

const misEventos = async (req, res, next) => {
  try {
    const eventos = await Event.find({ createdBy: req.usuario.id })
      .populate('createdBy', POPULATE_USER)
      .sort({ date: 1 });
    res.json(eventos);
  } catch (err) {
    next(err);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const evento = await Event.findById(req.params.id)
      .populate('createdBy', POPULATE_USER);

    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (evento.status === 'public') {
      return res.json(evento);
    }

    const userId = req.usuario?.id;
    if (evento.status === 'private' && userId && evento.createdBy._id.toString() === userId) {
      return res.json(evento);
    }

    res.status(404).json({ error: 'Evento no encontrado' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ error: 'ID de evento inválido' });
    }
    next(err);
  }
};

const actualizar = async (req, res, next) => {
  const { title, description, date, location, category, status, image } = req.body;
  const evento = req.resource;

  if (title !== undefined) {
    const titleErr = validateTitle(title);
    if (titleErr) return res.status(400).json({ error: titleErr });
    evento.title = title.trim().toUpperCase();
  }
  if (date !== undefined) {
    const dateErr = validateDate(date);
    if (dateErr) return res.status(400).json({ error: dateErr });
    evento.date = new Date(date);
  }
  if (status !== undefined) {
    const statusErr = validateStatus(status);
    if (statusErr) return res.status(400).json({ error: statusErr });
    evento.status = status;
  }
  if (category !== undefined) {
    const categoryErr = validateCategory(category);
    if (categoryErr) return res.status(400).json({ error: categoryErr });
    evento.category = category.toUpperCase();
  }
  if (image !== undefined) {
    const imageErr = validateImage(image);
    if (imageErr) return res.status(400).json({ error: imageErr });
    evento.image = image;
  }
  if (description !== undefined) evento.description = description.trim();
  if (location !== undefined) evento.location = location.trim().toUpperCase();

  try {
    await evento.save();
    await evento.populate('createdBy', POPULATE_USER);
    res.json(evento);
  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Evento eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listarPublicos, crear, misEventos, obtenerPorId, actualizar, eliminar };
