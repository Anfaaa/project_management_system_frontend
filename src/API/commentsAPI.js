// commentsAPI.js

import api from './API.js'

// Создание комментария
export const CreateComment = (task_id, commentData) => 
    api.post(`task/${task_id}/create-comment/`, commentData);

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