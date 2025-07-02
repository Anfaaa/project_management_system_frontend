// MyProjectsList.jsx

import ProjectsListPageTemplate from "./ProjectsListPageTemplate.jsx";
import { GetMyProjectsList } from "../../API/projectsAPI.js";

const MyProjectsList = () => {
        return <ProjectsListPageTemplate GetProjectsList={GetMyProjectsList} page_title="Список моих проектов"/>;
};

export default MyProjectsList;