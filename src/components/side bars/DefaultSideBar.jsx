// DefaultSideBar.jsx

import './sidebar.css';
import { Link } from 'react-router-dom';
import ExitIcon from "../../components/ExitIcon.jsx";

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
                        <Link to='/projects-list'>Список всех проектов</Link>
                    </li>
                    {is_admin ? (
                        <>
                            <li>
                                <Link to='/all-users-info'>Список всех пользователей системы</Link>
                            </li>
                            <li>
                                <Link to='/users-actions-page'>Действия пользователей в системе</Link>
                            </li>
                            <li>
                                <Link to='/users-management-page'>Управление пользователями</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to='/my-projects-list'>Список моих проектов</Link>
                        </li>
                    )}
                    <li>
                        <Link to='/profile-page' state={{ from: window.location.pathname }}>Профиль</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )

}
export default DefaultSideBar;