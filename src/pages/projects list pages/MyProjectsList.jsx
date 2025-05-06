// MyProjectsList.jsx
import ProjectsListPageTemplate from "./ProjectsListPageTemplate.jsx";
import { GetMyProjectsList } from "../../API";

const MyProjectsList = () => {
        return <ProjectsListPageTemplate GetProjectsList={GetMyProjectsList} page_title="Список моих проектов"/>;
};
export default MyProjectsList;