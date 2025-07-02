// NotPrivateTasksList.jsx

import TasksListPageTemplate from "./TasksListPageTemplate.jsx";
import { GetNotPrivateTasks } from "../../API/tasksAPI.js";
import { useParams } from "react-router-dom";

const NotPrivateTasksList = () => {
    const { id } = useParams();

    return <TasksListPageTemplate id={id} GetTasksByProjectId={GetNotPrivateTasks} page_title="Общий список задач" />;
};

export default NotPrivateTasksList;