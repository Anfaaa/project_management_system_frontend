// ProjectsListPage.jsx

import { useState } from "react";
import DefaultSideBar from "../../components/side bars/DefaultSideBar";
import "../../styles/page-style-for-sidebar.css";
import CreateProjectForm from "./CreateProjectForm";
import useProjectsWebSocket from "../../hooks/useProjectsWebSocket";

const ProjectsListPage = () => {
    const [CreateFormVisible, setCreateFormVisible] = useState(false);
    const [projects, setProjects] = useState([]);
    const [sortBy, setSortBy] = useState('due_date');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCreator, setFilterCreator] = useState('');
    const [filterPriority, setFilterPriority] = useState('');

     // Включаем WebSocket для получения проектов
     useProjectsWebSocket(setProjects);


    return(
            <div className="page-container-for-sidebar">
                <DefaultSideBar/>
                <div className="page-content">
                    <h1>Here will be projects soon...</h1>
                    <CreateProjectForm></CreateProjectForm>
                {/* Рендерим проекты */}
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>{project.title}</li>
                    ))}
                </ul>
                </div>
            </div>
    )
}
export default ProjectsListPage;