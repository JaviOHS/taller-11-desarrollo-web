require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const routes = require('./routes');
const eventosRoutes = require('./routes/events');
require('./middleware/passport');

const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventmila';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use('/api', routes);
app.use('/api/eventos', eventosRoutes);

module.exports = app;