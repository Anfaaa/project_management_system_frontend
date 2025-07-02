// checkPermission.js

// Функция для проверки прав руководителя проекта
export const checkPermission = (user_group, project_id, saved_project_id) => {
    if (project_id === saved_project_id) {
        if (user_group === 'Руководитель проекта') {
            return true;
        }
    }
    else return false;
};