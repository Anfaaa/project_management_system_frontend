// TasksListPageTemplate.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import ProjectSideBar from "../../components/side bars/ProjectSideBar.jsx";
import "../../styles/page-style-for-sidebar.css";
import "../../styles/icon.css";
import "../../styles/tools-segment.css";
import "../../styles/tasks_list.css";
import "../../styles/link.css";
import SortIcon from "../../components/icons/SortIcon.jsx";
import FilterIcon from "../../components/icons/FilterIcon.jsx";
import SearchIcon from "../../components/icons/SearchIcon.jsx";
import AddIcon from "../../components/icons/AddIcon.jsx";
import CreateTaskForm from "./CreateTaskForm.jsx";

const TasksListPageTemplate = ({ id, GetTasksByProjectId, page_title, showCreator = true, showAssignee = true }) => {
    const navigate = useNavigate();
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [tasks, setTasks] = useState([]);
    const is_admin = JSON.parse(localStorage.getItem('is_admin'));
    const current_user_group = JSON.parse(localStorage.getItem('user_project_group'));
    const [errorMessage, setErrorMessage] = useState('Похоже, заданий еще нет.');

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('');
    const [searchedObject, setSearchedObject] = useState('');

    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    // Фильтры
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCreator, setFilterCreator] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [filterAssignee, setFilterAssignee] = useState('');
    // Доступные варианты для фильтрации
    const [allStatuses, setAllStatuses] = useState([]);
    const [allCreators, setAllCreators] = useState([]);
    const [allPriorities, setAllPriorities] = useState([]);
    const [allAssignees, setAllAssignees] = useState([]);

    useEffect(() => {
        const GetTasks = async () => {
            try {
                const response = await GetTasksByProjectId(id);

                console.log('Получены задачи проекта:', response.data);

                setTasks(response.data);
                setAllCreators([...new Set(response.data.map(task => task.created_by_username))]);
                setAllAssignees([...new Set(response.data.map(task => task.assigned_to_username))]);
                setAllPriorities([...new Set(response.data.map(task => task.priority))]);
                setAllStatuses([...new Set(response.data.map(task => task.status))]);
            } 
            catch (error) {
                console.error('Ошибка при загрузке задач:', error);
                setErrorMessage('Ошибка при загрузке задач.');
            }
        };

        GetTasks();

        const interval = setInterval(() => {
            GetTasks(); // Запрос каждые 5 секунд
        }, 5000);

        return () => clearInterval(interval);

    }, [id, navigate, GetTasksByProjectId, createFormVisible]);

    const filteredTasks = tasks
        .filter(task => !filterStatus || task.status === filterStatus)
        .filter(task => !filterCreator || task.created_by_username === filterCreator)
        .filter(task => !filterPriority || task.priority === filterPriority)
        .filter(task => !filterAssignee || task.assigned_to_username === filterAssignee)
        .filter(task => !searchedObject || task.title.toLowerCase().includes(searchedObject.toLowerCase()));

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'created_at')
            comparison = new Date(a.created_at) - new Date(b.created_at);

        else if (sortBy === 'due_date')
            comparison = new Date(a.due_date) - new Date(b.due_date);

        else if (sortBy === 'updated_at')
            comparison = new Date(a.updated_at) - new Date(b.updated_at);

        return sortOrder === 'desc' ? -comparison : comparison;
    });

    var tasksExistence = tasks.length !== 0;

    return(
        <div className="page-container-for-sidebar">
            <ProjectSideBar user_group={current_user_group?.group_name_in_project} project_id={id}/>
            <div className="page-content">
                <h3>Текущий проект - «{tasks[0]?.project_name || current_user_group?.project_name}»</h3>
                <h1>{page_title}</h1>
                <div className="tools-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск задач..."
                            className="search-input"
                            value={searchedObject}
                            onChange={(e) => setSearchedObject(e.target.value)}
                        />
                        <SearchIcon/>
                    </div>
                    <div className="icons-container">
                        <div className="filter-container">
                            <FilterIcon onClick={() => setShowFilterOptions(!showFilterOptions)}/>
                            {showFilterOptions && (
                                <div className="filter-menu">
                                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="">Все статусы</option>
                                        {allStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <select value={filterCreator} onChange={(e) => setFilterCreator(e.target.value)}>
                                        <option value="">Все авторы</option>
                                        {allCreators.map(creator => (
                                            <option key={creator} value={creator}>{creator}</option>
                                        ))}
                                    </select>
                                    <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                                        <option value="">Все исполнители</option>
                                        {allAssignees.map(assignee => (
                                            <option key={assignee} value={assignee}>{assignee}</option>
                                        ))}
                                    </select>
                                    <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                                        <option value="">Все приоритеты</option>
                                        {allPriorities.map(priority => (
                                            <option key={priority} value={priority}>{priority}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="sort-container">
                            <SortIcon onClick={() => setShowSortOptions(!showSortOptions)}/>
                            {showSortOptions && (
                                <div className="sort-menu">
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="due_date">По дате сдачи</option>
                                        <option value="created_at">По дате создания</option>
                                        <option value="updated_at">По дате изменения</option>
                                    </select>
                                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value="asc">По возрастанию</option>
                                        <option value="desc">По убыванию</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        { !is_admin && (
                            <AddIcon
                                onClick={() => setCreateFormVisible(true)}
                            />
                        )}
                    </div>
                </div>
                { createFormVisible && (
                    <CreateTaskForm createFormHidden={() => setCreateFormVisible(false)} projectId = {id}/>
                )}
                { tasksExistence? (
                    <div className="tasks-grid">
                        {sortedTasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <Link className='link' to={`/tasks/${task.id}/details`} state={{ from: window.location.pathname, projectId: id }}>
                                    {task.title}
                                </Link>
                                <p>
                                    Дата сдачи: {new Date(task.due_date).toLocaleDateString()}<br/>
                                    {showAssignee && (`Исполнитель: ${task.assigned_to_first_name} ${task.assigned_to_last_name} (${task.assigned_to_username})`)}<br/>
                                    {showCreator && (`Автор: ${task.created_by_first_name} ${task.created_by_last_name} (${task.created_by_username})`)}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="tasks-grid">{errorMessage}</div>
                )}
            </div>
        </div>
    );
};

export default TasksListPageTemplate;