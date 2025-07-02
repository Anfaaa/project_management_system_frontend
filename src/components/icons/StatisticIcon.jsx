// StatisticIcon.jsx

import "../../styles/icon.css";
import { useTheme } from "../../ThemeContext";

export default function StatisticIcon() {
    const { theme } = useTheme();
    const statisticIconImg = theme ? require('../../icon pictures/statistic_icon2.png') : require('../../icon pictures/statistic_icon.png');
    
    return (
        <img
            src={statisticIconImg}
            alt='Иконка статистики'
            className='sidebar-icon'
        />
    );
}