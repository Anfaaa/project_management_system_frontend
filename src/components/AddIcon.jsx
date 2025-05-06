import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function AddIcon({onClick}) {
    const { theme } = useTheme();
    const addIconImg = theme ? require('../icons/add_icon2.png') : require('../icons/add_icon.png');
    return (
        <img
            src={addIconImg}
            alt='Добавить'
            className='icon'
            onClick={onClick}
        />
    )
}