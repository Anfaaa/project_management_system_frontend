// SortIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function SortIcon({onClick}) {
    const { theme } = useTheme();
    const sortIconImg = theme ? require('../../icon pictures/sorting_icon2.png') : require('../../icon pictures/sorting_icon.png');
    
    return (
        <img
            src={sortIconImg}
            alt='Сортировка'
            className='icon'
            onClick={onClick}
        />
    );
}