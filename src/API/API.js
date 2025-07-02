// API.js

import axios from 'axios';

// Базовый адрес для запросов
const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

export default api;