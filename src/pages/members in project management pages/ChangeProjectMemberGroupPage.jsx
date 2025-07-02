// ChangeProjectMemberGroupPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GetUsersInProject, ChangeProjectMemberGroup } from '../../API/managementAPI.js';
import ProjectSideBar from "../../components/side bars/ProjectSideBar.jsx";
import '../../styles/table.css';
import '../../styles/details-page.css';
import Button from '../../components/button/Button.jsx';

const ChangeProjectMemberGroupPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const currentUserId = Number(localStorage.getItem('user_id'));
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const response = await GetUsersInProject(id);
                
                console.log('Получены пользователи:', response.data);
                const userList = response.data.filter(user => 
                    user.id !== currentUserId
                );
                
                setUsers(userList);
            } 
            catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                alert("Произошла ошибка при загрузке пользователей, попробуйте позднее.");
            }
        };
        
        GetUsers();
    }, [id, refreshTrigger, currentUserId, navigate]);

    const handleChangeMemberGroup = async (project_id, user_id) => {
        if (window.confirm('Вы уверены, что хотите изменить группу этого пользователя?')) {
            await ChangeProjectMemberGroup(project_id, { user_id });

            alert('Группа успешно изменена!');
            setRefreshTrigger(prev => !prev);
        }
    };

    return (
        <div className="page-container-for-sidebar">
            <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={id}/>
            <div className="page-content">
                <h3>Текущий проект - «{current_user_group?.project_name}»</h3>
                <h1>Изменение группы участников проекта</h1>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Группа в проекте</th>
                                <th>Изменить группу</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.first_name} {user.last_name} ({user.username}),<br/>
                                        email: {user.email}
                                    </td>
                                    <td>{user.group_in_project}</td>
                                    <td>
                                        {user.group_in_project === 'Исполнитель' ? (
                                            <Button onClick={() => handleChangeMemberGroup(id, user.id)}>Повысить</Button>
                                        ) : (
                                            <Button onClick={() => handleChangeMemberGroup(id, user.id)}>Понизить</Button>
                                        )
                                    }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ChangeProjectMemberGroupPage;