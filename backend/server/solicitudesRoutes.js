import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SolicitudEmpleo from '../modelos/SolicitudEmpleo.js';
import { verificarToken } from './authController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar almacenamiento de multer para fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads/fotos');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'foto-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes PNG o JPG'));
  }
});

// GET - Obtener todas las solicitudes (requiere autenticación y admin)
router.get('/', verificarToken, async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }

    const solicitudes = await SolicitudEmpleo.find().sort({ fechaSolicitud: -1 });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener solicitudes', error: error.message });
  }
});

// POST - Crear nueva solicitud (requiere autenticación)
router.post('/', verificarToken, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'La foto es obligatoria' });
    }

    const nuevaSolicitud = new SolicitudEmpleo({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      dni: req.body.dni,
      direccion: req.body.direccion,
      provincia: req.body.provincia,
      municipio: req.body.municipio,
      codigoPostal: req.body.codigoPostal,
      telefono: req.body.telefono,
      correo: req.body.correo,
      fechaNacimiento: req.body.fechaNacimiento,
      experiencia: req.body.experiencia,
      puesto: req.body.puesto,
      foto: req.file.filename,
      usuarioEmail: req.user.email || req.user.dni
    });

    await nuevaSolicitud.save();
    res.status(201).json({ message: 'Solicitud creada correctamente', solicitud: nuevaSolicitud });
  } catch (error) {
    // Eliminar imagen si hubo error
    if (req.file) {
      const filePath = path.join(__dirname, 'uploads/fotos', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(400).json({ message: 'Error al crear solicitud', error: error.message });
  }
});

// PUT - Actualizar solicitud (solo admin)
router.put('/:id', verificarToken, upload.single('foto'), async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }

    const solicitud = await SolicitudEmpleo.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Si hay nueva foto, eliminar la anterior
    if (req.file) {
      const oldPhotoPath = path.join(__dirname, 'uploads/fotos', solicitud.foto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
      solicitud.foto = req.file.filename;
    }

    // Actualizar campos
    solicitud.nombre = req.body.nombre || solicitud.nombre;
    solicitud.apellidos = req.body.apellidos || solicitud.apellidos;
    solicitud.dni = req.body.dni || solicitud.dni;
    solicitud.direccion = req.body.direccion || solicitud.direccion;
    solicitud.provincia = req.body.provincia || solicitud.provincia;
    solicitud.municipio = req.body.municipio || solicitud.municipio;
    solicitud.codigoPostal = req.body.codigoPostal || solicitud.codigoPostal;
    solicitud.telefono = req.body.telefono || solicitud.telefono;
    solicitud.correo = req.body.correo || solicitud.correo;
    solicitud.fechaNacimiento = req.body.fechaNacimiento || solicitud.fechaNacimiento;
    solicitud.experiencia = req.body.experiencia || solicitud.experiencia;
    solicitud.puesto = req.body.puesto || solicitud.puesto;
    solicitud.estado = req.body.estado || solicitud.estado;

    await solicitud.save();
    res.json({ message: 'Solicitud actualizada correctamente', solicitud });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar solicitud', error: error.message });
  }
});

// DELETE - Eliminar solicitud (solo admin)
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    if (req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }

    const solicitud = await SolicitudEmpleo.findById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Eliminar foto del servidor
    const photoPath = path.join(__dirname, 'uploads/fotos', solicitud.foto);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }

    await SolicitudEmpleo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar solicitud', error: error.message });
  }
});

// GET - Servir imágenes de fotos
router.get('/foto/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/fotos', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Foto no encontrada' });
  }
});

export default router;
