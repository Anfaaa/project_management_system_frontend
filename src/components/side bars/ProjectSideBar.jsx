// ProjectSideBar.jsx

import './sidebar.css';
import { Link } from 'react-router-dom';
import ExitIcon from "../../components/ExitIcon.jsx";

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
                            <Link to={`/project/${project_id}/tasks-all`}>Список всех задач</Link>
                        </li>
                    ) : (<>
                        <li>
                            <Link to={`/project/${project_id}/tasks`}>Общий список задач</Link>
                        </li>
                        <li>
                            <Link to={`/project/${project_id}/my-tasks`}>Список моих задач</Link>
                        </li>
                        {user_group !== 'Исполнитель' && ( 
                            <>
                                <li>
                                    <Link to={`/project/${project_id}/my-tasks-to-others`}>Список выданных мной задач</Link>
                                </li>
                                { user_group !== 'Менеджер' && (
                                    <li>
                                        <Link to={`/project/${project_id}/change-member-group`}>Изменение группы пользователей</Link>
                                    </li>
                                )}
                            </>
                        )}
                        <li>
                            <Link to="/calendar">Календарь</Link>
                        </li>
                        <li>
                            <Link to="/kanban-board">Кан-бан с задачами</Link>
                        </li>
                    </>)}
                    { user_group !== 'Исполнитель' && (<>
                    <li>
                        <Link to={`/project/${project_id}/members-info`}>Информация об участниках проекта</Link>
                    </li>
                    <li>
                        <Link to={`/project/${project_id}/statistics-page`}>Статистика</Link>
                    </li>
                    </>)}
                    <li>
                        <Link to='/profile-page' state={{ from: window.location.pathname }}>Профиль</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )

}
export default ProjectSideBar;