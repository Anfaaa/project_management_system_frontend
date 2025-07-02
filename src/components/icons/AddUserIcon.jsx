// AddUserIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function AddUserIcon({onClick}) {
    const { theme } = useTheme();
    const addUserIconImg = theme ? require('../../icon pictures/add_user_icon2.png') : require('../../icon pictures/add_user_icon.png');
    
    return (
        <img
            src={addUserIconImg}
            alt='Добавить участника'
            className='icon'
            onClick={onClick}
        />
    );
}