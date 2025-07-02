// GroupIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function GroupIcon() {
    const { theme } = useTheme();
    const groupIconImg = theme ? require('../../icon pictures/group_icon2.png') : require('../../icon pictures/group_icon.png');
    
    return (
        <img
            src={groupIconImg}
            alt='Иконка группы пользователей'
            className='sidebar-icon'
        />
    );
}