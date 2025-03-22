// API.js

import axios from 'axios';

// Базовый адрес
const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
});

// Регистрация
export const UserRegistration = (userData) => 
    api.post('registration/', userData);

// Вход в систему
export const UserLogin = (userData) => 
    api.post('login/', userData);

// Получение токенов из localStorage
// const getAccessToken = () => 
//     localStorage.getItem('access_token');
const getRefreshToken = () => 
    localStorage.getItem('refresh_token');

// Обновление access token с помощью refresh token
const getRefreshedAccessToken = async () => {
    const refresh_token = getRefreshToken();

    if (!refresh_token)
        return null;

    try {
        const response = await api.post('token/refresh/', {refresh: refresh_token});
        const { new_access_token, new_refresh_token } = response.data;
        localStorage.setItem('access_token', new_access_token);
        localStorage.setItem('refresh_token', new_refresh_token)
        return new_access_token;
    }
    catch (error) {
        console.error('Ошибка обновления токенов:', error);
        return null;
    }
};

// Перехватчик ошибок 401 для обновления токена или перенаправления на страницу входа
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
    
            try {
                const new_access_token = await getRefreshedAccessToken();

                if (new_access_token) {
                    originalRequest.headers['Authorization'] = `Bearer ${new_access_token}`;
                    return api(originalRequest)
                }
            }
            catch (refreshError){
                console.error('Ошибка обновления токена:', refreshError)
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
); 
export default api;


// Добавление токена в заголовок перед каждым запросом
api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

