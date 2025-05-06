// MyTasksToOthersList.jsx

import TasksListPageTemplate from "./TasksListPageTemplate.jsx";
import { GetMyTasksToOthers } from "../../API";
import { useParams } from "react-router-dom";

const MyTasksToOthersList = () => {
    const { id } = useParams();

    return <TasksListPageTemplate id={id} GetTasksByProjectId={GetMyTasksToOthers} page_title="Список задач, выданных мной другим пользователям"
    showCreator={false}/>;
};

export default MyTasksToOthersList;