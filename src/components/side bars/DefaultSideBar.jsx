// DefaultSideBar.jsx

import './sidebar.css';
import { Link } from 'react-router-dom';
import ExitIcon from "../../components/icons/ExitIcon.jsx";
import ListIcon from "../../components/icons/ListIcon.jsx";
import GroupIcon from '../icons/GroupIcon.jsx';
import ProfileIcon from '../icons/ProfileIcon.jsx';

const DefaultSideBar = () => {
    const is_admin = JSON.parse(localStorage.getItem('is_admin'));

    return (
        <div className='sidebar'>
            <nav>
                <ul>
                    <li>
                        <ExitIcon/>
                    </li>
                    <li>
                        <Link to='/projects-list'>
                            <ListIcon/>
                            Список всех проектов
                        </Link>
                    </li>
                    {is_admin ? 
                    (
                        <>
                            <li>
                                <Link to='/all-users-info'>
                                    <ListIcon/>
                                    Список всех пользователей системы
                                </Link>
                            </li>
                            <li>
                                <Link to='/users-actions-page'>
                                    <GroupIcon/>
                                    Действия пользователей в системе
                                </Link>
                            </li>
                            <li>
                                <Link to='/users-management-page'>
                                    <GroupIcon/>
                                    Управление пользователями
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to='/my-projects-list'>
                                <ListIcon/>
                                Список моих проектов
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link to='/profile-page' state={{ from: window.location.pathname }}>
                            <ProfileIcon/>
                            Профиль
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default DefaultSideBar;