// server/facturasRoutes.js
import express from "express";
import Factura from "../modelos/Factura.js";

const router = express.Router();

// Obtener todas las facturas
router.get("/", async (req, res) => {
    try {
        const facturas = await Factura.find().sort({ fecha: -1 });
        res.json(facturas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una factura por ID
router.get("/:id", async (req, res) => {
    try {
        const factura = await Factura.findById(req.params.id);
        if (!factura) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }
        res.json(factura);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una nueva factura
router.post("/", async (req, res) => {
    try {
        const factura = new Factura(req.body);
        const guardado = await factura.save();
        res.status(201).json(guardado);
    } catch (err) {
        console.error("Error guardando factura:", err);
        res.status(500).json({ error: err.message });
    }
});

// Actualizar estado de factura
router.patch("/:id", async (req, res) => {
    try {
        const factura = await Factura.findByIdAndUpdate(
            req.params.id,
            { estado: req.body.estado },
            { new: true }
        );
        if (!factura) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }
        res.json(factura);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar factura
router.delete("/:id", async (req, res) => {
    try {
        const factura = await Factura.findByIdAndDelete(req.params.id);
        if (!factura) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }
        res.json({ message: "Factura eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
