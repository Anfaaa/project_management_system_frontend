// BackIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function BackIcon({onClick}) {
    const { theme } = useTheme();
    const backIconImg = theme ? require('../../icon pictures/back_icon2.png') : require('../../icon pictures/back_icon.png');
    
    return (
        <img
            src={backIconImg}
            alt='Назад'
            className='icon icon-back'
            onClick={onClick}
        />
    );
}