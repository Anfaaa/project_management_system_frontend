// getProjectUsersToAssign.js

import { GetUsersInProject } from "../API/managementAPI.js";

export const getProjectUsersToAssign = async ({ projectId, current_user_group, user_id, setUsers, setAssignedTo, }) => {
    if (Number(projectId) !== Number(current_user_group.project_id))
        alert("У вас нет прав доступа к этому ресурсу");

    else { 
        try {
            const response = await GetUsersInProject(projectId); 
            console.log('Полученные пользователи:', response.data);
            if (current_user_group.group_name_in_project !== 'Руководитель проекта') {
                const UserList = response.data.filter(user =>
                    (user.group_in_project !== 'Менеджер' || user.id === user_id) 
                    &&
                    user.group_in_project !== 'Руководитель проекта'
                );
                setUsers(UserList);
            } 
            else setUsers(response.data);

            if (current_user_group.group_name_in_project === 'Исполнитель') {
                const currentUserId = localStorage.getItem('user_id');
                setAssignedTo(currentUserId);
            }
            
        } catch (error) {
            console.error('Ошибка при инициализации формы:', error);
            alert("Произошла ошибка при инициализации формы.");
        }
    }
};