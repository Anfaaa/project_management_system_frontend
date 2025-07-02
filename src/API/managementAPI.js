// managementAPI.js

import api from './API.js'

// Создание запроса на вступление в проект
export const CreateProjectRequest = (project_id) => {
    return api.post(`project/${project_id}/create-request/`, { 'project_id': project_id });
}

// Получение списка пользователей для добавления в проект
export const GetUsersNotInProject = (project_id) => {
    return api.get(`project/${project_id}/get-none-users/`);
}

// Получение запросов на вступление в проект с информацией о пользователях
export const GetProjectRequests = (project_id) => {
    return api.get(`project/${project_id}/get-requests/`);
}

 // Добавление нового члена проекта
export const AddMemberToProject = (project_id, memberData) => {
    return api.post(`project/${project_id}/add-member/`, memberData);
}

// Изменение статуса запроса на вступление в проект
export const ChangeProjectRequestStatus = (project_id, request_id, newStatus) => {
    return api.patch(`project/${project_id}/request/${request_id}/set-status/`, { status: newStatus });
}

// Получение списка пользователей - участников проекта
export const GetUsersInProject = (project_id) => {
    return api.get(`project/${project_id}/get-users/`);
}

// Исключение члена проекта
 export const RemoveMemberFromProject = (project_id, user_id) => {
    return api.delete(`project/${project_id}/remove-member/${user_id}/`);
}

// Получение группы текущего пользователя в проекте
export const GetUserProjectGroup = (project_id) => {
    return api.get(`project/${project_id}/get-user-group/`);
}

// Исключение члена проекта
export const ChangeProjectMemberGroup = (project_id, {user_id}) => {
    return api.patch(`project/${project_id}/change-member-group/`, {user_id});
}

// Изменение прав управления проектами
export const ChangeProjectLeaderRights = (user_id) =>
    api.patch('change-project-leader-rights/', user_id)

// Изменение активации/блокировки аккаунта
export const ChangeAccountActivation = (user_id) =>
    api.patch('change-account-activation/', user_id)