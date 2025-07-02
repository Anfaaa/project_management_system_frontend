// ProfileIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function ProfileIcon() {
    const { theme } = useTheme();
    const profileIconImg = theme ? require('../../icon pictures/profile_icon2.png') : require('../../icon pictures/profile_icon.png');
    
    return (
        <img
            src={profileIconImg}
            alt='Иконка профиля'
            className='sidebar-icon'
        />
    );
}