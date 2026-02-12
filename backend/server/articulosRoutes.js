// server/articulosRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import Articulo from "../modelos/Articulo.js";
import { fileURLToPath } from "url";
import fs from 'fs';
import { verificarToken } from "./authController.js";

// inicializar configuración de multer para manejo de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurarse de que la carpeta uploads exista
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Carpeta uploads creada automáticamente');
}

// Crear el router
const router = express.Router();
console.log("Router articulos cargado"); // para depurar



// Configuración de almacenamiento de multer en la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // ruta absoluta a server/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Inicializar multer
const upload = multer({ storage: storage });

// AHORA VIENEN LAS RUTAS USANDO EL router DE EXPRESS

// Buscar artículos (DEBE IR ANTES de la ruta GET /)
router.get("/buscar", async (req, res) => {
  const { q } = req.query;

  if (!q) return res.json([]);

  const regex = new RegExp(q, "i");
  // supongamos solo la marca modelo y descripción
  try {
    const articulos = await Articulo.find({
      $or: [
        { marca: regex },
        { modelo: regex },
        { descripcion: regex }
      ]
    });

    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// Obtener todos los artículo
router.get("/", async (req, res) => {
  const articulos = await Articulo.find();
  res.json(articulos);
});

// Guardar artículo con imagen (requiere autenticación)
router.post("/", verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.body.vehiculo) {
      console.error("No se recibió el campo 'vehiculo'");
      return res.status(400).json({ error: "Campo 'vehiculo' vacío" });
    }

    let datos;
    try {
      datos = JSON.parse(req.body.vehiculo);
    } catch (e) {
      console.error("Error parseando JSON:", e.message);
      return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
    }

    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const articulo = new Articulo(datos);
    const guardado = await articulo.save();
    res.json(guardado);

  } catch (err) {
    console.error("Error guardando artículo:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Obtener artículo por ID
router.get("/:id", async (req, res) => {
  try {
    const articulo = await Articulo.findById(req.params.id);
    if (!articulo) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }
    res.json(articulo);
  } catch (err) {
    console.error("Error obteniendo artículo:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar artículo con imagen o solo datos (requiere autenticación)
router.put("/:id", verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    let datos;

    // Si viene como FormData con campo 'vehiculo'
    if (req.body.vehiculo) {
      try {
        datos = JSON.parse(req.body.vehiculo);
      } catch (e) {
        console.error("Error parseando JSON:", e.message);
        return res.status(400).json({ error: "JSON inválido en 'vehiculo'", detalle: e.message });
      }
    } else {
      // Si viene como JSON directo (por ejemplo, solo actualizar estado)
      datos = req.body;
    }

    // Solo agregar imagen si se subió un archivo
    if (req.file) {
      datos.imagen = `/uploads/${req.file.filename}`;
    }

    const actualizado = await Articulo.findByIdAndUpdate(
      req.params.id,
      datos,
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    res.json(actualizado);
  } catch (err) {
    console.error("Error actualizando artículo:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Eliminar artículo (requiere autenticación)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const eliminado = await Articulo.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: "Artículo no encontrado" });
    }

    res.json({ mensaje: "Artículo eliminado correctamente", articulo: eliminado });
  } catch (err) {
    console.error("Error eliminando artículo:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
