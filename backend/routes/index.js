const express = require('express');
const router = express.Router();
const passport = require('passport');
const { verificarToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/perfil', verificarToken, authController.perfil);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000' }),
  authController.googleCallback
);

module.exports = router;
