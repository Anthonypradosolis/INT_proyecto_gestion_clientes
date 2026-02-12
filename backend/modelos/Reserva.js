// modelos/Reserva.js
import mongoose from "mongoose";

const ReservaSchema = new mongoose.Schema(
  {
    vehiculoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Articulo',
      required: true
    },
    // Datos del vehículo guardados por si se elimina
    vehiculoInfo: {
      marca: String,
      modelo: String,
      precio: Number,
      imagen: String
    },
    // Datos del usuario que reserva
    usuarioEmail: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    usuarioNombre: {
      type: String,
      required: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    usuarioTelefono: {
      type: String,
      required: true,
      match: [/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos']
    },
    usuarioDNI: {
      type: String,
      required: true,
      match: [/^[0-9]{8}[A-Z]$/, 'DNI inválido (formato: 12345678A)']
    },
    direccion: {
      type: String,
      required: true,
      minlength: [5, 'La dirección debe tener al menos 5 caracteres']
    },
    ciudad: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true,
      match: [/^[0-9]{5}$/, 'El código postal debe tener 5 dígitos']
    },
    // Fechas de la reserva
    fechaInicio: {
      type: Date,
      required: true
    },
    fechaFin: {
      type: Date,
      required: true
    },
    estado: {
      type: String,
      enum: ['activa', 'cancelada', 'completada'],
      default: 'activa'
    },
    observaciones: {
      type: String,
      maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    },
    fechaCreacion: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "reservas",
    timestamps: true
  }
);

// Validación personalizada: fecha fin debe ser después de fecha inicio
ReservaSchema.pre('save', function(next) {
  if (this.fechaFin <= this.fechaInicio) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  next();
});

export default mongoose.model("Reserva", ReservaSchema);
