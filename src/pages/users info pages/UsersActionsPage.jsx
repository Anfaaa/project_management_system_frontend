// UsersActionsPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetAllUsersInfo, GetActionTypes, GetUserActions } from '../../API.js';
import Button from '../../components/button/Button.jsx';
import DefaultSideBar from "../../components/side bars/DefaultSideBar.jsx";
import SortIcon from "../../components/SortIcon.jsx";
import SearchIcon from "../../components/SearchIcon.jsx";
import '../../styles/table.css';
import '../../styles/details-page.css'
import '../../styles/form.css'
import '../../styles/icon.css'

const UsersActionsPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [actionTypes, setActionTypes] = useState([]);
    const [UserActions, setUserActions] = useState([]);
    const [searchedObject, setSearchedObject] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [tableVisible, setTableVisible] = useState(false)
    const [showSortOptions, setShowSortOptions] = useState(false);

    useEffect(() => {
        const GetUsers = async () => {
            try {
                const response = await GetAllUsersInfo();
                console.log('Получены пользователи:', response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке пользователей:', error);
                if (error.response && error.response.status === 403) {
                    alert('У вас нет доступа к этому ресурсу');
                    navigate(`/projects-list`)
                }
            }
        };
        const GetTypes = async () => {
            try {
                const response = await GetActionTypes();
                console.log('Получены категории действий:', response.data);
                setActionTypes(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке категории действий:', error);
                if (error.response && error.response.status === 403) {
                    alert('У вас нет доступа к этому ресурсу');
                    navigate(`/projects-list`)
                }
            }
        };
        GetUsers();
        GetTypes();
    }, [navigate]);

    const handleShowTable = async () => {
        setTableVisible(true)
        if ((selectedUser !== '') && (selectedType !== '')) {
            try {
                const response = await GetUserActions(selectedUser, selectedType);
                    console.log('Получены данные:', response.data);
                    setUserActions(response.data);
            }
            catch (error) {
                if (error.response?.data) {
                    const errorData = error.response.data;
                    if (errorData.no_params)
                        alert(errorData.no_params);
                    else alert("Неизвестная ошибка при получении действий пользователя, попробуйте позже.");
                }
                else alert("Сервер не отвечает, попробуйте позже.");
            }
        }
        else alert('Пожалуйста, укажите и пользователя, и тип действия.')
    };

    const filteredActions = UserActions.filter(action => {
        if (!searchedObject) return true;
        const search = searchedObject.toLowerCase();
      
        return (
          action.status?.toLowerCase().includes(search) ||
          action.description?.toLowerCase().includes(search));
    });

    // Сортировка
    const sortedActions = [...filteredActions].sort((a, b) => {
        let comparison = 0;
        comparison = new Date(a.date_of_issue) - new Date(b.date_of_issue);
        return sortOrder === 'desc' ? -comparison : comparison;
    });


    return (
        <div className="page-container-for-sidebar">
            <DefaultSideBar/>
            <div className="page-content">
                <h1>Действия пользователей в системе</h1>
                <div className="tools-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск пользователей по личной информации, группе или роли..."
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
                                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value="asc">По возрастанию даты</option>
                                        <option value="desc">По убыванию даты</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p>
                    Выберите пользователя: <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Выберите пользователя:</option>
                        {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.first_name} {user.last_name} ({user.username})
                        </option>
                        ))}
                    </select>
                </p>
                <p>
                    Выберите категорию действия: <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="">Выберите категорию действия:</option>
                        {actionTypes.map(type => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                        ))}
                    </select>
                </p>
                <Button onClick={handleShowTable}>Показать диаграмму</Button>
                { tableVisible && (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Дата совершения действия</th>
                                    <th>Детали</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedActions.map(action => (
                                    <tr key={action.id}>
                                        <td>{new Date(action.date_of_issue).toLocaleString()}</td>
                                        <td>{action.description}</td>
                                        <td>{action.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
export default UsersActionsPage;