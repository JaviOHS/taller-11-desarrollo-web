const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { verificarToken, SECRET_KEY } = require('../middleware/auth');

const DATA_PATH = path.join(__dirname, '../data/data.json');

function leerUsuarios() {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  if (usuario.password !== password) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, username: usuario.username, nombre: usuario.nombre },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  res.json({
    mensaje: 'Inicio de sesión exitoso',
    token,
    usuario: {
      id: usuario.id,
      email: usuario.email,
      username: usuario.username,
      nombre: usuario.nombre
    }
  });
});

router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Acceso autorizado al perfil',
    usuario: req.usuario
  });
});

module.exports = router;
