import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function AddUserIcon({onClick}) {
    const { theme } = useTheme();
    const addUserIconImg = theme ? require('../icons/add_user_icon2.png') : require('../icons/add_user_icon.png');
    return (
        <img
            src={addUserIconImg}
            alt='Добавить участника'
            className='icon'
            onClick={onClick}
        />
    )
}