// api/facturas.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/facturas";

// Obtener todas las facturas
export const getFacturas = async () => {
    const token = sessionStorage.getItem('token');
    const res = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};

// Obtener una factura por ID
export const getFacturaPorId = async (id) => {
    const token = sessionStorage.getItem('token');
    const res = await axios.get(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};

// Crear una nueva factura
export const addFactura = async (nuevaFactura) => {
    const token = sessionStorage.getItem('token');
    const res = await axios.post(API_URL, nuevaFactura, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};

// Actualizar estado de factura
export const updateEstadoFactura = async (id, estado) => {
    const token = sessionStorage.getItem('token');
    const res = await axios.patch(`${API_URL}/${id}`, { estado }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};

// Eliminar factura
export const deleteFactura = async (id) => {
    const token = sessionStorage.getItem('token');
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return res.data;
};
