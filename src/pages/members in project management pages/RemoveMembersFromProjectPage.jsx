// RemoveMembersFromProjectPage.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GetUsersInProject } from '../../API/managementAPI.js';
import { removeProjectMember } from "../../utils/removeProjectMember.js";
import './member-management-page.css';
import '../../styles/table.css';
import '../../styles/details-page.css';
import BackIcon from "../../components/icons/BackIcon.jsx";
import Button from '../../components/button/Button';

const RemoveMembersFromProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const currentUserId = Number(localStorage.getItem('user_id'));

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
    }, [id, refreshTrigger, currentUserId]);

    const handleRemoveMember = async (userId) => {
        if (window.confirm('Вы уверены, что хотите исключить пользователя?')) {
            await removeProjectMember(id, userId);
            setRefreshTrigger(prev => !prev);
        }
    };

    return (
        <div className='member-management-page-container'>
            <div className='detail-container'>
                <BackIcon onClick={() => navigate(location.state?.from || '/projects-list')} />
                <h1>Исключение пользователей из проекта</h1>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Группа в проекте</th>
                                <th>Исключение</th>
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
                                        <Button onClick={() => handleRemoveMember(user.id)}>Исключить</Button>
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

export default RemoveMembersFromProjectPage;