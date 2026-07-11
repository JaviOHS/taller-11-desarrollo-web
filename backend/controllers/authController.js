const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('../middleware/auth');
const { validateImage } = require('../utils/validation');
const User = require('../models/User');

const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario._id, email: usuario.email, username: usuario.username, nombre: usuario.nombre },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

const registrar = async (req, res, next) => {
  const { nombre, email, username, password, profileImage } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'El username debe tener al menos 3 caracteres' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  const imageErr = validateImage(profileImage);
  if (imageErr) return res.status(400).json({ error: imageErr });

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'El username ya está en uso' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = new User({
      nombre: nombre.trim(),
      email,
      username: username.trim(),
      password: hashedPassword,
      profileImage: profileImage || ''
    });
    await usuario.save();

    const token = generarToken(usuario);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: { id: usuario._id, email: usuario.email, username: usuario.username, nombre: usuario.nombre, profileImage: usuario.profileImage }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: { id: usuario._id, email: usuario.email, username: usuario.username, nombre: usuario.nombre }
    });
  } catch (err) {
    next(err);
  }
};

const perfil = async (req, res, next) => {
  try {
    const usuario = await User.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({
      message: 'Acceso autorizado al perfil',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        username: usuario.username,
        nombre: usuario.nombre,
        profileImage: usuario.profileImage,
        createdAt: usuario.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

const googleCallback = (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendURL}?token=${req.user.token}`);
};

module.exports = { registrar, login, perfil, googleCallback };
