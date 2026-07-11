const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { SECRET_KEY } = require('./auth');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let usuario = await User.findOne({ email });

    if (!usuario) {
      usuario = new User({
        email,
        username: profile.displayName.replace(/\s+/g, '').toLowerCase(),
        password: 'google_oauth',
        nombre: profile.displayName,
        profileImage: profile.photos?.[0]?.value || ''
      });
      await usuario.save();
    } else if (!usuario.profileImage && profile.photos?.[0]?.value) {
      usuario.profileImage = profile.photos[0].value;
      await usuario.save();
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, username: usuario.username, nombre: usuario.nombre },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    return done(null, { token, usuario });
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;