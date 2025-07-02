// AddIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function AddIcon({onClick}) {
    const { theme } = useTheme();
    const addIconImg = theme ? require('../../icon pictures/add_icon2.png') : require('../../icon pictures/add_icon.png');
    
    return (
        <img
            src={addIconImg}
            alt='Добавить'
            className='icon'
            onClick={onClick}
        />
    );
}