// tasksAPI.js

import api from './API.js'

// Получение всех задач проекта
export const GetAllTasks = (project_id) => {
    return api.get(`project/${project_id}/get-all-tasks/`);
}

// Получение задач проекта, порученных текущему пользователю
export const GetMyTasks = (project_id) => {
    return api.get(`project/${project_id}/get-my-tasks/`);
}

// Получение всех задач проекта, кроме личных
export const GetNotPrivateTasks = (project_id) => {
    return api.get(`project/${project_id}/get-not-private-tasks/`);
}

// Получение задач проекта, где создатель - текущий пользователь, но исполнитель - не он
export const GetMyTasksToOthers = (project_id) => {
    return api.get(`project/${project_id}/get-my-tasks-to-others/`);
}

// Создание задачи
export const CreateTask = (taskData) => 
    api.post('create-task/', taskData);

// Получение деталей задачи
export const GetTaskDetails = (task_id) => {
    return api.get(`task/${task_id}/get-details/`);
}
 
// Изменение статуса задачи
export const ChangeTaskStatus = (task_id, newStatus) => {
    return api.patch(`task/${task_id}/change-status/`, { status: newStatus });
}

// Изменение информации о задаче
export const EditTaskInfo = (task_id, newInfo) => {
    return api.patch(`task/${task_id}/change-info/`, newInfo );
}

// Удаление задачи
export const DeleteTask = (task_id) => {
    return api.delete(`task/${task_id}/delete/`);
}