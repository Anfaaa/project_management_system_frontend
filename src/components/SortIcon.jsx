import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function SortIcon({onClick}) {
    const { theme } = useTheme();
    const sortIconImg = theme ? require('../icons/sorting_icon2.png') : require('../icons/sorting_icon.png');
    return (
        <img
            src={sortIconImg}
            alt='Сортировка'
            className='icon'
            onClick={onClick}
        />
    )
}