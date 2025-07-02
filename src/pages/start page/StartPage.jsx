// StartPage.jsx

import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button.jsx";
import "./start-page.css";

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <div className='StartPage'>
            <h1>Project Manager</h1>
            <h2>Система управления ИТ-проектами</h2>
            <Button onClick={() => navigate('/registration')}>Зарегистрироваться</Button>
            <Button onClick={() => navigate('/login')}>Войти в систему</Button>
        </div>
    );
};

export default StartPage;