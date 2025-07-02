// ListIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function ListIcon() {
    const { theme } = useTheme();
    const listIconImg = theme ? require('../../icon pictures/list_icon2.png') : require('../../icon pictures/list_icon.png');
    
    return (
        <img
            src={listIconImg}
            alt='Иконка списка'
            className='sidebar-icon'
        />
    );
}