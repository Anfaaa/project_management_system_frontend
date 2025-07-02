// UsersManagementPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllUsersInfo } from '../API/usersAPI.js';
import { ChangeProjectLeaderRights, ChangeAccountActivation } from '../API/managementAPI.js';
import DefaultSideBar from "../components/side bars/DefaultSideBar.jsx";
import SearchIcon from "../components/icons/SearchIcon.jsx";
import Button from '../components/button/Button.jsx';
import '../styles/table.css';
import '../styles/details-page.css';
import '../styles/form.css';

const UsersManagementPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const currentUserId = Number(localStorage.getItem('user_id'));
    const [searchedObject, setSearchedObject] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const response = await GetAllUsersInfo();

                console.log('Получены пользователи:', response.data);

                const userList = response.data.filter(user => 
                    user.id !== currentUserId
                );
                setUsers(userList);
            } 
            catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                alert('Произошла ошибка при загрузке пользователей, попробуйте позднее.');
            }
        };

        GetUsers();

    }, [navigate, currentUserId, refreshTrigger]);

    const filteredUsers = users.filter(user => 
        !searchedObject || user.username.toLowerCase().includes(searchedObject.toLowerCase())
    );

    const handleChangeRights = async (user_id) => {
        if (window.confirm('Вы уверены, что хотите изменить права этого пользователя?')) {
            await ChangeProjectLeaderRights({ user_id });

            setRefreshTrigger(prev => !prev);
        }
    };

    const handleChangeActivation = async (user_id) => {
        if (window.confirm('Вы уверены, что хотите изменить доступ к аккаунту этого пользователя?')) {
            await ChangeAccountActivation({ user_id });

            setRefreshTrigger(prev => !prev);
        }
    };

    return (
        <div className="page-container-for-sidebar">
            <DefaultSideBar/>
            <div className="page-content">
                <h1>Управление правами и доступом пользователей</h1>
                <div className="tools-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск пользователей по username..."
                            className="search-input"
                            value={searchedObject}
                            onChange={(e) => setSearchedObject(e.target.value)}
                        />
                        <SearchIcon/>
                    </div>
                </div>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Наличие прав руководителя проектов</th>
                                <th>Действия</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.first_name} {user.last_name} ({user.username}),<br/>
                                        email: {user.email}
                                    </td>
                                    <td>
                                        {user.is_project_leader ? (
                                            <span>Руководитель проектов</span>
                                        ) : (
                                            <span>Обычный пользователь</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.is_project_leader ? (
                                            <Button onClick={() => handleChangeRights(user.id)}>Изъять права</Button>
                                        ) : (
                                            <Button onClick={() => handleChangeRights(user.id)}>Выдать права</Button>
                                        )}
                                    </td>
                                    <td>
                                        {user.is_active ? (
                                            <span>Активен</span>
                                        ) : (
                                            <span>Заблокирован</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.is_active ? (
                                            <Button onClick={() => handleChangeActivation(user.id)}>Заблокировать</Button>
                                        ) : (
                                            <Button onClick={() => handleChangeActivation(user.id)}>Активировать</Button>
                                        )}
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

export default UsersManagementPage;