import mongoose from 'mongoose';

const solicitudEmpleoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    trim: true
  },
  dni: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{8}[A-Z]$/
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  provincia: {
    type: String,
    required: true,
    trim: true
  },
  municipio: {
    type: String,
    required: true,
    trim: true
  },
  codigoPostal: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{5}$/
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
    match: /^[67]\d{8}$/
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  experiencia: {
    type: String,
    trim: true
  },
  puesto: {
    type: String,
    required: true,
    trim: true
  },
  foto: {
    type: String, // Ruta del archivo
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'revisada', 'aceptada', 'rechazada'],
    default: 'pendiente'
  },
  usuarioEmail: {
    type: String,
    required: true
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('SolicitudEmpleo', solicitudEmpleoSchema);
