// statisticsAPI.js

import api from './API.js'

// Получение данных о распределении задач проекта по статусам
export const GetStatusDistribution = (project_id) => {
    return api.get(`project/${project_id}/statistics/status-distribution/`);
}

// Получение данных о распределении задач проекта по приоритетам
export const GetPriorityDistribution = (project_id) => {
    return api.get(`project/${project_id}/statistics/priority-distribution/`);
}

// Получение данных о самых загруженных участниках проекта
export const GetOverloadedUsers = (project_id) => {
    return api.get(`project/${project_id}/statistics/overloaded-users/`);
}

// Получение данных о самых незагруженных участниках проекта
export const GetUnderloadedUsers = (project_id) => {
    return api.get(`project/${project_id}/statistics/underloaded-users/`);
}

// Получение данных о распределении задач пользователя в проекте по статусам
export const GetUserTaskDistribution = (project_id, user_id) => {
    return api.get(`project/${project_id}/statistics/task-status-distribution/user/${user_id}/`);
}