// removeProjectMember.js

import { RemoveMemberFromProject } from '../API/managementAPI.js';

export const removeProjectMember = async (projectId, userId) => {
    try {
        const response = await RemoveMemberFromProject(projectId, userId);
        console.log('Пользователь исключен: ', response.data);
        alert('Успешное исключение.');
    }
    catch (error) {
        if (error.response?.data) {
            const errorData = error.response.data;
            console.error(errorData);

            if (errorData.no_rights) 
                alert(errorData.no_rights);

            else if (errorData.request_already_satisfied)
                alert(errorData.request_already_satisfied);

            else alert("Неизвестная ошибка при исключении участника, \nпопробуйте позже.");
        }
        else alert("Сервер не отвечает, попробуйте позже.");
    }
};