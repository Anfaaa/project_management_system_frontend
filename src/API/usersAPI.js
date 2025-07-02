// usersAPI.js

import api from './API.js'

// Регистрация пользователя
export const UserRegistration = (userData) => 
    api.post('registration/', userData);

// Вход в систему
export const UserLogin = (userData) => 
    api.post('login/', userData);

// Выход из системы
export const UserLogout = () => 
    api.post('logout/');

// Получение информации о текущем пользователе для профиля
export const GetUserProfileInfo = () =>
    api.get('get-user-profile-info/');
 
// Удаление аккаунта текущего пользователя
export const DeleteUserAccount = () =>
    api.delete('delete-user-account/');
 
// Изменение информации о текущем пользователе в профиле
export const ChangeUserProfileInfo = (newInfo) =>
    api.patch('change-user-profile-info/', newInfo);

// Получение информации о всех пользователях системы
export const GetAllUsersInfo = () =>
    api.get('get-all-users-info/');

// Проверка данных пользователя для восстановления пароля
export const PasswordReset = ( {email} ) =>
    api.post('/password-reset/', {email});

// Восстановления пароля по ссылке в письме
export const PasswordResetConfirm = async (uidb64, token, {new_password}) => {
    return api.post(`/password-reset-confirm/${uidb64}/${token}/`, {new_password});
};

// Получение списка типов действий пользователя в системе
export const GetActionTypes = () =>
    api.get('get-action-types/');

// Получение списка действий пользователя в системе
export const GetUserActions = (user_id, type_id) => {
    return api.get(`get-actions/user/${user_id}/type/${type_id}/`);
}