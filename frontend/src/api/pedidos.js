import axios from "axios";

const API_URL = "http://localhost:3000/pedidos";

//  Obtener todos los pedidos ordenados por fecha de entrega ascendente
export const getPedidos = async () => {
  const res = await axios.get(`${API_URL}?_sort=entrega&_order=asc`);
  return res.data;
};

//  Agregar un pedido nuevo
export const addPedido = async (nuevoPedido) => {
  const res = await axios.post(API_URL, nuevoPedido);
  return res.data;
};

//  Actualizar un pedido (PUT)
export const updatePedido = async (id, pedidoActualizado) => {
  const res = await axios.put(`${API_URL}/${id}`, pedidoActualizado);
  return res.data;
};

//  Marcar un pedido como cancelado (PATCH)
export const cancelarPedido = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}`, { estado: "Cancelado" });
  return res.data;
};

// Eliminar definitivamente (si quisieras borrar del JSON)
export const deletePedido = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

//  Buscar pedido por número o id
export const getPedidoPorId = async (id) => {
  const res = await axios.get(`${API_URL}?id=${id}`);
  return res.data.length > 0 ? res.data[0] : null;
};
