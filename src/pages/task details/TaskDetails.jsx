// TaskDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DeleteTask, GetTaskDetails, ChangeTaskStatus } from '../../API';
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '../../const';
import { checkPermission } from '../../utils/checkPermission';
import EditIcon from '../../components/EditIcon.jsx';
import DeleteIcon from '../../components/DeleteIcon.jsx';
import BackIcon from "../../components/BackIcon.jsx";
import '../../styles/details-page.css';
import '../../styles/form.css';
import CommentsSection from './CommentsSection';

const TaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
    const user_id = JSON.parse(localStorage.getItem('user_id'));
    const is_admin = localStorage.getItem('is_admin');
    const [taskInfo, setTaskInfo] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const GetDetails = async () => {
            try {
                const response = await GetTaskDetails(id);
                console.log('Получены детали задачи:', response.data);
                setTaskInfo(response.data);
                setStatus(response.data.status)
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    alert('У вас нет доступа к этому ресурсу');
                    navigate('/projects-list')
                }
                console.error('Ошибка при загрузке деталий задачи:', error);
            }
        };
        GetDetails();
    }, [id, navigate]);

    const handleTaskDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
            try {
                await DeleteTask(id);
                navigate(location.state?.from ||  `/project/${current_user_group.project_id}/tasks`); 
            } catch (error) {
                console.error('Ошибка при удалении задачи:', error);
            }
        }
    };
    
    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;

        setStatus(newStatus);
        try {
            await ChangeTaskStatus(id, newStatus);
            setTaskInfo(prevTask => ({ ...prevTask, status: newStatus }));
        } catch (error) {
            console.error(error.message);
        }
    };

    if (!taskInfo) {
        return <div>Ошибка! Данных о задаче нет. Попробуйте позже.</div>;
    }
    const canEditTaskInfo = user_id === taskInfo.created_by_id;
    console.log('canEditTaskInfo', canEditTaskInfo )
    const canEditTaskStatus = (user_id === taskInfo.created_by_id) || (user_id === taskInfo.assigned_to_id);
    var is_project_leader = false
    if (!is_admin)
        is_project_leader = checkPermission(current_user_group.group_name_in_project, taskInfo.project_id, Number(current_user_group.project_id))
    const canViewComments = (canEditTaskStatus) || (is_project_leader) || (is_admin)

    return(
        <div className="detail-container">
            <BackIcon onClick={() => navigate(location.state?.from || `/project/${current_user_group.project_id}/tasks`)} />
            {canEditTaskInfo && (
                <div className="icon-container">
                    <EditIcon
                        onClick={() => navigate(`/task/${id}/edit`, { state: { from: window.location.pathname,
                            projectId: taskInfo.project_id
                         } })}
                    />
                    <DeleteIcon
                        onClick={handleTaskDelete} 
                    />
                </div>
            )}
            <h2>{taskInfo.title}</h2>
            <p><strong>Проект:</strong> {taskInfo.project_name}</p>
            <p><strong>Описание:</strong></p>
            <p dangerouslySetInnerHTML={{ __html: taskInfo.description.replace(/\n/g, '<br />') }}/>
            <p><strong>Создано:</strong> {new Date(taskInfo.created_at).toLocaleString()}</p>
            <p><strong>Изменено:</strong> {new Date(taskInfo.updated_at).toLocaleString()}</p>
            <p><strong>Дата сдачи:</strong> {new Date(taskInfo.due_date).toLocaleDateString()}</p>
            <p><strong>Статус:  </strong> 
                <select value={status} disabled={!canEditTaskStatus} onChange={handleStatusChange}> 
                    {Object.keys(TASK_STATUS_LABELS).map((key) => (
                        <option key={key} value={key}>{TASK_STATUS_LABELS[key]}</option>
                    ))}
                </select>
            </p>
            <p><strong>Приоритет:</strong> {PRIORITY_LABELS[taskInfo.priority]}</p>
            <p><strong>Автор: </strong> 
            {taskInfo.created_by_first_name} {taskInfo.created_by_last_name} ({taskInfo.created_by_username})
            </p>
            <p><strong>Исполнитель: </strong> 
            {taskInfo.assigned_to_first_name} {taskInfo.assigned_to_last_name} ({taskInfo.assigned_to_username})
            </p>
            { taskInfo.is_gittable ? (
                <p>
                    <strong>Ссылка на файл в репозитории: </strong>     
                    <a href={taskInfo.git_url} target="_blank" rel="noopener noreferrer">
                        {taskInfo.git_url}
                    </a>
                </p>
            ) : (<p><strong>GitFlic не подключен.</strong></p>)}
            {canViewComments && (<CommentsSection task_id = {id} can_add_comments = {canEditTaskStatus}/>) }
        </div>
    );
};
export default TaskDetails;