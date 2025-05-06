import "../styles/icon.css"
import { useTheme } from "../ThemeContext";

export default function RemoveUserIcon({onClick}) {
    const { theme } = useTheme();
    const removeUserIconImg = theme ? require('../icons/remove_user_icon2.png') : require('../icons/remove_user_icon.png');
    return (
        <img
            src={removeUserIconImg}
            alt='Исключить участника'
            className='icon'
            onClick={onClick}
        />
    )
}