// Faz o frontend conversar com o backend

import axios from 'axios';

// Cria instância do axios apontando pro backend
const api = axios.create({
    baseURL: '/api'
    // Usamos '/api' em vez de 'localhost:3001/api'
});

// Antes de cada requisição, coloca o token no header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Se o servidor devolver 401, desloga o usuário
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;