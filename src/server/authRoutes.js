import { login, soloAdmin, verificarToken } from "./authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);

// Ruta para verificar si el usuario es administrador
router.get("/check-admin", verificarToken, (req, res) => {
    const isAdmin = req.user?.tipo === "admin";
    res.json({ 
        isAdmin, 
        tipo: req.user?.tipo || 'user',
        dni: req.user?.dni 
    });
});

router.get("/modelos", verificarToken, soloAdmin, (req,res) => {
    res.json({message: `Hola ${req.user.dni}, estas autenticado`})
});

router.get("/clientes", verificarToken, soloAdmin, (req, res) => {
    res.json({ message: `Hola ${req.user.dni}, estas autenticado` })
});

router.get("/ventas", verificarToken, (req, res) => {
    res.json({ message: `Hola ${req.user.dni}, estas autenticado` })
});

router.get("/noticias", verificarToken, soloAdmin, (req, res) => {
    res.json({ message: `Hola ${req.user.dni}, estas autenticado` })
});

router.get("/taller", verificarToken, soloAdmin, (req, res) => {
    res.json({ message: `Hola ${req.user.dni}, estas autenticado` })
});



export default router;


