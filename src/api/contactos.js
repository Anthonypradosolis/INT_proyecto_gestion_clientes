import axios from "axios";

const API_URL = "http://localhost:3000/contactos";

/**
 *Obtener todos los contactos
 */
export const getContactos = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    throw error;
  }
};

/**
 *Añadir un nuevo contacto
 */
export const addContacto = async (nuevoContacto) => {
  try {
    const res = await axios.post(API_URL, nuevoContacto);
    return res.data;
  } catch (error) {
    console.error("Error al añadir contacto:", error);
    throw error;
  }
};

/**
 * Actualizar un contacto existente
 */
export const updateContacto = async (id, contactoActualizado) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, contactoActualizado);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    throw error;
  }
};

/**
 *Eliminar contacto por ID
 */
export const deleteContacto = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    throw error;
  }
};
