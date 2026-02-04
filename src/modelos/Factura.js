// modelos/Factura.js
import mongoose from "mongoose";

const FacturaSchema = new mongoose.Schema(
    {
        numeroFactura: {
            type: Number,
            required: true,
            unique: true
        },
        fecha: {
            type: Date,
            default: Date.now
        },
        cliente: {
            type: String,
            required: true
        },
        items: [
            {
                id: { type: String },
                nombre: { type: String, required: true },
                cantidad: { type: Number, required: true },
                precioUnitario: { type: Number, required: true },
                total: { type: Number, required: true }
            }
        ],
        total: {
            type: Number,
            required: true
        },
        estado: {
            type: String,
            default: "Completado"
        }
    },
    {
        collection: "facturas",
        timestamps: true
    }
);

export default mongoose.model("Factura", FacturaSchema);
