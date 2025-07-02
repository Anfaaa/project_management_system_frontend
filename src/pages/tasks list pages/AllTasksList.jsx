// AllTasksList.jsx

import TasksListPageTemplate from "./TasksListPageTemplate.jsx";
import { GetAllTasks } from "../../API/tasksAPI.js";
import { useParams } from "react-router-dom";

const AllTasksList = () => {
    const { id } = useParams();

    return <TasksListPageTemplate id={id} GetTasksByProjectId={GetAllTasks} page_title="Список всех задач"/>;
};

export default AllTasksList;