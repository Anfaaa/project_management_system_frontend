// App.js

import RemoveMembersFromProjectPage from './pages/members in project management pages/RemoveMembersFromProjectPage.jsx';
import ChangeProjectMemberGroupPage from './pages/members in project management pages/ChangeProjectMemberGroupPage.jsx';
import AddMembersToProjectPage from './pages/members in project management pages/AddMembersToProjectPage.jsx';
import ProjectMembersInfoPage from './pages/users info pages/ProjectMembersInfoPage.jsx';
import NotPrivateTasksList from './pages/tasks list pages/NotPrivateTasksList.jsx';
import MyTasksToOthersList from './pages/tasks list pages/MyTasksToOthersList.jsx';
import ConfirmResetPassword from './pages/login page/ConfirmResetPassword.jsx';
import AllProjectsList from './pages/projects list pages/AllProjectsList.jsx';
import UsersActionsPage from './pages/users info pages/UsersActionsPage.jsx';
import AllUsersInfoPage from './pages/users info pages/AllUsersInfoPage.jsx';
import MyProjectsList from './pages/projects list pages/MyProjectsList.jsx';
import RegistrationPage from './pages/registration page/RegistrationPage';
import ProjectDetails from './pages/project details/ProjectDetails.jsx';
import AllTasksList from './pages/tasks list pages/AllTasksList.jsx';
import MyTasksList from './pages/tasks list pages/MyTasksList.jsx';
import CalendarPage from './pages/calendar page/СalendarPage.jsx';
import UsersManagementPage from './pages/UsersManagementPage.jsx';
import EditProject from './pages/project details/EditProject.jsx';
import ResetPassword from './pages/login page/ResetPassword.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/profile page/ProfilePage.jsx';
import TaskDetails from './pages/task details/TaskDetails.jsx';
import KanbanBoard from './pages/kan-ban page/KanbanBoard.jsx';
import StartPage from './pages/start page/StartPage.jsx';
import LoginPage from './pages/login page/LoginPage.jsx';
import EditTask from './pages/task details/EditTask.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import './API/interceptors.js'; 

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          {/* users */}
          <Route path="/registration" element={<RegistrationPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/profile-page" element={<ProfilePage/>} />
          <Route path="/all-users-info" element={<AllUsersInfoPage/>} />
          <Route path="/users-actions-page" element={<UsersActionsPage/>} />
          <Route path="/password-reset" element={<ResetPassword/>} />
          <Route path="/password-reset-confirm/:uidb64/:token" element={<ConfirmResetPassword/>} />
          {/* projects */}
          <Route path="/projects-list" element={<AllProjectsList/>} />
          <Route path="/my-projects-list" element={<MyProjectsList/>} />
          <Route path="/projects/:id/details" element={<ProjectDetails/>} />
          <Route path="/project/:id/edit" element={<EditProject/>} />
          {/* tasks */}
          <Route path="/project/:id/tasks" element={<NotPrivateTasksList/>} />
          <Route path="/project/:id/tasks-all" element={<AllTasksList/>} />
          <Route path="/project/:id/my-tasks" element={<MyTasksList/>} />
          <Route path="/project/:id/my-tasks-to-others" element={<MyTasksToOthersList/>} />
          <Route path="/tasks/:id/details" element={<TaskDetails/>} />
          <Route path="/task/:id/edit" element={<EditTask/>} />
          <Route path="/calendar" element={<CalendarPage/>} />
          <Route path="/kanban-board" element={<KanbanBoard/>} />
          {/* statistics */}
          <Route path="/project/:id/statistics-page" element={<StatisticsPage/>} />
          {/* management */}
          <Route path="/project/:id/add-member" element={<AddMembersToProjectPage/>} />
          <Route path="/project/:id/remove-member" element={<RemoveMembersFromProjectPage/>} />
          <Route path="/project/:id/change-member-group" element={<ChangeProjectMemberGroupPage/>} />
          <Route path="/project/:id/members-info" element={<ProjectMembersInfoPage/>} />
          <Route path="/users-management-page" element={<UsersManagementPage/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}