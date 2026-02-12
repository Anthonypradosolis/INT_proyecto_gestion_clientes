// server/reservasRoutes.js
import express from "express";
import Reserva from "../modelos/Reserva.js";
import Articulo from "../modelos/Articulo.js";
import { verificarToken } from "./authController.js";

const router = express.Router();

// Obtener todas las reservas (admin ve todas, usuario solo las suyas)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let filtro = {};
    
    // Si se proporciona email, filtrar por ese usuario
    if (email) {
      filtro.usuarioEmail = email;
    }
    
    const reservas = await Reserva.find(filtro).sort({ fechaCreacion: -1 });
    res.json(reservas);
  } catch (err) {
    console.error("Error obteniendo reservas:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener reserva por ID
router.get("/:id", async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    res.json(reserva);
  } catch (err) {
    console.error("Error obteniendo reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verificar si un vehículo está reservado
router.get("/verificar/:vehiculoId", async (req, res) => {
  try {
    const reserva = await Reserva.findOne({
      vehiculoId: req.params.vehiculoId,
      estado: 'activa'
    });
    
    res.json({
      reservado: !!reserva,
      reserva: reserva || null
    });
  } catch (err) {
    console.error("Error verificando reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Crear nueva reserva (requiere autenticación)
router.post("/", verificarToken, async (req, res) => {
  try {
    const datosReserva = req.body;
    
    // Verificar que el vehículo existe
    const vehiculo = await Articulo.findById(datosReserva.vehiculoId);
    if (!vehiculo) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    
    // Verificar que el vehículo no esté ya reservado o vendido
    if (vehiculo.estado === 'vendido') {
      return res.status(400).json({ error: "El vehículo ya está vendido" });
    }
    
    // Verificar si ya existe una reserva activa para este vehículo
    const reservaExistente = await Reserva.findOne({
      vehiculoId: datosReserva.vehiculoId,
      estado: 'activa'
    });
    
    if (reservaExistente) {
      return res.status(400).json({ error: "El vehículo ya tiene una reserva activa" });
    }
    
    // Guardar información del vehículo en la reserva
    datosReserva.vehiculoInfo = {
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      precio: vehiculo.precio,
      imagen: vehiculo.imagen
    };
    
    // Crear la reserva
    const nuevaReserva = new Reserva(datosReserva);
    const reservaGuardada = await nuevaReserva.save();
    
    // Actualizar el estado del vehículo a "reservado"
    await Articulo.findByIdAndUpdate(datosReserva.vehiculoId, {
      estado: 'reservado'
    });
    
    res.status(201).json(reservaGuardada);
  } catch (err) {
    console.error("Error creando reserva:", err);
    if (err.name === 'ValidationError') {
      const errores = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: "Error de validación", detalles: errores });
    }
    res.status(500).json({ error: err.message });
  }
});

// Actualizar reserva (requiere autenticación)
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const reservaActualizada = await Reserva.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservaActualizada) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    
    res.json(reservaActualizada);
  } catch (err) {
    console.error("Error actualizando reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

// Cancelar/Anular reserva (requiere autenticación - admin o usuario propietario)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    
    // Cambiar estado de la reserva a 'cancelada'
    reserva.estado = 'cancelada';
    await reserva.save();
    
    // Devolver el vehículo a estado "disponible"
    await Articulo.findByIdAndUpdate(reserva.vehiculoId, {
      estado: 'disponible'
    });
    
    res.json({ mensaje: "Reserva cancelada correctamente", reserva });
  } catch (err) {
    console.error("Error cancelando reserva:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
