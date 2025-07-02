// RemoveUserIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function RemoveUserIcon({onClick}) {
    const { theme } = useTheme();
    const removeUserIconImg = theme ? require('../../icon pictures/remove_user_icon2.png') : require('../../icon pictures/remove_user_icon.png');
    
    return (
        <img
            src={removeUserIconImg}
            alt='Исключить участника'
            className='icon'
            onClick={onClick}
        />
    );
}