// ProjectMembersInfoPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetUsersInProject } from '../../API.js';
import ProjectSideBar from "../../components/side bars/ProjectSideBar.jsx";
import '../../styles/table.css';
import '../../styles/details-page.css';

const ProjectMembersInfoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const response = await GetUsersInProject(id);
                console.log('Получены пользователи:', response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                if (error.response && error.response.status === 403) {
                    alert('У вас нет доступа к этому ресурсу');
                    navigate(`/project/${id}/tasks`)
                }
            }
        };
        GetUsers();
    }, [id, navigate]);

    return (
        <div className="page-container-for-sidebar">
            <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={id}/>
            <div className="page-content">
                <h3>Текущий проект - «{current_user_group?.project_name}»</h3>
                <h1>Информация об участниках проекта</h1>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Группа в проекте</th>
                                <th>Дата последнего входа в систему</th>
                                <th>Дата вступления в проект</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.first_name} {user.last_name} ({user.username}),<br/>
                                    email: {user.email}
                                    </td>
                                    <td>{user.group_in_project}</td>
                                    <td>{new Date(user.last_login).toLocaleString()}</td>
                                    <td>{user.date_joined_project}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ProjectMembersInfoPage;