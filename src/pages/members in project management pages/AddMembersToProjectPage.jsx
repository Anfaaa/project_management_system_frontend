// AddMembersToProjectPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { GetUsersNotInProject, GetProjectRequests, AddMemberToProject, ChangeProjectRequestStatus } from '../../API';
import './member-management-page.css'
import '../../styles/table.css';
import '../../styles/details-page.css';
import BackIcon from "../../components/BackIcon.jsx";
import Button from '../../components/button/Button';
import SearchIcon from "../../components/SearchIcon.jsx";

const AddMembersToProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [groups, setGroups] = useState({});
    const [searchedObject, setSearchedObject] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    useEffect(() => {
            const GetUsers = async () => {
                try {
                    const response = await GetUsersNotInProject(id);
                    console.log('Получены пользователи:', response.data);
                    setUsers(response.data);
                } catch (error) {
                    console.error('Ошибка при загрузке пользователей:', error);
                }
            };
            const GetRequests = async () => {
                try {
                    const response = await GetProjectRequests(id);
                    console.log('Получены заявки:', response.data);
                    setRequests(response.data);
                }
                catch (error) {
                    console.error('Ошибка при загрузке заявок:', error);
                }
            }
            GetUsers();
            GetRequests();
        }, [id, refreshTrigger]);

    const AddMember = async (user_id) => {
        const user_group_id = groups[user_id] || "Исполнитель";

        try {
            const response = await AddMemberToProject(id, {
                user_id,
                'project_id': id,
                user_group_id,
            });
            console.log('Пользователь успешно добавлен: ', response.data)
            alert('Пользователь успешно добавлен!');
            setRefreshTrigger(prev => !prev);
        }
        catch (error){
            if (error.response?.data) {
                const errorData = error.response.data;
                console.error(errorData)
                if (errorData.no_rights) 
                    alert(errorData.no_rights);
                else if (errorData.request_already_satisfied)
                    alert(errorData.request_already_satisfied);
                else alert("Неизвестная ошибка при добавлении участника, \nпопробуйте позже.");
            }
            else alert("Сервер не отвечает, попробуйте позже.");
        }
    }

    const RejectRequest = async (request_id) => {
        try {
            const response = await ChangeProjectRequestStatus(id, request_id, "Отклонена");
            console.log('Заявка отклонена: ', response.data)
            alert('Заявка отклонена.');
            setRefreshTrigger(prev => !prev);
        }
        catch (error){
            if (error.response?.data) {
                const errorData = error.response.data;
                console.error(errorData)
                if (errorData.no_rights) 
                    alert(errorData.no_rights);
                else if (errorData.request_already_satisfied)
                    alert(errorData.request_already_satisfied);
                else alert("Неизвестная ошибка при добавлении участника, \nпопробуйте позже.");
            }
            else alert("Сервер не отвечает, попробуйте позже.");
        }
    }

    const handleGroupChange = (userId, newGroup) => {
        setGroups(prevState => ({
            ...prevState,
            [userId]: newGroup,
        }));
    };

    const filteredUsers = users.filter(user => 
        !searchedObject || user.username.toLowerCase().includes(searchedObject.toLowerCase()));

    return (
        <div className='member-management-page-container'>
            <div className='detail-container'>
                <BackIcon onClick={() => navigate(location.state?.from || '/projects-list')} />
                <h1>Добавление пользователей в проект</h1>
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
                                <th>Выбор группы в проекте</th>
                                <th>Добавление</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.first_name} {user.last_name} ({user.username}),<br/>
                                    email: {user.email}
                                    </td>
                                    <td>
                                        <select value={groups[user.id] || 'Исполнитель'} 
                                        onChange={(e) => handleGroupChange(user.id, e.target.value)}>
                                            <option>Исполнитель</option>
                                            <option>Менеджер</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Button onClick={() => AddMember(user.id)}>Добавить</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Статус заявки</th>
                                <th>Дата подачи заявки</th>
                                <th>Выбор группы в проекте</th>
                                <th>Добавление</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(request => (
                                <tr key={request.id}>
                                    <td>{request.first_name} {request.last_name} ({request.username}),<br/>
                                    email: {request.email}
                                    </td>
                                    <td>{request.status}</td>
                                    <td>{new Date(request.created_at).toLocaleString()}</td>
                                    <td>
                                        <select value={groups[request.created_by_id] || 'Исполнитель'} 
                                        onChange={(e) => handleGroupChange(request.created_by_id, e.target.value)}>
                                            <option>Исполнитель</option>
                                            <option>Менеджер</option>
                                        </select>
                                    </td>
                                    <td>
                                        <Button onClick={() => AddMember(request.created_by_id)}>Принять</Button>
                                        {request.status!=="Отклонена" && (<Button onClick={() => RejectRequest(request.id)}>Отклонить</Button>)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};
export default AddMembersToProjectPage;