import axios from 'axios';

const API_URL = 'http://localhost:5000/api/solicitudes';

// Función para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Obtener todas las solicitudes (solo admin)
export const getSolicitudes = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    throw error;
  }
};

// Crear nueva solicitud
export const addSolicitud = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    throw error;
  }
};

// Actualizar solicitud (solo admin)
export const updateSolicitud = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    throw error;
  }
};

// Eliminar solicitud (solo admin)
export const deleteSolicitud = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    throw error;
  }
};

// Obtener URL de foto
export const getFotoUrl = (filename) => {
  return `http://localhost:5000/api/solicitudes/foto/${filename}`;
};
