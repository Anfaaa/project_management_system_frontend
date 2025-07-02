// KanbanIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function KanbanIcon() {
    const { theme } = useTheme();
    const kanbanIconImg = theme ? require('../../icon pictures/kanban_icon2.png') : require('../../icon pictures/kanban_icon.png');
    
    return (
        <img
            src={kanbanIconImg}
            alt='Иконка канбан-доски'
            className='sidebar-icon'
        />
    );
}