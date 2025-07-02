// CalendarIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function CalendarIcon() {
    const { theme } = useTheme();
    const calendarIconImg = theme ? require('../../icon pictures/calendar_icon2.png') : require('../../icon pictures/calendar_icon.png');
    
    return (
        <img
            src={calendarIconImg}
            alt='Иконка календаря'
            className='sidebar-icon'
        />
    );
}