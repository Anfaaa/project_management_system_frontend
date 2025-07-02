// ProjectSideBar.jsx

import './sidebar.css';
import { Link } from 'react-router-dom';
import ExitIcon from "../../components/icons/ExitIcon.jsx";
import ListIcon from "../../components/icons/ListIcon.jsx";
import GroupIcon from '../icons/GroupIcon.jsx';
import ProfileIcon from '../icons/ProfileIcon.jsx';
import StatisticIcon from '../icons/StatisticIcon.jsx';
import CalendarIcon from '../icons/CalendarIcon.jsx';
import KanbanIcon from '../icons/KanbanIcon.jsx';

const ProjectSideBar = ({user_group, project_id}) => {
    const is_admin = JSON.parse(localStorage.getItem('is_admin'));

    const leave = () => {
        localStorage.removeItem('user_project_group');
    }

    return (
        <div className='sidebar'>
            <nav>
                <ul>
                    <li>
                        <ExitIcon/>
                    </li>
                    <li>
                        <Link to='/projects-list' onClick={leave}><strong>← Назад к списку проектов</strong></Link>
                    </li>
                    {is_admin ?
                    (
                        <li>
                            <Link to={`/project/${project_id}/tasks-all`}>
                                <ListIcon/>
                                Список всех задач
                            </Link>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to={`/project/${project_id}/tasks`}>
                                    <ListIcon/>
                                    Общий список задач
                                </Link>
                            </li>
                            <li>
                                <Link to={`/project/${project_id}/my-tasks`}>
                                    <ListIcon/>
                                    Список моих задач
                                </Link>
                            </li>
                            {user_group !== 'Исполнитель' && 
                            ( 
                                <>
                                    <li>
                                        <Link to={`/project/${project_id}/my-tasks-to-others`}>
                                            <ListIcon/>
                                            Список выданных мной задач
                                        </Link>
                                    </li>
                                    { user_group !== 'Менеджер' && 
                                    (
                                        <li>
                                            <Link to={`/project/${project_id}/change-member-group`}>
                                                <GroupIcon/>
                                                Изменение группы пользователей
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )}
                            <li>
                                <Link to="/calendar">
                                    <CalendarIcon/>
                                    Календарь
                                </Link>
                            </li>
                            <li>
                                <Link to="/kanban-board">
                                    <KanbanIcon/>
                                    Кан-бан с задачами
                                </Link>
                            </li>
                        </>)}
                    { user_group !== 'Исполнитель' && (
                        <>
                            <li>
                                <Link to={`/project/${project_id}/members-info`}>
                                    <GroupIcon/>
                                    Информация об участниках проекта</Link>
                            </li>
                            <li>
                                <Link to={`/project/${project_id}/statistics-page`}>
                                    <StatisticIcon/>
                                    Статистика
                                </Link>
                            </li>
                        </>)}
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

export default ProjectSideBar;