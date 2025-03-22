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
                        <Link to='/projects-list'>Список проектов</Link>
                    </li>
                    {is_admin && (
                        <>
                            <li>
                                <Link to='/all_users_list'>Список всех пользователей системы</Link>
                            </li>
                            <li>
                                <Link to='/users_actions'>Действия пользователей в системе</Link>
                            </li>
                            <li>
                                <Link to='/users_management'>Управление пользователями</Link>
                            </li>
                        </>
                    )}
                    <li>
                        <Link to='/profile'>Профиль</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )

}
export default DefaultSideBar;