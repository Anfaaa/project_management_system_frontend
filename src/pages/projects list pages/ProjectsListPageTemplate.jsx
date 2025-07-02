// ProjectsListPageTemplate.jsx

import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import DefaultSideBar from "../../components/side bars/DefaultSideBar.jsx";
import "../../styles/page-style-for-sidebar.css";
import "../../styles/icon.css";
import "../../styles/tools-segment.css";
import "../../styles/projects_list.css";
import "../../styles/link.css";
import CreateProjectForm from "./CreateProjectForm.jsx";
import SortIcon from "../../components/icons/SortIcon.jsx";
import FilterIcon from "../../components/icons/FilterIcon.jsx";
import SearchIcon from "../../components/icons/SearchIcon.jsx";
import AddIcon from "../../components/icons/AddIcon.jsx";

const ProjectsListPageTemplate = ({GetProjectsList, page_title}) => {
    const [createFormVisible, setCreateFormVisible] = useState(false);
    const [projects, setProjects] = useState([]);
    const is_project_leader = JSON.parse(localStorage.getItem('is_project_leader'));
    const [errorMessage, setErrorMessage] = useState('Похоже, проектов еще нет.');

    const [sortOrder, setSortOrder] = useState('asc');
    const [sortBy, setSortBy] = useState('');
    const [searchedObject, setSearchedObject] = useState('');
    
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showSortOptions, setShowSortOptions] = useState(false);
    // Фильтры
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCreator, setFilterCreator] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    // Доступные варианты для фильтрации
    const [allStatuses, setAllStatuses] = useState([]);
    const [allCreators, setAllCreators] = useState([]);
    const [allPriorities, setAllPriorities] = useState([]);

    useEffect(() => {
        const GetProjects = async () => {
            try {
                const response = await GetProjectsList();

                console.log('Получены проекты:', response.data);
                setProjects(response.data);

                setAllCreators([...new Set(response.data.map(project => project.created_by_username))]);
                setAllPriorities([...new Set(response.data.map(project => project.priority))]);
                setAllStatuses([...new Set(response.data.map(project => project.status))]);
            } 
            catch (error) {
                console.error('Ошибка при загрузке проектов:', error);
                setErrorMessage('Ошибка при загрузке проектов.');
            }
        };

        GetProjects();

        const interval = setInterval(() => {
            GetProjects(); // Запрос каждые 5 секунд
        }, 5000);

        return () => clearInterval(interval);

    }, [GetProjectsList, createFormVisible]);

    const filteredProjects = projects
        .filter(task => !filterStatus || task.status === filterStatus)
        .filter(task => !filterCreator || task.created_by_username === filterCreator)
        .filter(task => !filterPriority || task.priority === filterPriority)
        .filter(task => !filterPriority || task.priority === filterPriority)
        .filter(task => !searchedObject || task.title.toLowerCase().includes(searchedObject.toLowerCase()));

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'created_at')
            comparison = new Date(a.created_at) - new Date(b.created_at);

        else if (sortBy === 'due_date')
            comparison = new Date(a.due_date) - new Date(b.due_date);

        else if (sortBy === 'updated_at')
            comparison = new Date(a.updated_at) - new Date(b.updated_at);

        return sortOrder === 'desc' ? -comparison : comparison;
    });

    var projectsExistence = projects.length !== 0;

    return (
        <div className="page-container-for-sidebar">
            <DefaultSideBar/>
            <div className="page-content">
                <h1>{page_title}</h1>
                <div className="tools-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Поиск проектов..."
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
                        { is_project_leader && (
                            <AddIcon
                                onClick={() => setCreateFormVisible(true)}
                            />
                        )}
                    </div>
                </div>
                { createFormVisible && (
                    <CreateProjectForm createFormHidden={() => setCreateFormVisible(false)} />
                )}
                { projectsExistence ? (
                    <div className="projects-list">
                            {sortedProjects.map((project) => (
                                <div key={project.id} className="project-card">
                                    <Link className='link' to={`/projects/${project.id}/details`} state={{ from: window.location.pathname }}>
                                        {project.title}
                                    </Link>
                                    <p>
                                        Дата сдачи: {new Date(project.due_date).toLocaleDateString()}<br/>
                                        Статус: {project.status}<br/>
                                        Руководитель проекта: {project.created_by_first_name} {project.created_by_last_name} ({project.created_by_username})
                                    </p>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="projects-list">{errorMessage}</div>
                )}
            </div>
        </div>
    );
};

export default ProjectsListPageTemplate;