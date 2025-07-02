// projectsAPI.js

import api from './API.js'

// Создание проекта
export const CreateProject = (projectData) => 
    api.post('create-project/', projectData);

// Получение списка всех проектов
export const GetAllProjectsList = () =>
    api.get('get-all-projects-list/');

// Получение списка моих проектов
export const GetMyProjectsList = () =>
    api.get('get-my-projects-list/');

// Получение деталей проекта
export const GetProjectDetails = (project_id) => {
    console.log('call')
    return api.get(`project/${project_id}/get-details/`);
}

// Изменение статуса проекта
export const ChangeProjectStatus = (project_id, newStatus) => {
    return api.patch(`project/${project_id}/change-status/`, { status: newStatus });
}

// Удаление проекта
export const DeleteProject = (project_id) => {
    return api.delete(`project/${project_id}/delete/`);
}

// Изменение информации о проекте
export const EditProjectInfo = (project_id, newInfo) => {
    return api.patch(`project/${project_id}/change-info/`, newInfo );
}