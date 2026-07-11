const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  location: { type: String, trim: true },
  category: { type: String, enum: ['DEPORTE', 'MUSICA', 'EDUCACION', 'TECNOLOGIA', 'GASTRONOMIA', 'SOCIAL', 'OTRO'], default: 'OTRO' },
  status: { type: String, enum: ['public', 'private'], default: 'private' },
  image: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventoSchema);
