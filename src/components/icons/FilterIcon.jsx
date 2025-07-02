// FilterIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function FilterIcon({onClick}) {
    const { theme } = useTheme();
    const filterIconImg = theme ? require('../../icon pictures/filter_icon2.png') : require('../../icon pictures/filter_icon.png');
    
    return (
        <img
            src={filterIconImg}
            alt='Фильтрация'
            className='icon'
            onClick={onClick}
        />
    );
}