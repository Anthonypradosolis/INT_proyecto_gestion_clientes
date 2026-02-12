import axios from "axios";

const API_URL = 'http://localhost:5000/api/articulos'

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

export const getArticulos = () => {
  return axios.get(API_URL).then(res => res.data);
}

export const getArticulosById = (id) => {
  return axios.get(`${API_URL}/${id}`).then(res => res.data);
}

export const addArticulo = (formData) => {
  return axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders()
    }
  }).then(res => res.data);
}

export const deleteArticulo = (id) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  }).then(res => res.data);
}

export const updateArticulo = (id, articuloActualizado) => {
  return axios.put(`${API_URL}/${id}`, articuloActualizado, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders()
    }
  }).then(res => res.data);
}

export const updateEstadoArticulo = (id, estado) => {
  return axios.put(`${API_URL}/${id}`, { estado }, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  }).then(res => res.data);
}

