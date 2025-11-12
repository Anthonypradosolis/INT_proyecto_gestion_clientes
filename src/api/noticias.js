import axios from "axios";

const API_URL = "http://localhost:3000/noticias";

/**
 * Obtener todas las noticias
 * @returns {Array} Lista de noticias desde la API
 */
export const getNoticias = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener las noticias:", error);
    throw error;
  }
};

/**
 * Añadir una nueva noticia
 * @param {Object} noticia - Objeto con los datos de la noticia
 */
export const addNoticia = async (noticia) => {
  try {
    const res = await axios.post(API_URL, noticia);
    return res.data;
  } catch (error) {
    console.error("❌ Error al añadir la noticia:", error);
    throw error;
  }
};

/**
 * Actualizar una noticia existente
 * @param {string|number} id - ID de la noticia
 * @param {Object} noticia - Datos actualizados de la noticia
 */
export const updateNoticia = async (id, noticia) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, noticia);
    return res.data;
  } catch (error) {
    console.error(`❌ Error al actualizar la noticia con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar noticia por ID
 * @param {string|number} id - ID de la noticia a eliminar
 */
export const deleteNoticia = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`❌ Error al eliminar la noticia con ID ${id}:`, error);
    throw error;
  }
};
