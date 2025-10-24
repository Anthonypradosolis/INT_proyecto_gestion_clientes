import axios from 'axios'

const API_URL = 'http://localhost:3000/noticias'

export const getNoticias = () => axios.get(API_URL).then(res => res.data)

export const addNoticia = (noticia) => axios.post(API_URL, noticia).then(res => res.data)

export const updateNoticia = (id, noticia) => axios.put(`${API_URL}/${id}`, noticia).then(res => res.data)

export const deleteNoticia = (id) => axios.delete(`${API_URL}/${id}`).then(res => res.data)
