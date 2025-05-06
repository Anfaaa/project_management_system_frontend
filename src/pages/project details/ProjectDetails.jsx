// ProjectDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DeleteProject, GetProjectDetails, ChangeProjectStatus, CreateProjectRequest, GetUserProjectGroup } from '../../API';
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '../../const';
import Button from '../../components/button/Button';
import BackIcon from "../../components/BackIcon.jsx";
import DeleteIcon from "../../components/DeleteIcon.jsx";
import EditIcon from "../../components/EditIcon.jsx";
import AddUserIcon from '../../components/AddUserIcon.jsx';
import RemoveUserIcon from '../../components/RemoveUserIcon.jsx';
import { removeProjectMember } from "../../utils/removeProjectMember.js";
import '../../styles/details-page.css';
import '../../styles/form.css';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user_id = JSON.parse(localStorage.getItem('user_id'));
    const username = localStorage.getItem('username');
    const [projectInfo, setProjectInfo] = useState(null);
    const [status, setStatus] = useState('');
    const is_admin = JSON.parse(localStorage.getItem('is_admin'));

    useEffect(() => {
        const GetDetails = async () => {
            try {
                const response = await GetProjectDetails(id);
                console.log('Получены детали проекта:', response.data);
                setProjectInfo(response.data);
                setStatus(response.data.status)
            } catch (error) {
                console.error('Ошибка при загрузке деталий проекта:', error);
            }
        };
        GetDetails();
    }, [id]);

    const handleProjectDelete = async () => {
        if (window.confirm('Вы уверены, что хотите удалить проект?')) {
            try {
                await DeleteProject(id);
                navigate('/projects-list'); 
            } catch (error) {
                console.error('Ошибка при удалении проекта:', error);
            }
        }
    };
    
    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;

        setStatus(newStatus);
        try {
            await ChangeProjectStatus(id, newStatus);
            setProjectInfo(prevProject => ({ ...prevProject, status: newStatus }));
        } catch (error) {
            console.error(error.response?.data);
        }
    };

    const sendProjectRequest = async () => {
        if (window.confirm('Вы действительно хотите вступить в проект?\n Будет отправлена заявка на вступление.')) {
            try {
                await CreateProjectRequest(id);
                alert('Заявка успешно отправлена!');
            }
            catch (error) {
                if (error.response?.data) {
                    const errorData = error.response.data;
                    if (errorData.request_already_satisfied)
                        alert(errorData.request_already_satisfied);
                    else if (errorData.request_already_exists)
                        alert(errorData.request_already_exists);
                    else alert("Неизвестная ошибка при добавлении заявки, попробуйте позже.");
                }
                else alert("Сервер не отвечает, попробуйте позже.");
            }
        }
    }

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Вы уверены, что хотите покинуть проект?')) {
            console.log(id, userId)
            await removeProjectMember(id, userId);
            navigate('/projects-list');
        }
    };


    if (!projectInfo) {
        return <div>Ошибка! Данных о проекте нет. Попробуйте позже.</div>;
    }
    const canEditProjectInfo = user_id === projectInfo.created_by_id;
    const isParticipant = projectInfo.participants && projectInfo.participants.includes(username);

    const GetCurrentUserInfo = async (project_id, project_name) => {
        try {
            const response = await GetUserProjectGroup(project_id);
            console.log('Получены данные пользователя в проекте:', response.data);
            const UserProjectGroup = {
                project_id: project_id,
                project_name: project_name,
                group_name_in_project: response.data.group_name_in_project
            };
            localStorage.setItem('user_project_group', JSON.stringify(UserProjectGroup));

        } catch (error) {
            console.error('Ошибка при загрузке данных пользователя в проекте:', error);
        }
    }

    const ToProject = () => {
        if (is_admin)
            navigate(`/project/${id}/tasks-all`, { state: { from: window.location.pathname } });
        else {
            GetCurrentUserInfo(id, projectInfo.title)
            navigate(`/project/${id}/tasks`, { state: { from: window.location.pathname } });
        }
    }

    return(
        <div className="detail-container">
            <BackIcon onClick={() => navigate(location.state?.from || '/projects-list')} />
            {canEditProjectInfo ? (
                <div className="icon-container">
                    <EditIcon
                        onClick={() => navigate(`/project/${id}/edit`, { state: { from: window.location.pathname } })}
                    />
                    <DeleteIcon
                        onClick={handleProjectDelete} 
                    />
                    <AddUserIcon
                        onClick={() => navigate(`/project/${id}/add-member`, { state: { from: window.location.pathname } })}
                    />
                    <RemoveUserIcon
                        onClick={() => navigate(`/project/${id}/remove-member`, { state: { from: window.location.pathname } })}
                    />
                </div>
            ) : (
                isParticipant && (
                    <div className="icon-container">
                        <RemoveUserIcon
                            onClick={() => handleRemoveMember(user_id)}
                        />
                    </div>
                ))}
            <h2>{projectInfo.title}</h2>
            <p><strong>Описание:</strong></p>
            <p dangerouslySetInnerHTML={{ __html: projectInfo.description.replace(/\n/g, '<br />') }}/>
            <p><strong>Создано:</strong> {new Date(projectInfo.created_at).toLocaleString()}</p>
            <p><strong>Изменено:</strong> {new Date(projectInfo.updated_at).toLocaleString()}</p>
            <p><strong>Дата завершения проекта:</strong> {new Date(projectInfo.due_date).toLocaleDateString()}</p>
            <p><strong>Статус:  </strong> 
                <select value={status} disabled={!canEditProjectInfo} onChange={handleStatusChange}> 
                    {Object.keys(PROJECT_STATUS_LABELS).map((key) => (
                        <option key={key} value={key}>{PROJECT_STATUS_LABELS[key]}</option>
                    ))}
                </select>
            </p>
            <p><strong>Приоритет:</strong> {PRIORITY_LABELS[projectInfo.priority]}</p>
            <p><strong>Автор: </strong> 
            {projectInfo.created_by_first_name} {projectInfo.created_by_last_name} ({projectInfo.created_by_username})
            </p>
            <p><strong>Участники: </strong> 
                {projectInfo.participants && projectInfo.participants.length > 0 ? (
                    projectInfo.participants.join(', ')
                ) : (
                    <span>Нет участников.</span>
                )}
            </p>
            { projectInfo.is_gittable ? (
                <p>
                    <strong>Ссылка на репозиторий: </strong>     
                    <a href={projectInfo.git_url} target="_blank" rel="noopener noreferrer">
                        {projectInfo.git_url}
                    </a>
                </p>
            ) : (<p><strong>GitFlic не подключен.</strong></p>)}
            {
                (isParticipant || is_admin) ? (
                    <Button onClick={ToProject}>
                        Перейти к задачам
                    </Button>
                ) : (
                    <Button onClick={sendProjectRequest}>Вступить в проект</Button>
                )
            }
        </div>
    );
};
export default ProjectDetails;