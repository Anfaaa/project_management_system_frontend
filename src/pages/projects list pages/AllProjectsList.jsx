// AllProjectsList.jsx

import ProjectsListPageTemplate from "./ProjectsListPageTemplate.jsx";
import { GetAllProjectsList } from "../../API";

const AllProjectsList = () => {
        return <ProjectsListPageTemplate GetProjectsList={GetAllProjectsList} page_title="Список всех проектов"/>;
};
export default AllProjectsList;