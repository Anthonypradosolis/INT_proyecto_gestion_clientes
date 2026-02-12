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
import reservasRoutes from "./reservasRoutes.js"; // ruta al router de reservas
import solicitudesRoutes from "./solicitudesRoutes.js"; // ruta al router de solicitudes de empleo
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
app.use("/api/reservas", reservasRoutes);
app.use("/api/solicitudes", solicitudesRoutes);



// Rutas DE MONGOOSE, JSON SERVER NO ES NECESARIO LAS RUTAS LAS CREA AUTOMATICAMENTE
// json-server es un backend ya construido.
// Express es un backend que TÚ construyes.
// Por eso json-server no requiere rutas y Express sí.
app.use("/api/articulos", articulosRoutes);

// ruta crear sesión checkout
app.post("/create-checkout-session", async (req, res) => {
    try {
        const { items, amount } = req.body;

        // Calcular el total de los items sin descuento
        const subtotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        
        // Calcular el factor de descuento si aplica
        const factorDescuento = amount < subtotal ? amount / subtotal : 1;
        
        console.log('💰 Creando sesión de Stripe:');
        console.log('   Subtotal:', subtotal);
        console.log('   Monto final recibido:', amount);
        console.log('   Factor de descuento:', factorDescuento);

        // Crear line items ajustando los precios con el descuento aplicado proporcionalmente
        const lineItems = items.map((item) => {
            const precioConDescuento = item.precio * factorDescuento;
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.nombre,
                    },
                    unit_amount: Math.round(precioConDescuento * 100), // precio con descuento en céntimos
                },
                quantity: item.cantidad,
            };
        });

        // Verificar el total calculado
        const totalCalculado = items.reduce((acc, item) => {
            return acc + (Math.round(item.precio * factorDescuento * 100) / 100) * item.cantidad;
        }, 0);
        
        console.log('   Total calculado para Stripe:', totalCalculado);
        console.log('   Line items:', JSON.stringify(lineItems, null, 2));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        console.log('✅ Sesión de Stripe creada exitosamente');
        res.json({ url: session.url });
    } catch (error) {
        console.error("❌ Error creating checkout session:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
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
