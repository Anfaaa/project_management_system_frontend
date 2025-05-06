import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function SearchIcon({onClick}) {
    const { theme } = useTheme();
    const searchIconImg = theme ? require('../icons/search_icon2.png') : require('../icons/search_icon.png');
    return (
        <img
            src={searchIconImg}
            alt='Поиск'
            className='icon search-icon'
            onClick={onClick}
        />
    )
}