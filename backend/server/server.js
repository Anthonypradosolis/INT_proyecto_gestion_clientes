import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stripe from "stripe";
import authRoutes from "./authRoutes.js";
import contactoRoutes from "./contactos.js";

// a diferencia de json-server, aquí necesita configurar las rutas y controladores manualmente
// json-server crea automáticamente las rutas basadas en el archivo JSON, mongoose requiere definir esquemas y modelos
// MONGOSEE NO SABE NADA DE RUTAS CONTROLADRES Y MODELOS, HAY QUE CREARLOS MANUALMENTE

import articulosRoutes from "./articulosRoutes.js"; // ruta al router backend
import facturasRoutes from "./facturasRoutes.js"; // ruta al router de facturas
import { soloAdmin, verificarToken } from "./authController.js";

// Configurar __dirname primero para poder usarlo con dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar dotenv para cargar el .env desde la carpeta backend
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000

// Configuración de Stripe: carga de la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware CORS - debe ir ANTES de las rutas
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/facturas", verificarToken, facturasRoutes);



// Rutas DE MONGOOSE, JSON SERVER NO ES NECESARIO LAS RUTAS LAS CREA AUTOMATICAMENTE
// json-server es un backend ya construido.
// Express es un backend que TÚ construyes.
// Por eso json-server no requiere rutas y Express sí.
app.use("/api/articulos", articulosRoutes);

// Verificar variable
//console.log("MONGODB_URI =", process.env.MONGODB_URI);

app.use("/api/articulos", articulosRoutes, verificarToken, soloAdmin)

// ruta crear sesión checkout
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items } = req.body;

        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.nombre,
                },
                unit_amount: Math.round(item.precio * 100), // convertir a céntimos
            },
            quantity: item.cantidad,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success', //crear estos componentes en frontend
            cancel_url: 'http://localhost:5173/cancel', //crear estos componentes en frontend
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//
/// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB a la base de datos BBDD"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));

//Iniciar el servidor Express en el puerto especificado
app.listen(PORT, () => {
    console.log(`Server Express está corriendo en el puerto: ${PORT}`);
});
