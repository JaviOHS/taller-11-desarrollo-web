const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || 'mi_clave_secreta_2026';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }
    req.usuario = decoded;
    next();
  });
}

module.exports = { verificarToken, SECRET_KEY };
