const express = require('express');
const router = express.Router();
const { verificarToken, optionalAuth } = require('../middleware/auth');
const { requireResourceOwner } = require('../middleware/owner');
const { validateTitle, validateDate, validateStatus, validateCategory, validateImage, POPULATE_USER } = require('../utils/validation');
const Event = require('../models/Event');

router.get('/publicos', async (req, res) => {
  try {
    const eventos = await Event.find({ status: 'public' })
      .populate('createdBy', POPULATE_USER)
      .sort({ date: 1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos públicos' });
  }
});

router.post('/', verificarToken, async (req, res) => {
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
      title: title.trim(),
      description: description ? description.trim() : '',
      date: new Date(date),
      location: location ? location.trim() : '',
      category: category || 'Otro',
      status: status || 'private',
      image: image || '',
      createdBy: req.usuario.id
    });

    await evento.save();
    await evento.populate('createdBy', POPULATE_USER);
    res.status(201).json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el evento' });
  }
});

router.get('/mis-eventos', verificarToken, async (req, res) => {
  try {
    const eventos = await Event.find({ createdBy: req.usuario.id })
      .populate('createdBy', POPULATE_USER)
      .sort({ date: 1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tus eventos' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
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
    res.status(500).json({ error: 'Error al obtener el evento' });
  }
});

router.put('/:id', verificarToken, requireResourceOwner(Event), async (req, res) => {
  const { title, description, date, location, category, status, image } = req.body;
  const evento = req.resource;

  if (title !== undefined) {
    const titleErr = validateTitle(title);
    if (titleErr) return res.status(400).json({ error: titleErr });
    evento.title = title.trim();
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
    evento.category = category;
  }
  if (image !== undefined) {
    const imageErr = validateImage(image);
    if (imageErr) return res.status(400).json({ error: imageErr });
    evento.image = image;
  }
  if (description !== undefined) evento.description = description.trim();
  if (location !== undefined) evento.location = location.trim();

  try {
    await evento.save();
    await evento.populate('createdBy', POPULATE_USER);
    res.json(evento);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el evento' });
  }
});

router.delete('/:id', verificarToken, requireResourceOwner(Event), async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Evento eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el evento' });
  }
});

module.exports = router;
