// interceptors.js

import api from './API.js'

// Перехватчик ошибок 401 (неавторизован) и 403 (отсутствие прав доступа) для перенаправления на страницу входа
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            alert('Вам необходимо заново войти в систему! Время сеанса истекло!');
            
            const theme = localStorage.getItem('theme_preference');
            localStorage.clear();
            localStorage.setItem('theme_preference', theme);
            
            window.location.href = '/login';
        }
        if (error.response?.status === 403) {
          alert('Недостаточно прав для выполнения этой операции, операция прекращена, доступ запрещен!');

          const theme = localStorage.getItem('theme_preference');
          localStorage.clear();
          localStorage.setItem('theme_preference', theme);
          
          window.location.href = '/login';
      }

        return Promise.reject(error);
    }
);

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