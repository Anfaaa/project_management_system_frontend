// App.js

import {BrowserRouter, Routes, Route } from 'react-router-dom';
import StartPage from "./pages/start page/StartPage";
import RegistrationPage from './pages/registration page/RegistrationPage';
import LoginPage from './pages/login page/LoginPage';
import ProjectsListPage from './pages/projects list page/ProjectsListPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/registration" element={<RegistrationPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/projects-list" element={<ProjectsListPage/>} />
      </Routes>
    </BrowserRouter>
  );
}