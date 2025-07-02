// AllUsersInfoPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllUsersInfo } from '../../API/usersAPI.js';
import DefaultSideBar from "../../components/side bars/DefaultSideBar.jsx";
import SortIcon from "../../components/icons/SortIcon.jsx";
import SearchIcon from "../../components/icons/SearchIcon.jsx";
import '../../styles/table.css';
import '../../styles/details-page.css';
import '../../styles/form.css';
import '../../styles/icon.css';

const AllUsersInfoPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchedObject, setSearchedObject] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('');
    const [showSortOptions, setShowSortOptions] = useState(false);

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const response = await GetAllUsersInfo();

                console.log('Получены пользователи:', response.data);
                setUsers(response.data);
            } 
            catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                alert('Произошла ошибка при загрузке пользователей, попробуйте позднее.');
            }
        };

        GetUsers();

    }, [navigate]);

    const filteredUsers = users.filter(user => {
        if (!searchedObject) return true;

        const search = searchedObject.toLowerCase();

        return (
            user.username?.toLowerCase().includes(search) ||
            user.first_name?.toLowerCase().includes(search) ||
            user.last_name?.toLowerCase().includes(search) ||
            user.projects?.some(project =>
                project.project_name?.toLowerCase().includes(search) ||
                project.group?.toLowerCase().includes(search)
            ) ||
            (user.is_admin && 'Администратор'.toLowerCase().includes(search)) ||
            (user.is_project_leader && 'Руководитель проектов'.toLowerCase().includes(search)) ||
            (!user.is_admin && !user.is_project_leader && 'Обычный пользователь'.toLowerCase().includes(search)) ||
            ((user.is_active === false) && 'Заблокирован'.toLowerCase().includes(search)) ||
            ((user.is_active === true) && 'Активен'.toLowerCase().includes(search))
        );
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'last_login')
            comparison = new Date(a.last_login) - new Date(b.last_login);

        else if (sortBy === 'date_joined')
            comparison = new Date(a.date_joined) - new Date(b.date_joined);

        return sortOrder === 'desc' ? -comparison : comparison;
    });

    return (
        <div className="page-container-for-sidebar">
            <DefaultSideBar/>
            <div className="page-content">
                <h1>Информация о всех пользователях</h1>
                <div className="tools-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск пользователей по личной информации, группе, роли или статусу..."
                            className="search-input"
                            value={searchedObject}
                            onChange={(e) => setSearchedObject(e.target.value)}
                        />
                        <SearchIcon/>
                    </div>
                    <div className="icons-container">
                        <div className="sort-container">
                            <SortIcon onClick={() => setShowSortOptions(!showSortOptions)}/>
                            {showSortOptions && (
                                <div className="sort-menu">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="date_joined">По дате регистрации</option>
                                        <option value="last_login">По дате входа</option>
                                    </select>
                                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value="asc">По возрастанию</option>
                                        <option value="desc">По убыванию</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Информация о пользователе</th>
                                <th>Членство в группах</th>
                                <th>Роль и привилегии</th>
                                <th>Дата последнего входа в систему</th>
                                <th>Дата регистрации</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        {user.first_name} {user.last_name} ({user.username}),<br/>
                                        email: {user.email}
                                    </td>
                                    <td>
                                        {user.projects.map(project => (
                                            <p key={project.id}> 
                                                «{project.project_name}» - {project.group_name}<br/>
                                            </p>
                                        ))}
                                    </td>
                                    <td>
                                        {user.is_admin ? (
                                            <span>Администратор</span>
                                        ) : user.is_project_leader ? (
                                            <span>Руководитель проектов</span>
                                        ) : (
                                            <span>Обычный пользователь</span>
                                        )}
                                    </td>
                                    <td>{new Date(user.last_login).toLocaleString()}</td>
                                    <td>{new Date(user.date_joined).toLocaleString()}</td>
                                    <td>
                                        {user.is_active ? (
                                            <span>Активен</span>
                                        ) : (
                                            <span>Заблокирован</span>
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

export default AllUsersInfoPage;