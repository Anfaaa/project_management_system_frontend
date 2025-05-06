import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function EditIcon({onClick}) {
    const { theme } = useTheme();
    const editIconImg = theme ? require('../icons/edit_icon2.png') : require('../icons/edit_icon.png');
    return (
        <img
            src={editIconImg}
            alt='Редактировать'
            className='icon'
            onClick={onClick}
        />
    )
}