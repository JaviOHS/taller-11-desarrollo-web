const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { verificarToken, SECRET_KEY } = require('../middleware/auth');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    let usuario = await User.findOne({ email });

    if (!usuario) {
      const username = email.split('@')[0];
      usuario = new User({ email, username, password, nombre: username });
      await usuario.save();
    } else {
      if (usuario.password !== password) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, username: usuario.username, nombre: usuario.nombre },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        username: usuario.username,
        nombre: usuario.nombre
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Acceso autorizado al perfil',
    usuario: req.usuario
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000' }),
  (req, res) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}?token=${req.user.token}`);
  }
);

module.exports = router;