const express = require('express');
const router = express.Router();
const { verificarToken, optionalAuth } = require('../middleware/auth');
const { requireResourceOwner } = require('../middleware/owner');
const Event = require('../models/Event');
const eventController = require('../controllers/eventController');

router.get('/publicos', eventController.listarPublicos);
router.post('/', verificarToken, eventController.crear);
router.get('/mis-eventos', verificarToken, eventController.misEventos);
router.get('/:id', optionalAuth, eventController.obtenerPorId);
router.put('/:id', verificarToken, requireResourceOwner(Event), eventController.actualizar);
router.delete('/:id', verificarToken, requireResourceOwner(Event), eventController.eliminar);

module.exports = router;
