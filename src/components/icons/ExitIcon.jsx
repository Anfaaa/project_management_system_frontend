// ExitIcon.jsx

import "../../styles/icon.css";
import { useNavigate } from "react-router-dom";
import { UserLogout } from '../../API/usersAPI.js';
import { useTheme } from "../../ThemeContext";

export default function ExitIcon() {
    const { theme } = useTheme();
    const exitIconImg = theme ? require('../../icon pictures/exit_icon2.png') : require('../../icon pictures/exit_icon.png');
    const navigate = useNavigate();

    const exit = async () => {
        try {
            await UserLogout();
            const theme = localStorage.getItem('theme_preference');
            localStorage.clear();
            localStorage.setItem('theme_preference', theme);
            navigate('/login');
        }
        catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            alert('Произошла ошибка при выходе из системы!');
        }
    };

    return (
        <img
            src={exitIconImg}
            alt='Выйти'
            className='icon'
            onClick={exit}
        />
    );
}