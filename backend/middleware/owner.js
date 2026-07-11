const requireResourceOwner = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      if (!resource) {
        return res.status(404).json({ error: 'Recurso no encontrado' });
      }
      if (resource.createdBy.toString() !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
      }
      req.resource = resource;
      next();
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ error: 'ID inválido' });
      }
      res.status(500).json({ error: 'Error del servidor' });
    }
  };
};

module.exports = { requireResourceOwner };
