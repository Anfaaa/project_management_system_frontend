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

export const UserLogout = () => 
    api.post('logout/');

// // Получение токенов из localStorage
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

        if (error.response?.status === 401) {
            // Проверяем, что это не повторная попытка запроса на refresh токен
            if (originalRequest.url.includes('token/refresh/')) {
                console.error('Refresh token недействителен или истек. Перенаправляем на страницу входа.');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (!originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const new_access_token = await getRefreshedAccessToken();

                    if (new_access_token) {
                        originalRequest.headers['Authorization'] = `Bearer ${new_access_token}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Ошибка обновления токена:', refreshError);
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
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

// Получение всех задач проекта
export const GetAllTasks = (project_id) => {
    return api.get(`project/${project_id}/get-all-tasks/`);
}

// Получение задач проекта, порученных текущему пользователю
export const GetMyTasks = (project_id) => {
    return api.get(`project/${project_id}/get-my-tasks/`);
}

// Получение всех задач проекта, кроме личных
export const GetNotPrivateTasks= (project_id) => {
    return api.get(`project/${project_id}/get-not-private-tasks/`);
}

// Получение задач проекта, где создатель - текущий пользователь, но исполнитель - не он
export const GetMyTasksToOthers = (project_id) => {
    return api.get(`project/${project_id}/get-my-tasks-to-others/`);
}

// Получение группы текущего пользователя в проекте
export const GetUserProjectGroup = (project_id) => {
    return api.get(`project/${project_id}/get-user-group/`);
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
 
// Удаление задачи
export const DeleteTask = (task_id) => {
    return api.delete(`task/${task_id}/delete/`);
}
 
// Изменение информации о задаче
export const EditTaskInfo = (task_id, newInfo) => {
    return api.patch(`task/${task_id}/change-info/`, newInfo );
}
 
// Создание комментария
export const CreateComment = (commentData) => 
    api.post(`create-comment/`, commentData);

// Получение комментариев
export const GetComments = (task_id) => {
    return api.get(`task/${task_id}/get-comments/`);
}
 
// Удаление комментария
export const DeleteComment = (comment_id) => {
    return api.delete(`comment/${comment_id}/delete/`);
}
 
// Изменение комментария
export const EditComment = (comment_id, newInfo) => {
    return api.patch(`comment/${comment_id}/edit/`, newInfo);
}

// Получение информации о текущем пользователе для профиля
export const GetUserProfileInfo = () =>
    api.get('get-user-profile-info/');
 
// Удаление аккаунта текущего пользователя
export const DeleteUserAccount = () =>
    api.delete('delete-user-account/');
 
// Изменение информации о текущем пользователе в профиле
export const ChangeUserProfileInfo = (newInfo) =>
    api.patch('change-user-profile-info/', newInfo);

// Исключение члена проекта
export const ChangeProjectMemberGroup = (project_id, {user_id}) => {
    return api.patch(`project/${project_id}/change-member-group/`, {user_id});
}

export const GetAllUsersInfo = () =>
    api.get('get-all-users-info/');

export const ChangeProjectLeaderRights = (user_id) =>
    api.patch('change-project-leader-rights/', user_id)

export const ChangeAccountActivation = (user_id) =>
    api.patch('change-account-activation/', user_id)

export const GetStatusDistribution = (project_id) => {
    return api.get(`project/${project_id}/statistics/status-distribution/`);
}

export const GetPriorityDistribution = (project_id) => {
    return api.get(`project/${project_id}/statistics/priority-distribution/`);
}

export const GetOverloadedUsers = (project_id) => {
    return api.get(`project/${project_id}/statistics/overloaded-users/`);
}

export const GetUnderloadedUsers = (project_id) => {
    return api.get(`project/${project_id}/statistics/underloaded-users/`);
}

export const GetUserTaskDistribution = (project_id, user_id) => {
    return api.get(`project/${project_id}/statistics/task-status-distribution/user/${user_id}/`);
}

export const GetActionTypes = () =>
    api.get('get-action-types/');

export const GetUserActions = (user_id, type_id) => {
    return api.get(`get-actions/user/${user_id}/type/${type_id}/`);
}

// Восстановление пароля
export const PasswordReset = ( {email} ) =>
    api.post('/password-reset/', {email});

// Функция для восстановления пароля по ссылке в письме
export const PasswordResetConfirm = async (uidb64, token, {new_password}) => {
    return api.post(`/password-reset-confirm/${uidb64}/${token}/`, {new_password});
};