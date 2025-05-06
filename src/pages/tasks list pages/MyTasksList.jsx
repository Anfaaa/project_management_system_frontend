// MyTasksList.jsx

import TasksListPageTemplate from "./TasksListPageTemplate.jsx";
import { GetMyTasks } from "../../API";
import { useParams } from "react-router-dom";

const MyTasksList = () => {
    const { id } = useParams();

    return <TasksListPageTemplate id={id} GetTasksByProjectId={GetMyTasks} page_title="Список моих задач" showAssignee={false} />;
};

export default MyTasksList;