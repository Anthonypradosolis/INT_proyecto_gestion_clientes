import axios from "axios";

const API_URL = 'http://localhost:5000/api/reservas'

// Función auxiliar para obtener el token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  return {};
};

export const getReservas = (email = null) => {
  const params = email ? { email } : {};
  return axios.get(API_URL, { params }).then(res => res.data);
}

export const getReservaById = (id) => {
  return axios.get(`${API_URL}/${id}`).then(res => res.data);
}

export const verificarReserva = (vehiculoId) => {
  return axios.get(`${API_URL}/verificar/${vehiculoId}`).then(res => res.data);
}

export const addReserva = (reserva) => {
  const token = sessionStorage.getItem('token');
  console.log('🔑 Token en addReserva:', token ? 'SÍ existe' : 'NO existe');
  console.log('📦 Headers que se enviarán:', {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : 'Sin token'
  });
  
  return axios.post(API_URL, reserva, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  }).then(res => res.data);
}

export const updateReserva = (id, reserva) => {
  return axios.put(`${API_URL}/${id}`, reserva, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  }).then(res => res.data);
}

export const cancelarReserva = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  }).then(res => res.data);
}
