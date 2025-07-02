// DeleteIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function DeleteIcon({onClick}) {
    const { theme } = useTheme();
    const deleteIconImg = theme ? require('../../icon pictures/delete_icon2.png') : require('../../icon pictures/delete_icon.png');
    
    return (
        <img
            src={deleteIconImg}
            alt='Удалить'
            className='icon'
            onClick={onClick}
        />
    );
}